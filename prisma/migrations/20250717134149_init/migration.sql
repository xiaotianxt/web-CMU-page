-- CreateTable
CREATE TABLE "TaskLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participant_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "treatment_group" TEXT NOT NULL,
    "task_topic" TEXT NOT NULL,
    "task_type" TEXT NOT NULL,
    "task_start_time" DATETIME NOT NULL,
    "task_end_time" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_log_id" INTEGER NOT NULL,
    "click_order" INTEGER NOT NULL,
    "page_title" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "is_ad" BOOLEAN NOT NULL,
    "position_in_serp" INTEGER NOT NULL,
    "click_time" DATETIME NOT NULL,
    "dwell_time_sec" REAL NOT NULL,
    "from_overview" BOOLEAN NOT NULL,
    "from_ai_mode" BOOLEAN NOT NULL,
    CONSTRAINT "ClickEvent_task_log_id_fkey" FOREIGN KEY ("task_log_id") REFERENCES "TaskLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
