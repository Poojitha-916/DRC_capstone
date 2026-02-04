import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === USERS / PROFILES ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull().default("password123"),
  role: text("role").notNull().default("scholar"), // 'scholar', 'supervisor', 'drc', 'irc', 'doaa', 'admin'
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  
  // Specific fields for Scholars
  scholarId: text("scholar_id"),
  location: text("location"),
  batch: text("batch"),
  status: text("status").default("Active"),
  department: text("department"),
  supervisor: text("supervisor"),
  coSupervisor: text("co_supervisor"),
  researchArea: text("research_area"),
  researchTitle: text("research_title"),
  joiningDate: text("joining_date"),
  phase: text("phase"),
  programme: text("programme"),
  
  // Personal Details
  fatherName: text("father_name"),
  parentMobile: text("parent_mobile"),
  aadhaar: text("aadhaar"),
  nationality: text("nationality"),
  address: text("address"),
  
  // Education
  tenthBoard: text("tenth_board"),
  tenthPercentage: text("tenth_percentage"),
  interBoard: text("inter_board"),
  interPercentage: text("inter_percentage"),

  // Metadata
  avatarUrl: text("avatar_url"),
});

// === APPLICATIONS ===
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  scholarId: integer("scholar_id").notNull(),
  type: text("type").notNull(), // 'Extension', 'Re-Registration', 'Supervisor Change', 'Pre-Talk', 'Thesis Submission', etc.
  status: text("status").notNull().default("Pending"), // 'Pending', 'Approved', 'Rejected'
  currentStage: text("current_stage").notNull().default("drc"), // 'drc', 'irc', 'doaa', 'completed'
  submissionDate: timestamp("submission_date").defaultNow(),
  details: jsonb("details"), // Store extra form fields here
  finalOutcome: text("final_outcome"), // 'Approved', 'Rejected', null if still in progress
});

// === APPLICATION REVIEWS ===
// Each approval step creates a review record
export const applicationReviews = pgTable("application_reviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  stage: text("stage").notNull(), // 'drc', 'irc', 'doaa'
  decision: text("decision").notNull(), // 'approved', 'rejected'
  remarks: text("remarks").notNull(),
  reviewDate: timestamp("review_date").defaultNow(),
});

// === RESEARCH PROGRESS ===
export const researchProgress = pgTable("research_progress", {
  id: serial("id").primaryKey(),
  scholarId: integer("scholar_id").notNull(),
  completedReviews: integer("completed_reviews").default(0),
  pendingReports: integer("pending_reports").default(0),
  publications: integer("publications").default(0),
  lastReviewDate: timestamp("last_review_date"),
});

// === NOTICES ===
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow(),
  targetRole: text("target_role"),
});

// === SCHEMAS ===
export const insertUserSchema = createInsertSchema(users);
export const insertApplicationSchema = createInsertSchema(applications);
export const insertApplicationReviewSchema = createInsertSchema(applicationReviews);
export const insertNoticeSchema = createInsertSchema(notices);

// === TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ApplicationReview = typeof applicationReviews.$inferSelect;
export type InsertApplicationReview = z.infer<typeof insertApplicationReviewSchema>;
export type Notice = typeof notices.$inferSelect;
