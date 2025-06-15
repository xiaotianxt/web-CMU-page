"use client"

import { useState, useEffect } from "react"
import { getAnalyticsData, clearAnalyticsData } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    // Load analytics data
    const data = getAnalyticsData()
    setAnalyticsData(data)
  }, [])

  const handleClearData = () => {
    clearAnalyticsData()
    setAnalyticsData(getAnalyticsData())
  }

  if (!analyticsData) {
    return <div className="p-8">Loading analytics data...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Link Analytics Dashboard</h1>

      <div className="mb-6">
        <button onClick={handleClearData} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Clear All Analytics Data
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Link Click Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Component</th>
                <th className="px-4 py-2 border">Link Index</th>
                <th className="px-4 py-2 border">Link Text</th>
                <th className="px-4 py-2 border">URL</th>
                <th className="px-4 py-2 border">Click Time</th>
                <th className="px-4 py-2 border">Duration</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.combinedData.map((event: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{event.componentName}</td>
                  <td className="px-4 py-2 border">{event.linkIndex}</td>
                  <td className="px-4 py-2 border">{event.linkText}</td>
                  <td className="px-4 py-2 border">
                    <a
                      href={event.linkUrl}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.linkUrl.length > 30 ? `${event.linkUrl.substring(0, 30)}...` : event.linkUrl}
                    </a>
                  </td>
                  <td className="px-4 py-2 border">{new Date(event.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    {event.duration ? `${(event.duration / 1000).toFixed(1)}s` : "N/A"}
                  </td>
                </tr>
              ))}
              {analyticsData.combinedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center">
                    No link click data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Component Click Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(
            analyticsData.rawClickEvents.reduce((acc: any, event: any) => {
              acc[event.componentName] = (acc[event.componentName] || 0) + 1
              return acc
            }, {}),
          ).map(([component, count]: [string, any]) => (
            <div key={component} className="bg-white p-4 border rounded shadow">
              <div className="font-medium">{component}</div>
              <div className="text-2xl">{count} clicks</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
