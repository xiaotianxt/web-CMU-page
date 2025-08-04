// Analytics service for tracking link clicks and visit duration
import { deleteAllTaskRecords, saveTaskRecordWithRetry } from "@/lib/database-service"

// Types for our analytics data
export interface LinkClickEvent {
  componentName: string // Which component contained the link (e.g., "SearchResults", "AiOverview")
  linkIndex: number // Index of the link within the component
  linkText: string // Text content of the link
  linkUrl: string // URL of the link
  timestamp: number // When the click happened
}

export interface VisitDuration {
  linkId: string // Unique ID for the link click event
  duration: number // Duration in milliseconds
  returnTimestamp: number // When the user returned
}

// Types for research analytics data
export interface ClickEvent {
  taskId:string
  click_order: number
  page_title: string
  page_id: string
  is_ad: boolean
  position_in_serp: number
  click_time: string // ISO string
  dwell_time_sec: number | null
  from_overview: boolean
  from_ai_mode: boolean
}

export interface ShowMoreInteraction {
  click_order: number
  if_click: boolean
  click_time?: string
}

export interface TaskSession {
  taskId:string
  id:number
  participant_id: string
  sid: string
  treatment_group: string // e.g., "Top_OV_AI", "No_OV", "Mid_OV", etc.
  task_topic: string
  task_type: "product" | "info"
  task_start_time: string // ISO string
  task_end_time: string | null // ISO string, null if task is ongoing
  click_sequence: ClickEvent[]
  show_more_interactions: ShowMoreInteraction
}

// Generate a unique ID for each link click
const generateLinkId = (event: LinkClickEvent): string => {
  return `${event.componentName}-${event.linkIndex}-${event.timestamp}`
}

// Generate participant ID based on device/browser fingerprint
const generateParticipantId = (): string => {
  // Try to get existing participant ID first
  const existingId = localStorage.getItem("participant_id")
  if (existingId) return existingId

  const participantId = "000001"
  localStorage.setItem("participant_id", participantId)
  return participantId
}

// Extract treatment group and topic from URL
const extractUrlParams = () => {
  if (typeof window === "undefined") return { topic: "", treatmentGroup: "", participantId: "00001", sid: "00000" }

  const path = window.location.pathname
  const searchParams = new URLSearchParams(window.location.search)
  const segments = path.split("/").filter(Boolean)
  // Extract RID from query parameters, default to "00000" if not provided
  const participant_id = searchParams.get("RID") || "00001"
  const sid = searchParams.get("SID") || "00000"
  if (segments.length >= 3) {
    const topic = segments[0]
    const largeGroup = segments[1]
    const smallGroup = segments[2]
    const treatmentGroup = `${largeGroup}_${smallGroup}`

    return { topic, treatmentGroup, participant_id, sid }
  }

  // Default values for current implementation
  return { topic: "", treatmentGroup: "", participant_id, sid }
}

// Determine task type based on topic
const getTaskType = (topic: string): "product" | "info" => {
  const productTopics = ["Laptop", "Phone", "Car-vehicle", "Cruise"]
  return productTopics.includes(topic) ? "product" : "info"
}

// Save session to database with better error handling
const saveSessionToDatabase = async (session: TaskSession): Promise<boolean> => {
  
  try {
    console.log("Saving session to database:", session)
    const success = await saveTaskRecordWithRetry(session)
    if (success) {
      console.log("Session successfully saved to database")
      return true
    } else {
      console.error("Failed to save session to database after retries")
      return false
    }
  } catch (error) {
    console.error("Failed to save session to database:", error)
    return false
  }
}

function pad(num) {
  return num.toString().padStart(2, "0")
}

const changeCurrentDateTime = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
}

const createNewSession = async (): Promise<TaskSession> => {
  const { topic, treatmentGroup, participant_id, sid } = extractUrlParams()
  const taskType = getTaskType(topic)
  // Create new session
  const newSession: TaskSession = {
    taskId:`${sid}_${participant_id || generateParticipantId()}_${topic}_${treatmentGroup}`,
    id:0,
    participant_id: participant_id || generateParticipantId(),
    sid: sid,
    treatment_group: treatmentGroup,
    task_topic: topic,
    task_type: taskType,
    task_start_time: changeCurrentDateTime(),
    task_end_time: null,
    click_sequence: [],
    show_more_interactions: { click_order: -1, if_click: false, click_time: "" },
  }

  console.log("Creating new session:", newSession)
  localStorage.setItem("current_task_session", JSON.stringify(newSession))

  // Save to database asynchronously
  const result = await saveSessionToDatabase(newSession)
  console.log('新增完成',result);
  

  return newSession
}

// Get current task session
const getCurrentTaskSession =  async(): Promise<TaskSession> => {
  const { topic, treatmentGroup, participantId, sid } = extractUrlParams()
  const taskType = getTaskType(topic)

  // Try to get existing session
  const existingSession = localStorage.getItem("current_task_session")
  if (existingSession) {
    const session: TaskSession = JSON.parse(existingSession)
    console.log(session);
    
    if (session.treatment_group != treatmentGroup || session.task_topic != topic || session.task_type != taskType) {
      console.log("Session parameters changed, ending current session and creating new one")
      endTaskSession()
      return await createNewSession()
    }
    return session
  } else {
    console.log("No existing session found, creating new one")
    return await createNewSession()
  }
}

// Store link click in localStorage
export const trackLinkClick = async (componentName: string, linkIndex: number, linkText: string, linkUrl: string): Promise<string> => {
  console.log("Tracking link click");
  
  const session = await getCurrentTaskSession()
  console.log("session",session);
  
  const clickTime = changeCurrentDateTime()

  // Determine page_id and other properties based on component
  let pageId = ""
  let isAd = false
  const positionInSerp = linkIndex + 1
  let fromOverview = false
  let fromAiMode = false

  // Map component names to page IDs and properties
  switch (componentName) {
    case "SearchResults":
      pageId = `organic_${linkIndex + 1}`
      isAd = false
      break
    case "SearchResults-Sitelinks":
      pageId = `sitelink_${linkIndex + 1}`
      isAd = false
      break
    case "AiOverview":
    // case "AiOverview-References":
      pageId = `overview_ref_${linkIndex + 1}`
      isAd = false
      fromOverview = true
      break
    case "AiMode-Sidebar":
      pageId = `ai_mode_ref_${linkIndex + 1}`
      isAd = false
      fromAiMode = true
      break
    case "SearchTabs":
      pageId = `tab_${linkIndex + 1}`
      isAd = false
      break
    case "PeopleAlsoSearch":
      pageId = `related_${linkIndex + 1}`
      isAd = false
      break
    default:
      pageId = `other_${linkIndex + 1}`
      isAd = false
  }

  const clickEvent: ClickEvent = {
    taskId:session.taskId,
    click_order:
      session.click_sequence.length > session.show_more_interactions.click_order
        ? session.click_sequence.length + 1
        : session.show_more_interactions.click_order + 1,
    page_title: linkText,
    page_id: pageId,
    is_ad: isAd,
    position_in_serp: positionInSerp,
    click_time: clickTime,
    dwell_time_sec: null, // Will be updated when user returns
    from_overview: fromOverview,
    from_ai_mode: fromAiMode,
  }

  // Add click to session
  session.click_sequence.push(clickEvent)
  console.log("当前session.click_sequence:",session);
  
  localStorage.setItem("current_task_session", JSON.stringify(session))

  console.log(`Tracked click: ${pageId} - "${linkText}", updating database...`)

  // Save updated session to database
  const result = await saveSessionToDatabase(session)
  console.log('保存结果',result);

  // Store click info for dwell time calculation
  const clickId = `${session.sid}_${session.participant_id}_${session.task_topic}_${session.treatment_group}_${clickEvent.click_order}`
  localStorage.setItem("current_click_id", clickId)
  localStorage.setItem("click_start_time", Date.now().toString())
  if (result) {
    return clickId
  }

  return clickId
}

export const trackButtonClick = async (ifClick: boolean): Promise<void> => {
  const currSession = await getCurrentTaskSession()
  const clickTime = changeCurrentDateTime()
  console.log('trackButtonClick',currSession);
  

  const showMoreInteraction: ShowMoreInteraction = {
    click_order: currSession.click_sequence.length + 1,
    click_time: clickTime,
    if_click: ifClick || currSession.show_more_interactions.if_click,
  }

  currSession.show_more_interactions = showMoreInteraction

  // Add button interaction to session
  localStorage.setItem("current_task_session", JSON.stringify(currSession))

  console.log("Tracked button click, updating database...")
  saveSessionToDatabase(currSession)
}

// Track when user returns from a link
export const trackReturnFromLink = async (): Promise<void> => {
  const clickId = localStorage.getItem("current_click_id")
  const startTime = localStorage.getItem("click_start_time")

  if (clickId && startTime) {
    const dwellTimeMs = Date.now() - Number.parseInt(startTime)
    const dwellTimeSec = Math.round((dwellTimeMs / 1000) * 10) / 10 // Round to 1 decimal

    // Update the click event with dwell time
    const session = await getCurrentTaskSession()
    const [sid, participantId, taskTopic, largeGroup, smallGroup, clickOrder] = clickId.split("_")

    if (
      
        session.participant_id.toString() +
        session.task_topic.toString() +
        session.treatment_group.toString() ===
       participantId + taskTopic + largeGroup + "_" + smallGroup
    ) {
      const clickIndex = Number.parseInt(clickOrder) - 1
      if (session.click_sequence[clickIndex]) {
        session.click_sequence[clickIndex].dwell_time_sec = dwellTimeSec
        localStorage.setItem("current_task_session", JSON.stringify(session))

        console.log(`Dwell time recorded: ${dwellTimeSec}s, updating database...`)
        // Save updated session to database
        saveSessionToDatabase(session)
      }
    }

    // Clear tracking data
    localStorage.removeItem("current_click_id")
    localStorage.removeItem("click_start_time")
  }
}

export const endTaskSession = (): void => {
  const sessionRaw = localStorage.getItem("current_task_session")
  if (!sessionRaw) return

  const session: TaskSession = JSON.parse(sessionRaw)
  session.task_end_time = changeCurrentDateTime()
  saveSessionToDatabase(session)

  localStorage.removeItem("current_task_session")

  console.log(
    `Task ${session.sid + session.participant_id + session.task_topic + session.treatment_group} ended, saving final state to database...`,
  )
 
}

// Get all task sessions
export const getAllTaskSessions = (): TaskSession[] => {
  const sessions = localStorage.getItem("task_sessions")
  return sessions ? JSON.parse(sessions) : []
}

// Get current session (including ongoing)
export const getCurrentSession = (): TaskSession | null => {
  const currentSession = localStorage.getItem("current_task_session")
  return currentSession ? JSON.parse(currentSession) : null
}

// Initialize session tracking
export const initializeSession = (): void => {
  // This will create a new session if none exists
  console.log("Initializing session...");
  
  getCurrentTaskSession()
  console.log("Init end!!!-----Current session:");
  
}

// Clear all analytics data
export const clearAllAnalyticsData = (): void => {
  localStorage.removeItem("task_sessions")
  localStorage.removeItem("current_task_session")
  localStorage.removeItem("current_click_id")
  localStorage.removeItem("click_start_time")
  localStorage.removeItem("participant_id")
  deleteAllTaskRecords()
}

// Export data for research
export const exportResearchData = (): TaskSession[] => {
  const allSessions = getAllTaskSessions()
  const currentSession = getCurrentSession()

  if (currentSession) {
    // Include current ongoing session
    return [...allSessions, currentSession]
  }

  return allSessions
}
