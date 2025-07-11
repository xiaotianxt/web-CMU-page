'use client'

import { useEffect } from "react"
import { trackReturnFromLink, initializeTaskSession, endTaskSession } from "@/lib/analytics"

export function AnalyticsTracker() {
  useEffect(() => {
    // Initialize session when component mounts (app opens)
    initializeTaskSession()

    // Check if we're returning from a tracked link
    trackReturnFromLink()

    // Set up event listeners for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trackReturnFromLink()
      }
    }

    // Handle page unload (app closing)
    const handleBeforeUnload = () => {
      endTaskSession()
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      trackReturnFromLink()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // This component doesn't render anything
  return null
}
