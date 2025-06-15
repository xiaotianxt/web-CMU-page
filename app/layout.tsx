import type React from "react"
import "./globals.css"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { Suspense } from "react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
