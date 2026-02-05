import { db } from "./db";
import { 
  users, 
  scholars,
  scholarSupervisors,
  racMembers,
  applications, 
  researchProgress, 
  applicationReviews,
  type User, 
  type InsertUser, 
  type Application, 
  type InsertApplication,
  type ApplicationReview,
  type InsertApplicationReview
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  
  // Applications
  getApplications(scholarId?: number): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  getApplicationsByStage(stage: string): Promise<Application[]>;
  getApplicationsForSupervisor(supervisorId: number): Promise<Application[]>;
  createApplication(app: InsertApplication): Promise<Application>;
  updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application>;
  
  // Application Reviews
  getReviewsForApplication(applicationId: number): Promise<ApplicationReview[]>;
  createReview(review: InsertApplicationReview): Promise<ApplicationReview>;
  isSupervisorForScholar(supervisorId: number, scholarId: number): Promise<boolean>;
  createScholarSupervisor(scholarId: number, supervisorId: number): Promise<void>;
  
  // Stats
  getResearchProgress(scholarId: number): Promise<typeof researchProgress.$inferSelect | undefined>;
  createResearchProgress(stats: typeof researchProgress.$inferInsert): Promise<typeof researchProgress.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(user.password || "password123", 10);
    const [newUser] = await db.insert(users).values({
      ...user,
      password: hashedPassword
    }).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    // Hash password if being updated
    const updateData = { ...updates };
    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 10);
    }
    const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getApplications(scholarId?: number): Promise<Application[]> {
    if (scholarId) {
      return db.select().from(applications).where(eq(applications.scholarId, scholarId)).orderBy(desc(applications.submissionDate));
    }
    return db.select().from(applications).orderBy(desc(applications.submissionDate));
  }

  async getApplicationById(id: number): Promise<Application | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.id, id));
    return app;
  }

  async getApplicationsByStage(stage: string): Promise<Application[]> {
    return db.select().from(applications)
      .where(and(eq(applications.currentStage, stage), eq(applications.status, "Pending")))
      .orderBy(desc(applications.submissionDate));
  }

  async getApplicationsForSupervisor(supervisorId: number): Promise<Application[]> {
    const results = await db
      .select()
      .from(applications)
      .innerJoin(
        scholarSupervisors,
        eq(scholarSupervisors.scholarId, applications.scholarId),
      )
      .where(
        and(
          eq(applications.currentStage, "supervisor"),
          eq(applications.status, "Pending"),
          eq(scholarSupervisors.supervisorId, supervisorId),
        ),
      )
      .orderBy(desc(applications.submissionDate));

    return results.map((result) => result.applications);
  }

  async createApplication(app: InsertApplication): Promise<Application> {
    const [newApp] = await db.insert(applications).values(app).returning();
    return newApp;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application> {
    const [updated] = await db.update(applications).set(updates).where(eq(applications.id, id)).returning();
    return updated;
  }

  async getReviewsForApplication(applicationId: number): Promise<ApplicationReview[]> {
    return db.select().from(applicationReviews)
      .where(eq(applicationReviews.applicationId, applicationId))
      .orderBy(applicationReviews.reviewDate);
  }

  async createReview(review: InsertApplicationReview): Promise<ApplicationReview> {
    const [newReview] = await db.insert(applicationReviews).values(review).returning();
    return newReview;
  }

  async isSupervisorForScholar(supervisorId: number, scholarId: number): Promise<boolean> {
    const [assignment] = await db
      .select()
      .from(scholarSupervisors)
      .where(
        and(
          eq(scholarSupervisors.supervisorId, supervisorId),
          eq(scholarSupervisors.scholarId, scholarId),
        ),
      );

    return Boolean(assignment);
  }

  async createScholarSupervisor(scholarId: number, supervisorId: number): Promise<void> {
    await db.insert(scholarSupervisors).values({
      scholarId,
      supervisorId,
      isPrimary: true,
    });
  }

  async getResearchProgress(scholarId: number): Promise<typeof researchProgress.$inferSelect | undefined> {
    const [stats] = await db.select().from(researchProgress).where(eq(researchProgress.scholarId, scholarId));
    return stats;
  }

  async createResearchProgress(stats: typeof researchProgress.$inferInsert): Promise<typeof researchProgress.$inferSelect> {
    const [newStats] = await db.insert(researchProgress).values(stats).returning();
    return newStats;
  }
}

export const storage = new DatabaseStorage();

// Helper function to verify password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
