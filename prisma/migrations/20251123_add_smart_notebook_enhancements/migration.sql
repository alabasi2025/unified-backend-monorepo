-- Smart Notebook Enhancements Migration
-- Date: 2025-11-23
-- Description: Add new models for Smart Notebook system (safe migration)

-- Create TimelineEventType enum
DO $$ BEGIN
    CREATE TYPE "TimelineEventType" AS ENUM (
      'CONVERSATION_CREATED',
      'IDEA_EXTRACTED',
      'IDEA_APPROVED',
      'IDEA_REJECTED',
      'IDEA_CONVERTED',
      'TASK_CREATED',
      'TASK_STARTED',
      'TASK_COMPLETED',
      'TASK_BLOCKED',
      'PAGE_CREATED',
      'PAGE_UPDATED',
      'NOTE_ADDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Conversation table
CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sourceType" TEXT,
    "sourceId" TEXT,
    "extractedIdeasCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- Create AchievementReport table
CREATE TABLE IF NOT EXISTS "AchievementReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reportType" TEXT NOT NULL DEFAULT 'DAILY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "ideasImplemented" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchievementReport_pkey" PRIMARY KEY ("id")
);

-- Create TaskProgressReport table
CREATE TABLE IF NOT EXISTS "TaskProgressReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "systemName" TEXT NOT NULL,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "inProgressTasks" INTEGER NOT NULL DEFAULT 0,
    "pendingTasks" INTEGER NOT NULL DEFAULT 0,
    "progressPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedCompletion" TIMESTAMP(3),
    "summary" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskProgressReport_pkey" PRIMARY KEY ("id")
);

-- Create NotebookPage table
CREATE TABLE IF NOT EXISTS "NotebookPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "section" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "tags" TEXT[],
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotebookPage_pkey" PRIMARY KEY ("id")
);

-- Create StickyNote table
CREATE TABLE IF NOT EXISTS "StickyNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'YELLOW',
    "position" JSONB,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StickyNote_pkey" PRIMARY KEY ("id")
);

-- Create TimelineEvent table
CREATE TABLE IF NOT EXISTS "TimelineEvent" (
    "id" TEXT NOT NULL,
    "eventType" "TimelineEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "conversationId" TEXT,
    "ideaId" TEXT,
    "taskId" TEXT,
    "pageId" TEXT,
    "createdBy" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- Add new fields to Idea table (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Idea') THEN
        ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "conversationId" TEXT;
        ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "rating" INTEGER;
        ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "estimatedValue" INTEGER;
        ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "estimatedEffort" INTEGER;
        ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "convertedToTaskId" TEXT;
        ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "convertedAt" TIMESTAMP(3);
    END IF;
END $$;

-- Add new fields to Task table (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Task') THEN
        ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "conversationId" TEXT;
        ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "sourceType" TEXT;
        ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "sourceId" TEXT;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Conversation_status_idx" ON "Conversation"("status");
CREATE INDEX IF NOT EXISTS "Conversation_category_idx" ON "Conversation"("category");
CREATE INDEX IF NOT EXISTS "Conversation_createdAt_idx" ON "Conversation"("createdAt");

CREATE INDEX IF NOT EXISTS "TimelineEvent_eventType_idx" ON "TimelineEvent"("eventType");
CREATE INDEX IF NOT EXISTS "TimelineEvent_conversationId_idx" ON "TimelineEvent"("conversationId");
CREATE INDEX IF NOT EXISTS "TimelineEvent_ideaId_idx" ON "TimelineEvent"("ideaId");
CREATE INDEX IF NOT EXISTS "TimelineEvent_taskId_idx" ON "TimelineEvent"("taskId");
CREATE INDEX IF NOT EXISTS "TimelineEvent_eventDate_idx" ON "TimelineEvent"("eventDate");

-- Add foreign keys (only if tables exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Idea') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Idea_conversationId_fkey') THEN
            ALTER TABLE "Idea" ADD CONSTRAINT "Idea_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
        CREATE INDEX IF NOT EXISTS "Idea_conversationId_idx" ON "Idea"("conversationId");
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Task') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Task_conversationId_fkey') THEN
            ALTER TABLE "Task" ADD CONSTRAINT "Task_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
        CREATE INDEX IF NOT EXISTS "Task_conversationId_idx" ON "Task"("conversationId");
    END IF;
END $$;

-- Add TimelineEvent foreign keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'TimelineEvent_conversationId_fkey') THEN
        ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Idea') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'TimelineEvent_ideaId_fkey') THEN
            ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Task') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'TimelineEvent_taskId_fkey') THEN
            ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'TimelineEvent_pageId_fkey') THEN
        ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "NotebookPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
