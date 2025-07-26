"use client"

import { useState, useEffect } from "react"
import { exportResearchData, clearAllAnalyticsData, getCurrentSession, type TaskSession } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<TaskSession[]>([])
  const [currentSession, setCurrentSession] = useState<TaskSession | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allSessions = exportResearchData()
    const current = getCurrentSession()

    // Separate completed and current sessions
    const completedSessions = allSessions.filter((s) => s.task_end_time !== null)
    setSessions(completedSessions)
    setCurrentSession(current)
  }

  const handleClearData = () => {
    clearAllAnalyticsData()
    loadData()
  }

  const handleExportData = () => {
    const data = exportResearchData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `research_data_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "Ongoing"
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const durationSec = Math.round(durationMs / 1000)
    return `${durationSec}s`
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Research Analytics Dashboard</h1>

      <div className="mb-6 flex gap-4">
        <button onClick={handleClearData} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Clear All Data
        </button>
        <button onClick={handleExportData} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Export JSON Data
        </button>
        <button onClick={loadData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Refresh Data
        </button>
      </div>

      {/* Current Session */}
      {currentSession && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Current Session</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="font-medium">Participant:</span> {currentSession.participant_id}
              </div>
              <div>
              <span className="font-medium">TaskId:</span> {currentSession.rid}
              </div>
              <div>
                <span className="font-medium">Treatment:</span> {currentSession.treatment_group}
              </div>
              <div>
                <span className="font-medium">Topic:</span> {currentSession.task_topic} ({currentSession.task_type})
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
              <span className="font-medium">Duration:</span>{" "}
              {formatDuration(currentSession.task_start_time, currentSession.task_end_time)}
            </div>
            <div>
              <span className="font-medium">Clicks:</span> {currentSession.click_sequence.length}
              </div>
              <div>
                <span className="font-medium">Click Show More?</span>{" "}
                {currentSession.show_more_interactions? "Yes": "No"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Session Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 border rounded shadow">
            <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
            <div className="text-gray-600">Completed Tasks</div>
          </div>
          <div className="bg-white p-4 border rounded shadow">
            <div className="text-2xl font-bold text-green-600">
              {sessions.reduce((sum, s) => sum + s.click_sequence.length, 0)}
            </div>
            <div className="text-gray-600">Total Clicks</div>
          </div>
          <div className="bg-white p-4 border rounded shadow">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(sessions.map((s) => s.participant_id)).size}
            </div>
            <div className="text-gray-600">Unique Participants</div>
          </div>
        </div>
      </div>

      {/* Completed Sessions Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Completed Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">Participant</th>
                <th className="px-4 py-2 border text-left">RID</th>
                <th className="px-4 py-2 border text-left">Treatment</th>
                <th className="px-4 py-2 border text-left">Topic</th>
                <th className="px-4 py-2 border text-left">Type</th>
                <th className="px-4 py-2 border text-left">Duration</th>
                <th className="px-4 py-2 border text-left">Clicks</th>
                <th className="px-4 py-2 border text-left">Start Time</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{session.participant_id}</td>
                  <td className="px-4 py-2 border">{session.rid}</td>
                  <td className="px-4 py-2 border">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {session.treatment_group}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{session.task_topic}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        session.task_type === "product"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {session.task_type}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{formatDuration(session.task_start_time, session.task_end_time)}</td>
                  <td className="px-4 py-2 border">{session.click_sequence.length}</td>
                  <td className="px-4 py-2 border">{new Date(session.task_start_time).toLocaleString()}</td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-center text-gray-500">
                    No completed sessions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Click Sequence Details */}
      {sessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Click Sequences</h2>
          {sessions.slice(-3).map((session) => (
            <div key={session.rid} className="mb-6 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">
                Task {session.rid} - {session.participant_id} ({session.treatment_group})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-50 border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-3 py-2 border text-left">Order</th>
                      <th className="px-3 py-2 border text-left">Page Title</th>
                      <th className="px-3 py-2 border text-left">Page ID</th>
                      <th className="px-3 py-2 border text-left">Position</th>
                      <th className="px-3 py-2 border text-left">Dwell Time</th>
                      <th className="px-3 py-2 border text-left">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.click_sequence.map((click, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-3 py-2 border">{click.click_order}</td>
                        <td className="px-3 py-2 border">{click.page_title}</td>
                        <td className="px-3 py-2 border">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              click.is_ad ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {click.page_id}
                          </span>
                        </td>
                        <td className="px-3 py-2 border">{click.position_in_serp}</td>
                        <td className="px-3 py-2 border">
                          {click.dwell_time_sec ? `${click.dwell_time_sec}s` : "N/A"}
                        </td>
                        <td className="px-3 py-2 border">
                          <div className="flex gap-1">
                            {click.from_overview && (
                              <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">OV</span>
                            )}
                            {click.from_ai_mode && (
                              <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">AI</span>
                            )}
                            {!click.from_overview && !click.from_ai_mode && (
                              <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs">ORG</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
