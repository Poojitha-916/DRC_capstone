import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes.js";
import { z } from "zod";
import { verifyPassword } from "./storage";
import {
  evaluateWorkflowDecision,
  getWorkflowDefinition,
  isRoleAuthorized,
  type WorkflowStage,
} from "./workflow";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // === AUTH ===
  app.post("/api/auth/login", async (req, res) => {
    try {
      const input = z
        .object({
          scholarId: z.string().optional(),
          employeeId: z.string().optional(),
          password: z.string(),
        })
        .refine((data) => data.scholarId || data.employeeId, {
          message: "Either scholarId or employeeId is required",
        })
        .parse(req.body);

      const scholarId = input.scholarId?.trim().toUpperCase();
      const employeeId = input.employeeId?.trim().toUpperCase();

      let user;
      if (scholarId) {
        user = await storage.getUserByScholarId(scholarId);
      } else if (employeeId) {
        user = await storage.getUserByEmployeeId(employeeId);
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid ID or password" });
      }

      let passwordValid = await verifyPassword(input.password, user.password);
      if (!passwordValid && user.password === input.password) {
        await storage.updateUser(user.id, { password: input.password });
        passwordValid = true;
      }

      if (!passwordValid) {
        return res
          .status(401)
          .json({ message: "Invalid ID or password" });
      }

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUserWithScholar(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // === USERS ===
  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUserWithScholar(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(
      users.map((u) => {
        const { password: _, ...rest } = u;
        return rest;
      }),
    );
  });

  app.put(api.users.update.path, async (req, res) => {
    try {
      const updates = api.users.update.input.parse(req.body);
      const updatedUser = await storage.updateUser(
        Number(req.params.id),
        updates,
      );
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === APPLICATIONS ===
  app.get(api.applications.list.path, async (req, res) => {
    const scholarId = req.query.scholarId
      ? String(req.query.scholarId)
      : undefined;
    const apps = await storage.getApplications(scholarId);
    res.json(apps);
  });

  app.get("/api/applications/stage/:stage", async (req, res) => {
    const stage = req.params.stage;

    if (stage === "supervisor") {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role === "supervisor") {
        // TODO: Get employee ID for this supervisor user
        // For now, we'll return empty array until employee mapping is set up
        return res.json([]);
      }
    }

    const apps = await storage.getApplicationsByStage(stage);
    res.json(apps);
  });

  app.get("/api/applications/:id", async (req, res) => {
    const app = await storage.getApplicationById(Number(req.params.id));
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(app);
  });

  app.post(api.applications.create.path, async (req, res) => {
    try {
      const input = api.applications.create.input.parse(req.body);
      const newApp = await storage.createApplication({
        ...input,
        currentStage: "supervisor",
        status: "Pending",
      });
      res.status(201).json(newApp);
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === APPLICATION REVIEWS ===
  app.get("/api/applications/:id/reviews", async (req, res) => {
    const reviews = await storage.getReviewsForApplication(
      Number(req.params.id),
    );
    res.json(reviews);
  });

  app.post("/api/applications/:id/review", async (req, res) => {
    try {
      const reviewInput = z
        .object({
          reviewerId: z.string(),
          decision: z.enum(["approved", "rejected"]),
          remarks: z.string().min(1, "Remarks are required"),
        })
        .parse(req.body);

      const applicationId = Number(req.params.id);
      const application = await storage.getApplicationById(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (application.status !== "Pending") {
        return res
          .status(400)
          .json({ message: "Application is no longer pending" });
      }

      const reviewer = await storage.getEmployee(reviewInput.reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: "Reviewer not found" });
      }

      const workflow = getWorkflowDefinition(application.type);
      const currentStage = application.currentStage as WorkflowStage;

      if (!workflow.stages.includes(currentStage)) {
        return res.status(400).json({ message: "Invalid workflow stage" });
      }

      // TODO: Implement proper reviewer role checking with updated schema
      // if (!isRoleAuthorized(workflow, currentStage, reviewer.role)) {
      //   return res
      //     .status(403)
      //     .json({ message: "Reviewer not authorized for this stage" });
      // }

      if (currentStage === "supervisor") {
        const isAssigned = await storage.isSupervisorForScholar(
          reviewInput.reviewerId,
          application.scholarId,
        );

        if (!isAssigned) {
          return res.status(403).json({
            message: "Supervisor not assigned to this scholar",
          });
        }
      }

      const review = await storage.createReview({
        applicationId,
        reviewerId: reviewInput.reviewerId,
        stage: application.currentStage,
        decision: reviewInput.decision,
        remarks: reviewInput.remarks,
      });

      const workflowResult = evaluateWorkflowDecision(workflow, {
        currentStage,
        decision: reviewInput.decision,
      });

      if (workflowResult.isTerminal && workflowResult.finalOutcome === "Approved") {
        await applyApprovedChanges(application);
      }

      const updatedApp = await storage.updateApplication(applicationId, {
        currentStage: workflowResult.nextStage,
        status: workflowResult.status,
        finalOutcome: workflowResult.finalOutcome,
      });

      res.json({ review, application: updatedApp });
    } catch (error) {
      console.error("Review error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === STATS ===
  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getResearchProgress(
      String(req.params.scholarId),
    );
    if (!stats) {
      return res.json({
        completedReviews: 0,
        pendingReports: 0,
        publications: 0,
      });
    }
    res.json(stats);
  });

  // === SEED DATA ===
  await seedData();

  return httpServer;
}

async function applyApprovedChanges(application: {
  scholarId: string;
  type: string;
  details: unknown;
}) {
  const details = application.details as Record<string, unknown>;

  if (application.type === "Supervisor Change" && details?.proposedSupervisor) {
    // Supervisor assignments are now in scholarSupervisors table
    // This would need to be updated through a different endpoint
    console.log(`Supervisor change approved: ${details.proposedSupervisor}`);
  }

  if (application.type === "Extension" && details?.extensionDuration) {
    // Could update phase or other fields based on extension approval
    console.log(
      `Extension approved for scholar ${application.scholarId}: ${details.extensionDuration}`,
    );
  }
}

async function seedData() {
  try {
    // Try to check if data already exists - will fail if columns don't exist yet
    const existingScholar = await storage.getUserByScholarId("GITAM-SCH-2020-118").catch(() => null);
    if (existingScholar) return;
  } catch (_err) {
    // If check fails due to schema mismatch, continue with seeding
    console.log("Note: Schema migration may be pending. Continuing with application startup...");
  }

  try {
    console.log("Seeding database with dummy accounts...");

    // Create Scholar 1 User
    const scholar1User = await storage.createUser({
      password: "password123",
      role: "scholar",
      name: "Thirupathi Kumar",
      email: "thirupathi@gitam.in",
      phone: "9876543210",
    });

    const scholar1Profile = await storage.createScholarProfile({
      userId: scholar1User.id,
      scholarId: "GITAM-SCH-2020-118",
      batch: "June 2022",
      status: "Active",
      department: "Computer Science",
      researchArea: "Applied Machine Learning",
      researchTitle: "Context-Aware Diagnosis for Healthcare Records",
      joiningDate: "2020-08-15",
      phase: "Phase I",
      programme: "Full Time",
      location: "Visakhapatnam",
      fatherName: "Ramakrishna Kumar",
      parentMobile: "9876500011",
      aadhaar: "1234-5678-9012",
      nationality: "Indian",
      address: "D.No. 9-14, MVP Colony, Visakhapatnam",
      tenthBoard: "CBSE",
      tenthPercentage: "92%",
      interBoard: "State Board",
      interPercentage: "89%",
    });
    
    // Create Scholar 2 User
    const scholar2User = await storage.createUser({
      password: "password123",
      role: "scholar",
      name: "Priya Reddy",
      email: "priya.reddy@gitam.in",
      phone: "9876543220",
    });

    const scholar2Profile = await storage.createScholarProfile({
      userId: scholar2User.id,
      scholarId: "GITAM-SCH-2021-204",
      batch: "June 2023",
      status: "Active",
      department: "Biotechnology",
      researchArea: "Molecular Biology",
      researchTitle: "RNA Signatures in Pediatric Care",
      joiningDate: "2021-07-21",
      phase: "Phase II",
      programme: "Full Time",
      location: "Hyderabad",
      fatherName: "Prabhakar Reddy",
      parentMobile: "9876500022",
      aadhaar: "2345-6789-0123",
      nationality: "Indian",
      address: "Plot 12, Jubilee Hills, Hyderabad",
      tenthBoard: "ICSE",
      tenthPercentage: "91%",
      interBoard: "State Board",
      interPercentage: "88%",
    });

    // Create Supervisor User
    const supervisorUser = await storage.createUser({
      password: "password123",
      role: "supervisor",
      name: "Dr. Ramesh Kumar",
      email: "ramesh.kumar@gitam.edu",
      phone: "9876543230",
    });

    // Create Employee record for Supervisor
    const supervisorEmployee = await storage.createEmployee({
      employeeId: "EMP-SUPERVISOR-001",
      userId: supervisorUser.id,
      designation: "Associate Professor",
      department: "Computer Science",
    });

    // Update scholars with supervisor assignments
    // Note: This would require an updateScholar method - for now, this is documented

    // Create DRC member User
    const drcUser = await storage.createUser({
      password: "password123",
      role: "drc",
      name: "Dr. Lakshmi Narayana",
      email: "lakshmi.drc@gitam.edu",
      phone: "9876543240",
    });

    const drcEmployee = await storage.createEmployee({
      employeeId: "EMP-DRC-001",
      userId: drcUser.id,
      designation: "Professor",
      department: "Computer Science",
    });

    // Create IRC member User
    const ircUser = await storage.createUser({
      password: "password123",
      role: "irc",
      name: "Dr. Venkatesh Rao",
      email: "venkatesh.irc@gitam.edu",
      phone: "9876543250",
    });

    const ircEmployee = await storage.createEmployee({
      employeeId: "EMP-IRC-001",
      userId: ircUser.id,
      designation: "Associate Professor",
      department: "Biotechnology",
    });

    // Create DoAA officer User
    const doaaUser = await storage.createUser({
      password: "password123",
      role: "doaa",
      name: "Prof. Srinivas Reddy",
      email: "srinivas.doaa@gitam.edu",
      phone: "9876543260",
    });

    const doaaEmployee = await storage.createEmployee({
      employeeId: "EMP-DOAA-001",
      userId: doaaUser.id,
      designation: "Professor",
      department: "Administration",
    });

    // Add sample application for scholar1
    await storage.createApplication({
      scholarId: scholar1Profile.scholarId,
      type: "Extension",
      status: "Pending",
      currentStage: "supervisor",
      details: {
        candidateName: "Thirupathi Kumar",
        registrationDate: "15-08-2020",
        durationEligible: "5 years",
        extensionDuration: "6 months",
        reason: "Additional time needed for experimental validation",
        timeline:
          "Complete experiments by June 2026, thesis submission by December 2026",
      },
    });

    // Add research progress for scholars
    await storage.createResearchProgress({
      scholarId: scholar1Profile.scholarId,
      completedReviews: 4,
      pendingReports: 1,
      publications: 3,
    });

    await storage.createResearchProgress({
      scholarId: scholar2Profile.scholarId,
      completedReviews: 2,
      pendingReports: 0,
      publications: 1,
    });

    console.log("Seeding complete! Created accounts:");
    console.log("  - GITAM-SCH-2020-118 / password123 (Scholar)");
    console.log("  - GITAM-SCH-2021-204 / password123 (Scholar)");
    console.log("  - EMP-SUPERVISOR-001 / password123 (Supervisor)");
    console.log("  - EMP-DRC-001 / password123 (DRC Member)");
    console.log("  - EMP-IRC-001 / password123 (IRC Member)");
    console.log("  - EMP-DOAA-001 / password123 (DoAA Officer)");
  } catch (seedErr: any) {
    console.error("Error during seed:", seedErr.message);
    console.log("This may be due to pending schema migrations. Run 'npm run db:push' to apply schema changes.");
  }
}
