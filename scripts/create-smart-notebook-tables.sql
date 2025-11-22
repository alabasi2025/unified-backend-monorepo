-- Smart Notebook Tables

-- DocumentationPage table
CREATE TABLE IF NOT EXISTS "DocumentationPage" (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    type VARCHAR(50),
    category VARCHAR(50),
    version VARCHAR(50),
    "isPublished" BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'DRAFT',
    "createdBy" VARCHAR(255),
    "updatedBy" VARCHAR(255),
    tags TEXT[],
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Idea table
CREATE TABLE IF NOT EXISTS "Idea" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'NEW',
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    category VARCHAR(100),
    tags TEXT[],
    "createdBy" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ChatLog table
CREATE TABLE IF NOT EXISTS "ChatLog" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(100),
    tags TEXT[],
    "isFavorite" BOOLEAN DEFAULT false,
    "createdBy" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report table
CREATE TABLE IF NOT EXISTS "Report" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'DRAFT',
    "isPublished" BOOLEAN DEFAULT false,
    category VARCHAR(100),
    tags TEXT[],
    "createdBy" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task table
CREATE TABLE IF NOT EXISTS "Task" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP,
    category VARCHAR(100),
    tags TEXT[],
    "assignedTo" VARCHAR(255),
    "createdBy" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_documentation_slug ON "DocumentationPage"(slug);
CREATE INDEX IF NOT EXISTS idx_documentation_category ON "DocumentationPage"(category);
CREATE INDEX IF NOT EXISTS idx_idea_status ON "Idea"(status);
CREATE INDEX IF NOT EXISTS idx_chatlog_favorite ON "ChatLog"("isFavorite");
CREATE INDEX IF NOT EXISTS idx_report_status ON "Report"(status);
CREATE INDEX IF NOT EXISTS idx_task_status ON "Task"(status);
