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
  
  // Generate a unique ID for each link click
  const generateLinkId = (event: LinkClickEvent): string => {
    return `${event.componentName}-${event.linkIndex}-${event.timestamp}`
  }
  
  // Store link click in localStorage
  export const trackLinkClick = (componentName: string, linkIndex: number, linkText: string, linkUrl: string): string => {
    const event: LinkClickEvent = {
      componentName,
      linkIndex,
      linkText,
      linkUrl,
      timestamp: Date.now(),
    }
  
    // Generate a unique ID for this click
    const linkId = generateLinkId(event)
  
    // Store the event in localStorage
    const existingEvents = JSON.parse(localStorage.getItem("linkClickEvents") || "[]")
    existingEvents.push({ ...event, linkId })
    localStorage.setItem("linkClickEvents", JSON.stringify(existingEvents))
  
    // Store the current link ID for duration tracking
    localStorage.setItem("currentLinkId", linkId)
    localStorage.setItem("navigationStartTime", Date.now().toString())
  
    console.log(`Tracked click: ${componentName} - Link #${linkIndex} - "${linkText}"`)
  
    return linkId
  }
  
  // Track when user returns from a link
  export const trackReturnFromLink = (): void => {
    const linkId = localStorage.getItem("currentLinkId")
    const startTime = localStorage.getItem("navigationStartTime")
  
    if (linkId && startTime) {
      const duration = Date.now() - Number.parseInt(startTime)
  
      // Store the duration data
      const existingDurations = JSON.parse(localStorage.getItem("visitDurations") || "[]")
      existingDurations.push({
        linkId,
        duration,
        returnTimestamp: Date.now(),
      })
      localStorage.setItem("visitDurations", JSON.stringify(existingDurations))
  
      // Clear the current tracking
      localStorage.removeItem("currentLinkId")
      localStorage.removeItem("navigationStartTime")
  
      console.log(`Visit duration tracked: ${duration}ms`)
    }
  }
  
  // Get all analytics data
  export const getAnalyticsData = () => {
    const clickEvents = JSON.parse(localStorage.getItem("linkClickEvents") || "[]")
    const durations = JSON.parse(localStorage.getItem("visitDurations") || "[]")
  
    // Combine the data for easier analysis
    const combinedData = clickEvents.map((event: LinkClickEvent & { linkId: string }) => {
      const durationData = durations.find((d: VisitDuration) => d.linkId === event.linkId)
      return {
        ...event,
        duration: durationData ? durationData.duration : null,
        returnTimestamp: durationData ? durationData.returnTimestamp : null,
      }
    })
  
    return {
      rawClickEvents: clickEvents,
      rawDurations: durations,
      combinedData,
    }
  }
  
  // Clear all analytics data
  export const clearAnalyticsData = () => {
    localStorage.removeItem("linkClickEvents")
    localStorage.removeItem("visitDurations")
    localStorage.removeItem("currentLinkId")
    localStorage.removeItem("navigationStartTime")
  }
  