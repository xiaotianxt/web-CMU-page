// Database service for saving analytics data to the backend API

import type { TaskSession, ClickEvent, ShowMoreInteraction, ShowAllInteraction } from "@/lib/analytics"

// const API_BASE_URL = "https://cmu-web-service-demo-7d7309b0820c.herokuapp.com/api/task-records"
const API_BASE_URL= "http://localhost:8080/api/task-records"

// Interface matching the backend TaskRecord model
export interface TaskRecord {
  id?: number
  sid: string
  participantId: string
  treatmentGroup: string
  taskTopic: string
  taskId: string
  taskType: "PRODUCT" | "INFO" // Enum values in uppercase
  taskStartTime: string
  taskEndTime?: string
  clickSequence: ClickEvent[]
  showMoreInteractions: ShowMoreInteraction
  showAllInteractions: ShowAllInteraction
}

// Convert our TaskSession to TaskRecord format
const convertSessionToRecord = (session: TaskSession): TaskRecord => {
  return {
    sid: session.sid,
    participantId: session.participant_id,
    treatmentGroup: session.treatment_group,
    taskTopic: session.task_topic,
    taskId: session.sid + "_" + session.participant_id + "_" + session.task_topic + "_" + session.treatment_group,
    taskType: session.task_type.toUpperCase() as "PRODUCT" | "INFO",
    taskStartTime: session.task_start_time,
    taskEndTime: session.task_end_time || undefined,
    clickSequence: session.click_sequence,
    showMoreInteractions: session.show_more_interactions,
    showAllInteractions: session.show_all_interactions
  }
}

// Check if a record exists with the same taskId
const findExistingRecord = async (record: TaskRecord): Promise<TaskRecord | null> => {
  try {
    console.log(`Checking for existing record with taskId: ${record.taskId}`)
    const response = await fetch(`${API_BASE_URL}/task/${record.taskId}`)

    if (response.ok) {
      const existingRecord = await response.json()
      console.log(`Found existing record:`, existingRecord)
      return existingRecord
    } else if (response.status === 404) {
      console.log(`No existing record found for taskId: ${record.taskId}`)
      return null
    } else {
      console.error(`Error checking for existing record: ${response.status} ${response.statusText}`)
      return null
    }
  } catch (error) {
    console.error("Error checking for existing record:", error)
    return null
  }
}

// Save or update task record in database
export const saveTaskRecord = async (session: TaskSession): Promise<boolean> => {
  try {
    const record = convertSessionToRecord(session)
    console.log(`Attempting to save/update record for taskId: ${record.taskId}`)

    const existingRecord = await findExistingRecord(record)

    if (existingRecord && existingRecord.id) {
      // Update existing record
      console.log(`Updating existing record with ID: ${existingRecord.id}`)
      const response = await fetch(`${API_BASE_URL}/${existingRecord.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...record,
          id: existingRecord.id, // Include the ID for update
        }),
      })

      if (response.ok) {
        const updatedRecord = await response.json()
        console.log(`Successfully updated task record ${existingRecord.id}:`, updatedRecord)
        return true
      } else {
        const errorText = await response.text()
        console.error(`Failed to update task record: ${response.status} ${response.statusText}`, errorText)
        return false
      }
    } else {
      // Create new record
      console.log(`Creating new record for taskId: ${record.taskId}`)
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      })

      if (response.ok) {
        const createdRecord = await response.json()
        console.log(`Successfully created new task record ${createdRecord.id}:`, createdRecord)
        return true
      } else {
        const errorText = await response.text()
        console.error(`Failed to create task record: ${response.status} ${response.statusText}`, errorText)
        return false
      }
    }
  } catch (error) {
    console.error("Error saving task record:", error)
    return false
  }
}

// Save task record with retry logic
export const saveTaskRecordWithRetry = async (session: TaskSession, maxRetries = 3): Promise<boolean> => {
  const success = await saveTaskRecord(session)
    if (success) {
      return true
    }
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Save attempt ${attempt}/${maxRetries} for session:`, session.sid)
    

    // if (attempt < maxRetries) {
    //   // Wait before retrying (exponential backoff)
    //   const delay = Math.pow(2, attempt) * 1000
    //   console.log(`Retrying save in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
    //   await new Promise((resolve) => setTimeout(resolve, delay))
    // }
  }

  console.error(`Failed to save task record after ${maxRetries} attempts`)
  return false
}

// Get all task records for a participant
export const getTaskRecordsByParticipant = async (participantId: string): Promise<TaskRecord[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/participant/${participantId}`)
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error("Error fetching task records:", error)
    return []
  }
}

// Get task record by taskId
export const getTaskRecordByTaskId = async (taskId: string): Promise<TaskRecord | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task/${taskId}`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error("Error fetching task record:", error)
    return null
  }
}

// Delete all task records (for testing/cleanup)
export const deleteAllTaskRecords = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting all task records:", error)
    return false
  }
}

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_BASE_URL)
    return response.ok
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}
