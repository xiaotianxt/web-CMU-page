// Enhanced Analytics service for research tracking

// Types for the new analytics structure
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
    url: string // Added for reference
  }
  
  export interface TaskSession {
    participant_id: string
    task_id: string
    treatment_group: string
    task_topic: string
    task_type: string
    task_start_time: string // ISO string
    task_end_time: string | null // ISO string, null if session is ongoing
    click_sequence: ClickEvent[]
  }
  
  // Generate participant ID from browser fingerprint/IP simulation
  const generateParticipantId = (): string => {
    // In a real implementation, you might use actual IP or more sophisticated fingerprinting
    // For now, we'll create a persistent ID based on browser characteristics
    let participantId = localStorage.getItem("participant_id")
  
    if (!participantId) {
      // Create a pseudo-unique ID based on browser characteristics
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      ctx!.textBaseline = "top"
      ctx!.font = "14px Arial"
      ctx!.fillText("Browser fingerprint", 2, 2)
  
      const fingerprint = canvas.toDataURL()
      const hash = fingerprint.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
  
      participantId = `P${Math.abs(hash).toString().substring(0, 6)}`
      localStorage.setItem("participant_id", participantId)
    }
  
    return participantId
  }
  
  // Get next task ID
  const getNextTaskId = (): string => {
    const lastTaskId = localStorage.getItem("last_task_id")
    const nextId = lastTaskId ? Number.parseInt(lastTaskId) + 1 : 1
    localStorage.setItem("last_task_id", nextId.toString())
    return `task${nextId}`
  }
  
  // Initialize new task session
  export const initializeTaskSession = (): TaskSession => {
    const participantId = generateParticipantId()
    const taskId = getNextTaskId()
  
    const session: TaskSession = {
      participant_id: participantId,
      task_id: taskId,
      treatment_group: "Top_OV_AI",
      task_topic: "Laptop",
      task_type: "transactional",
      task_start_time: new Date().toISOString(),
      task_end_time: null,
      click_sequence: [],
    }
  
    localStorage.setItem("current_session", JSON.stringify(session))
    console.log(`New task session initialized: ${taskId} for participant ${participantId}`)
  
    return session
  }
  
  // Get current session or create new one
  export const getCurrentSession = (): TaskSession => {
    const sessionData = localStorage.getItem("current_session")
  
    if (sessionData) {
      try {
        return JSON.parse(sessionData)
      } catch (e) {
        console.warn("Invalid session data, creating new session")
      }
    }
  
    return initializeTaskSession()
  }
  
  // Generate page ID based on component and position
  const generatePageId = (componentName: string, linkIndex: number, isAd = false): string => {
    if (isAd) {
      return `ad_${linkIndex + 1}`
    }
  
    switch (componentName) {
      case "SearchResults":
        return `organic_${linkIndex + 1}`
      case "AiOverview":
      case "AiOverview-References":
        return `overview_${linkIndex + 1}`
      case "AiMode-Sidebar":
        return `ai_mode_${linkIndex + 1}`
      case "SearchResults-Sitelinks":
        return `sitelink_${linkIndex + 1}`
      case "PeopleAlsoAsk":
        return `paa_${linkIndex + 1}`
      case "VideosSection":
        return `video_${linkIndex + 1}`
      case "DiscussionsForums":
        return `forum_${linkIndex + 1}`
      case "WhatPeopleSaying":
        return `review_${linkIndex + 1}`
      case "PeopleAlsoSearch":
        return `related_${linkIndex + 1}`
      default:
        return `other_${linkIndex + 1}`
    }
  }
  
  // Determine position in SERP based on component and index
  const getSerpPosition = (componentName: string, linkIndex: number): number => {
    switch (componentName) {
      case "SearchResults":
        return linkIndex + 1 // Direct position in organic results
      case "AiOverview":
      case "AiOverview-References":
        return 0 // Overview is above organic results
      case "AiMode-Sidebar":
        return 0 // AI mode sidebar
      case "SearchResults-Sitelinks":
        return linkIndex + 1 // Same as parent result
      case "PeopleAlsoAsk":
        return 20 + linkIndex // After organic results
      case "VideosSection":
        return 30 + linkIndex
      case "DiscussionsForums":
        return 40 + linkIndex
      case "WhatPeopleSaying":
        return 50 + linkIndex
      case "PeopleAlsoSearch":
        return 60 + linkIndex
      default:
        return 100 + linkIndex
    }
  }
  
  // Check if click is from overview or AI mode
  const getClickSource = (componentName: string) => {
    const fromOverview = componentName.includes("AiOverview") || componentName.includes("Overview")
    const fromAiMode = componentName.includes("AiMode")
  
    return { fromOverview, fromAiMode }
  }
  
  // Track link click with enhanced data
  export const trackLinkClick = (
    componentName: string,
    linkIndex: number,
    linkText: string,
    linkUrl: string,
    isAd = false,
  ): string => {
    const session = getCurrentSession()
    const clickTime = new Date().toISOString()
    const { fromOverview, fromAiMode } = getClickSource(componentName)
  
    const clickEvent: ClickEvent = {
      click_order: session.click_sequence.length + 1,
      page_title: linkText,
      page_id: generatePageId(componentName, linkIndex, isAd),
      is_ad: isAd,
      position_in_serp: getSerpPosition(componentName, linkIndex),
      click_time: clickTime,
      dwell_time_sec: null, // Will be filled when user returns
      from_overview: fromOverview,
      from_ai_mode: fromAiMode,
      url: linkUrl,
    }
  
    session.click_sequence.push(clickEvent)
    localStorage.setItem("current_session", JSON.stringify(session))
  
    // Store current click for dwell time tracking
    localStorage.setItem(
      "current_click",
      JSON.stringify({
        clickIndex: session.click_sequence.length - 1,
        startTime: Date.now(),
      }),
    )
  
    console.log(`Tracked click ${clickEvent.click_order}: ${clickEvent.page_id} - "${linkText}"`)
  
    return `${session.task_id}_${clickEvent.click_order}`
  }
  
  // Track return from link (calculate dwell time)
  export const trackReturnFromLink = (): void => {
    const currentClickData = localStorage.getItem("current_click")
  
    if (currentClickData) {
      try {
        const { clickIndex, startTime } = JSON.parse(currentClickData)
        const dwellTime = (Date.now() - startTime) / 1000 // Convert to seconds
  
        const session = getCurrentSession()
        if (session.click_sequence[clickIndex]) {
          session.click_sequence[clickIndex].dwell_time_sec = Math.round(dwellTime * 10) / 10 // Round to 1 decimal
          localStorage.setItem("current_session", JSON.stringify(session))
  
          console.log(`Dwell time recorded: ${dwellTime}s for click ${clickIndex + 1}`)
        }
  
        localStorage.removeItem("current_click")
      } catch (e) {
        console.warn("Error processing return from link:", e)
      }
    }
  }
  
  // End current task session
  export const endTaskSession = (): void => {
    const session = getCurrentSession()
    session.task_end_time = new Date().toISOString()
  
    // Save completed session to history
    const completedSessions = getCompletedSessions()
    completedSessions.push(session)
    localStorage.setItem("completed_sessions", JSON.stringify(completedSessions))
  
    // Clear current session
    localStorage.removeItem("current_session")
    localStorage.removeItem("current_click")
  
    console.log(`Task session ended: ${session.task_id}`)
  }
  
  // Get all completed sessions
  export const getCompletedSessions = (): TaskSession[] => {
    const sessionsData = localStorage.getItem("completed_sessions")
    if (sessionsData) {
      try {
        return JSON.parse(sessionsData)
      } catch (e) {
        console.warn("Error parsing completed sessions")
      }
    }
    return []
  }
  
  // Get all analytics data (current + completed)
  export const getAllAnalyticsData = () => {
    const currentSession = getCurrentSession()
    const completedSessions = getCompletedSessions()
  
    return {
      currentSession,
      completedSessions,
      allSessions: [...completedSessions, currentSession],
    }
  }
  
  // Clear all analytics data
  export const clearAnalyticsData = (): void => {
    localStorage.removeItem("current_session")
    localStorage.removeItem("completed_sessions")
    localStorage.removeItem("current_click")
    localStorage.removeItem("last_task_id")
    // Don't clear participant_id as it should persist across sessions
  
    console.log("Analytics data cleared")
  }
  
  // Export data for research
  export const exportAnalyticsData = (): string => {
    const data = getAllAnalyticsData()
    return JSON.stringify(data.allSessions, null, 2)
  }
  
  // Get summary statistics
  export const getAnalyticsSummary = () => {
    const { allSessions } = getAllAnalyticsData()
  
    const totalSessions = allSessions.length
    const totalClicks = allSessions.reduce((sum, session) => sum + session.click_sequence.length, 0)
    const avgClicksPerSession = totalSessions > 0 ? totalClicks / totalSessions : 0
  
    const clicksBySource = allSessions.reduce(
      (acc, session) => {
        session.click_sequence.forEach((click) => {
          if (click.from_overview) acc.overview++
          else if (click.from_ai_mode) acc.aiMode++
          else acc.organic++
        })
        return acc
      },
      { organic: 0, overview: 0, aiMode: 0 },
    )
  
    return {
      totalSessions,
      totalClicks,
      avgClicksPerSession: Math.round(avgClicksPerSession * 10) / 10,
      clicksBySource,
    }
  }
  