// Analytics service for tracking link clicks and visit duration

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
  click_order: number,
  if_click: boolean,
  click_time?: String 
}

export interface TaskSession {
  participant_id: string
  task_id: number
  treatment_group: string // e.g., "Top_OV_AI", "No_OV", "Mid_OV", etc.
  task_topic: string
  task_type: "product" | "info"
  task_start_time: string // ISO string
  task_end_time: string | null // ISO string, null if task is ongoing
  click_sequence: ClickEvent[],
  show_more_interactions: boolean
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

  // Generate new participant ID using browser fingerprint
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx?.fillText("fingerprint", 10, 10)
  const canvasFingerprint = canvas.toDataURL()

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint.slice(-50), // Last 50 chars of canvas fingerprint
  ].join("|")

  // Create a simple hash
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  const participantId = `P${Math.abs(hash).toString().padStart(6, "0")}`
  localStorage.setItem("participant_id", participantId)
  return participantId
}

// Extract treatment group and topic from URL
const extractUrlParams = () => {
  if (typeof window === "undefined") return { topic: "", treatmentGroup: "" }

  const path = window.location.pathname
  const segments = path.split("/").filter(Boolean)

  if (segments.length >= 3) {
    const topic = segments[0]
    const largeGroup = segments[1]
    const smallGroup = segments[2]
    const treatmentGroup = `${largeGroup}_${smallGroup}`

    return { topic, treatmentGroup }
  }

  // Default values for current implementation
  return { topic: "Laptop", treatmentGroup: "Top_OV_AI" }
}

// Determine task type based on topic
const getTaskType = (topic: string): "product" | "info" => {
  const productTopics = ["Laptop", "Phone", "Car-vehicle", "Cruise"]
  return productTopics.includes(topic) ? "product" : "info"
}

// Get current task session
const getCurrentTaskSession = (): TaskSession => {
  const participantId = generateParticipantId()
  const { topic, treatmentGroup } = extractUrlParams()
  const taskType = getTaskType(topic)

  // Try to get existing session
  const existingSession = localStorage.getItem("current_task_session")
  if (existingSession) {
    const session: TaskSession = JSON.parse(existingSession)
    // Update URL-dependent fields in case of navigation
    session.treatment_group = treatmentGroup
    session.task_topic = topic
    session.task_type = taskType
    return session
  }

  // Get next task ID
  const allSessions = getAllTaskSessions()
  const nextTaskId = allSessions.length + 1

  // Create new session
  const newSession: TaskSession = {
    participant_id: participantId,
    task_id: nextTaskId,
    treatment_group: treatmentGroup,
    task_topic: topic,
    task_type: taskType,
    task_start_time: new Date().toISOString(),
    task_end_time: null,
    click_sequence: [],
    show_more_interactions: false
  }

  localStorage.setItem("current_task_session", JSON.stringify(newSession))
  return newSession
}

// Store link click in localStorage
export const trackLinkClick = (componentName: string, linkIndex: number, linkText: string, linkUrl: string): string => {
  const session = getCurrentTaskSession()
  const clickTime = new Date().toISOString()

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
    case "AiOverview-References":
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
    click_order: session.click_sequence.length + 1,
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
  localStorage.setItem("current_task_session", JSON.stringify(session))

  // Store click info for dwell time calculation
  const clickId = `${session.task_id}_${clickEvent.click_order}`
  localStorage.setItem("current_click_id", clickId)
  localStorage.setItem("click_start_time", Date.now().toString())

  console.log(`Tracked click: ${pageId} - "${linkText}"`)
  return clickId
}

export const trackButtonClick = (ifClick: boolean): void => {
  const currSession = getCurrentTaskSession()
  const clickTime = new Date().toISOString()

  const showMoreInteraction: ShowMoreInteraction = {
    click_order: currSession.click_sequence.length + 1,
    click_time: clickTime,
    if_click: ifClick
  }

// Add button interaction to session
localStorage.setItem("current_task_session", JSON.stringify(showMoreInteraction))
}

// Track when user returns from a link
export const trackReturnFromLink = (): void => {
  const clickId = localStorage.getItem("current_click_id")
  const startTime = localStorage.getItem("click_start_time")

  if (clickId && startTime) {
    const dwellTimeMs = Date.now() - Number.parseInt(startTime)
    const dwellTimeSec = Math.round((dwellTimeMs / 1000) * 10) / 10 // Round to 1 decimal

    // Update the click event with dwell time
    const session = getCurrentTaskSession()
    const [taskId, clickOrder] = clickId.split("_")

    if (session.task_id.toString() === taskId) {
      const clickIndex = Number.parseInt(clickOrder) - 1
      if (session.click_sequence[clickIndex]) {
        session.click_sequence[clickIndex].dwell_time_sec = dwellTimeSec
        localStorage.setItem("current_task_session", JSON.stringify(session))
      }
    }

    // Clear tracking data
    localStorage.removeItem("current_click_id")
    localStorage.removeItem("click_start_time")

    console.log(`Dwell time recorded: ${dwellTimeSec}s`)
  }
}

// End current task session
export const endTaskSession = (): void => {
  const session = getCurrentTaskSession()
  session.task_end_time = new Date().toISOString()

  // Save completed session to history
  const allSessions = getAllTaskSessions()
  const existingIndex = allSessions.findIndex((s) => s.task_id === session.task_id)

  if (existingIndex >= 0) {
    allSessions[existingIndex] = session
  } else {
    allSessions.push(session)
  }

  localStorage.setItem("task_sessions", JSON.stringify(allSessions))
  localStorage.removeItem("current_task_session")

  console.log(`Task ${session.task_id} ended`)
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
  getCurrentTaskSession()

  // Set up beforeunload event to end session when user leaves
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      endTaskSession()
    })

    // Also track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        trackReturnFromLink()
      }
    })
  }
}

// Clear all analytics data
export const clearAllAnalyticsData = (): void => {
  localStorage.removeItem("task_sessions")
  localStorage.removeItem("current_task_session")
  localStorage.removeItem("current_click_id")
  localStorage.removeItem("click_start_time")
  localStorage.removeItem("participant_id")
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
