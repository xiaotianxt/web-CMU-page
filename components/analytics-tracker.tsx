"use client"

import { useEffect } from "react"
import { trackReturnFromLink } from "@/lib/analytics"

export function AnalyticsTracker() {
  useEffect(() => {
    // Check if we're returning from a tracked link
    trackReturnFromLink()

    // Set up event listeners for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trackReturnFromLink()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // This component doesn't render anything
  return null
}
