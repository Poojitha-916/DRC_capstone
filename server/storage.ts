import { db } from "./db";
import { 
  users, 
  scholars,
  employees,
  racMembers,
  applications, 
  researchProgress, 
  applicationReviews,
  type Scholar,
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
  getUserWithScholar(id: number): Promise<(User & Partial<Scholar>) | undefined>;
  getUserByScholarId(scholarId: string): Promise<(User & Partial<Scholar>) | undefined>;
  getUserByEmployeeId(employeeId: string): Promise<(User & Partial<typeof employees.$inferSelect>) | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  
  // Employees
  getEmployee(employeeId: string): Promise<typeof employees.$inferSelect | undefined>;
  createEmployee(emp: typeof employees.$inferInsert): Promise<typeof employees.$inferSelect>;
  
  // Applications
  getApplications(scholarId?: string): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  getApplicationsByStage(stage: string): Promise<Application[]>;
  getApplicationsForSupervisor(employeeId: string): Promise<Application[]>;
  createApplication(app: InsertApplication): Promise<Application>;
  updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application>;
  
  // Application Reviews
  getReviewsForApplication(applicationId: number): Promise<ApplicationReview[]>;
  createReview(review: InsertApplicationReview): Promise<ApplicationReview>;
  isSupervisorForScholar(employeeId: string, scholarId: string): Promise<boolean>;
  createScholarProfile(
    profile: typeof scholars.$inferInsert,
  ): Promise<typeof scholars.$inferSelect>;
  
  // Stats
  getResearchProgress(scholarId: string): Promise<typeof researchProgress.$inferSelect | undefined>;
  createResearchProgress(stats: typeof researchProgress.$inferInsert): Promise<typeof researchProgress.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserWithScholar(
    id: number,
  ): Promise<(User & Partial<Scholar>) | undefined> {
    const [record] = await db
      .select()
      .from(users)
      .leftJoin(scholars, eq(scholars.userId, users.id))
      .where(eq(users.id, id));

    if (!record) {
      return undefined;
    }

    const { id: _scholarRecordId, ...scholarData } = record.scholars ?? {};
    return { ...scholarData, ...record.users };
  }

  async getUserByScholarId(
    scholarId: string,
  ): Promise<(User & Partial<Scholar>) | undefined> {
    const [record] = await db
      .select()
      .from(users)
      .leftJoin(scholars, eq(scholars.userId, users.id))
      .where(eq(scholars.scholarId, scholarId));

    if (!record) {
      return undefined;
    }

    return { ...record.scholars, ...record.users };
  }

  async getUserByEmployeeId(
    employeeId: string,
  ): Promise<(User & Partial<typeof employees.$inferSelect>) | undefined> {
    const [record] = await db
      .select()
      .from(users)
      .leftJoin(employees, eq(employees.userId, users.id))
      .where(eq(employees.employeeId, employeeId));

    if (!record) {
      return undefined;
    }

    return { ...record.employees, ...record.users };
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

  async getEmployee(employeeId: string): Promise<typeof employees.$inferSelect | undefined> {
    const [emp] = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return emp;
  }

  async createEmployee(emp: typeof employees.$inferInsert): Promise<typeof employees.$inferSelect> {
    const [newEmp] = await db.insert(employees).values(emp).returning();
    return newEmp;
  }

  async getApplications(scholarId?: string): Promise<Application[]> {
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

  async getApplicationsForSupervisor(employeeId: string): Promise<Application[]> {
    const results = await db
      .select()
      .from(applications)
      .innerJoin(
        scholars,
        and(
          eq(scholars.scholarId, applications.scholarId)
        ),
      )
      .where(
        and(
          eq(applications.currentStage, "supervisor"),
          eq(applications.status, "Pending"),
          // Supervisor is either primary or co-supervisor
        ),
      )
      .orderBy(desc(applications.submissionDate));

    // Filter for this specific supervisor
    return results
      .filter(result => 
        result.scholars.supervisorId === employeeId || 
        result.scholars.coSupervisorId === employeeId
      )
      .map((result) => result.applications);
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

  async isSupervisorForScholar(employeeId: string, scholarId: string): Promise<boolean> {
    const [scholar] = await db
      .select()
      .from(scholars)
      .where(eq(scholars.scholarId, scholarId));

    if (!scholar) return false;
    return scholar.supervisorId === employeeId || scholar.coSupervisorId === employeeId;
  }

  async createScholarProfile(
    profile: typeof scholars.$inferInsert,
  ): Promise<typeof scholars.$inferSelect> {
    const [newProfile] = await db.insert(scholars).values(profile).returning();
    return newProfile;
  }

  async getResearchProgress(scholarId: string): Promise<typeof researchProgress.$inferSelect | undefined> {
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
