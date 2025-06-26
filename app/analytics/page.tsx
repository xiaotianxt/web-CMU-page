"use client"

import { useState, useEffect } from "react"
import {
  getAllAnalyticsData,
  clearAnalyticsData,
  exportAnalyticsData,
  getAnalyticsSummary,
  type TaskSession,
} from "@/lib/analytics"

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<{
    currentSession: TaskSession
    completedSessions: TaskSession[]
    allSessions: TaskSession[]
  } | null>(null)
  const [selectedSession, setSelectedSession] = useState<TaskSession | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    const data = getAllAnalyticsData()
    setAnalyticsData(data)
    if (data.allSessions.length > 0 && !selectedSession) {
      setSelectedSession(data.currentSession)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all analytics data? This cannot be undone.")) {
      clearAnalyticsData()
      setAnalyticsData(null)
      setSelectedSession(null)
      loadAnalyticsData()
    }
  }

  const handleExportData = () => {
    const jsonData = exportAnalyticsData()
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "Ongoing"
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const durationSec = Math.round(durationMs / 1000)
    const minutes = Math.floor(durationSec / 60)
    const seconds = durationSec % 60
    return `${minutes}m ${seconds}s`
  }

  if (!analyticsData) {
    return <div className="p-8">Loading analytics data...</div>
  }

  const summary = getAnalyticsSummary()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Research Analytics Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={handleExportData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export Data
          </button>
          <button onClick={handleClearData} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Clear All Data
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">{summary.totalSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Clicks</h3>
          <p className="text-3xl font-bold text-green-600">{summary.totalClicks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Avg Clicks/Session</h3>
          <p className="text-3xl font-bold text-purple-600">{summary.avgClicksPerSession}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Participant ID</h3>
          <p className="text-xl font-bold text-gray-800">{analyticsData.currentSession.participant_id}</p>
        </div>
      </div>

      {/* Click Source Distribution */}
      <div className="bg-white p-6 rounded-lg shadow border mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Click Source Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.clicksBySource.organic}</p>
            <p className="text-sm text-gray-600">Organic Results</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{summary.clicksBySource.overview}</p>
            <p className="text-sm text-gray-600">AI Overview</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{summary.clicksBySource.aiMode}</p>
            <p className="text-sm text-gray-600">AI Mode</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Session List */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Task Sessions</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {analyticsData.allSessions.map((session, index) => (
              <div
                key={session.task_id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedSession?.task_id === session.task_id ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{session.task_id}</h3>
                    <p className="text-sm text-gray-600">{session.treatment_group}</p>
                    <p className="text-xs text-gray-500">{new Date(session.task_start_time).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.click_sequence.length} clicks</p>
                    <p className="text-xs text-gray-500">
                      {formatDuration(session.task_start_time, session.task_end_time)}
                    </p>
                    {!session.task_end_time && <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Details */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Session Details: {selectedSession.task_id}</h2>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="font-medium">Participant:</span> {selectedSession.participant_id}
                  </div>
                  <div>
                    <span className="font-medium">Treatment:</span> {selectedSession.treatment_group}
                  </div>
                  <div>
                    <span className="font-medium">Topic:</span> {selectedSession.task_topic}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {selectedSession.task_type}
                  </div>
                  <div>
                    <span className="font-medium">Started:</span>{" "}
                    {new Date(selectedSession.task_start_time).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>{" "}
                    {formatDuration(selectedSession.task_start_time, selectedSession.task_end_time)}
                  </div>
                </div>
              </div>

              {/* Click Sequence */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Click Sequence ({selectedSession.click_sequence.length} clicks)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Page Title</th>
                        <th className="px-3 py-2 text-left">Page ID</th>
                        <th className="px-3 py-2 text-left">Position</th>
                        <th className="px-3 py-2 text-left">Source</th>
                        <th className="px-3 py-2 text-left">Dwell Time</th>
                        <th className="px-3 py-2 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSession.click_sequence.map((click, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{click.click_order}</td>
                          <td className="px-3 py-2">
                            <div className="max-w-xs truncate" title={click.page_title}>
                              {click.page_title}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                click.is_ad ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {click.page_id}
                            </span>
                          </td>
                          <td className="px-3 py-2">{click.position_in_serp}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              {click.from_overview && (
                                <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">OV</span>
                              )}
                              {click.from_ai_mode && (
                                <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">AI</span>
                              )}
                              {!click.from_overview && !click.from_ai_mode && (
                                <span className="px-1 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">ORG</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {click.dwell_time_sec !== null ? `${click.dwell_time_sec}s` : "-"}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {new Date(click.click_time).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                      {selectedSession.click_sequence.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                            No clicks recorded yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border p-8 text-center text-gray-500">
              Select a session to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
