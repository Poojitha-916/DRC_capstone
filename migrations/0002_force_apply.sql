-- Force-apply normalized users/scholars schema (idempotent)
-- Drops conflicting tables and recreates the normalized schema.

SET client_min_messages = WARNING;

-- Drop tables that will be recreated
DROP TABLE IF EXISTS "rac_members" CASCADE;
DROP TABLE IF EXISTS "scholar_supervisors" CASCADE;
DROP TABLE IF EXISTS "scholars" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "applications" CASCADE;
DROP TABLE IF EXISTS "application_reviews" CASCADE;
DROP TABLE IF EXISTS "research_progress" CASCADE;
DROP TABLE IF EXISTS "notices" CASCADE;

-- Create new normalized users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "avatar_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" ("username");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");

-- Create scholars table
CREATE TABLE IF NOT EXISTS "scholars" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "scholar_id" TEXT UNIQUE,
  "batch" TEXT,
  "status" TEXT DEFAULT 'Active',
  "department" TEXT,
  "research_area" TEXT,
  "research_title" TEXT,
  "joining_date" TEXT,
  "phase" TEXT,
  "programme" TEXT,
  "location" TEXT,
  "father_name" TEXT,
  "parent_mobile" TEXT,
  "aadhaar" TEXT,
  "nationality" TEXT,
  "address" TEXT,
  "tenth_board" TEXT,
  "tenth_percentage" TEXT,
  "inter_board" TEXT,
  "inter_percentage" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_scholars_user_id" ON "scholars" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_scholars_scholar_id" ON "scholars" ("scholar_id");

-- Create supervisor assignments table
CREATE TABLE IF NOT EXISTS "scholar_supervisors" (
  "id" SERIAL PRIMARY KEY,
  "scholar_id" INTEGER NOT NULL REFERENCES "scholars"("id") ON DELETE CASCADE,
  "supervisor_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "is_primary" BOOLEAN DEFAULT TRUE,
  "assigned_on" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_scholar_supervisors_scholar_id" ON "scholar_supervisors" ("scholar_id");
CREATE INDEX IF NOT EXISTS "idx_scholar_supervisors_supervisor_id" ON "scholar_supervisors" ("supervisor_id");

-- Create RAC members table
CREATE TABLE IF NOT EXISTS "rac_members" (
  "id" SERIAL PRIMARY KEY,
  "scholar_id" INTEGER NOT NULL REFERENCES "scholars"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "member_role" TEXT NOT NULL,
  "assigned_on" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_rac_members_scholar_id" ON "rac_members" ("scholar_id");
CREATE INDEX IF NOT EXISTS "idx_rac_members_user_id" ON "rac_members" ("user_id");

-- Create applications table
CREATE TABLE IF NOT EXISTS "applications" (
  "id" SERIAL PRIMARY KEY,
  "scholar_id" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Pending',
  "current_stage" TEXT NOT NULL DEFAULT 'drc',
  "submission_date" TIMESTAMP DEFAULT NOW(),
  "details" JSONB,
  "final_outcome" TEXT
);

CREATE INDEX IF NOT EXISTS "idx_applications_scholar_id" ON "applications" ("scholar_id");

-- Create application_reviews table
CREATE TABLE IF NOT EXISTS "application_reviews" (
  "id" SERIAL PRIMARY KEY,
  "application_id" INTEGER NOT NULL,
  "reviewer_id" INTEGER NOT NULL,
  "stage" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "remarks" TEXT NOT NULL,
  "review_date" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_application_reviews_application_id" ON "application_reviews" ("application_id");

-- Create research_progress table
CREATE TABLE IF NOT EXISTS "research_progress" (
  "id" SERIAL PRIMARY KEY,
  "scholar_id" INTEGER NOT NULL,
  "completed_reviews" INTEGER DEFAULT 0,
  "pending_reports" INTEGER DEFAULT 0,
  "publications" INTEGER DEFAULT 0,
  "last_review_date" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_research_progress_scholar_id" ON "research_progress" ("scholar_id");

-- Create notices table
CREATE TABLE IF NOT EXISTS "notices" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "date" TIMESTAMP DEFAULT NOW(),
  "target_role" TEXT
);

-- Done
