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
      const { username, password } = z
        .object({
          username: z.string(),
          password: z.string(),
        })
        .parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const passwordValid = await verifyPassword(password, user.password);
      if (!passwordValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
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
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // === USERS ===
  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
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
      ? Number(req.query.scholarId)
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
        const apps = await storage.getApplicationsForSupervisor(user.id);
        return res.json(apps);
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
          reviewerId: z.number(),
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

      const reviewer = await storage.getUser(reviewInput.reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: "Reviewer not found" });
      }

      const workflow = getWorkflowDefinition(application.type);
      const currentStage = application.currentStage as WorkflowStage;

      if (!workflow.stages.includes(currentStage)) {
        return res.status(400).json({ message: "Invalid workflow stage" });
      }

      if (!isRoleAuthorized(workflow, currentStage, reviewer.role)) {
        return res
          .status(403)
          .json({ message: "Reviewer not authorized for this stage" });
      }

      if (currentStage === "supervisor" && reviewer.role === "supervisor") {
        const isAssigned = await storage.isSupervisorForScholar(
          reviewer.id,
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
      Number(req.params.scholarId),
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
  scholarId: number;
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
  const existingUser = await storage.getUserByUsername("scholar1");
  if (!existingUser) {
    console.log("Seeding database with dummy accounts...");

    // Create Scholar 1
    const scholar1 = await storage.createUser({
      username: "scholar1",
      password: "password123",
      role: "scholar",
      name: "Thirupathi Kumar",
      email: "thirupathi@gitam.in",
      phone: "9876543210",
    });

    // Create Scholar 1 profile
    // NOTE: Scholar data is now stored separately in scholars table
    // This would be created via a createScholar method in storage
    
    // Create Scholar 2
    const scholar2User = await storage.createUser({
      username: "scholar2",
      password: "password123",
      role: "scholar",
      name: "Priya Reddy",
      email: "priya.reddy@gitam.in",
      phone: "9876543220",
    });


    // Create Supervisor
    const supervisor = await storage.createUser({
      username: "supervisor1",
      password: "password123",
      role: "supervisor",
      name: "Dr. Ramesh Kumar",
      email: "ramesh.kumar@gitam.edu",
      phone: "9876543230",
    });

    // Create DRC member
    await storage.createUser({
      username: "drc1",
      password: "password123",
      role: "drc",
      name: "Dr. Lakshmi Narayana",
      email: "lakshmi.drc@gitam.edu",
      phone: "9876543240",
    });

    // Create IRC member
    await storage.createUser({
      username: "irc1",
      password: "password123",
      role: "irc",
      name: "Dr. Venkatesh Rao",
      email: "venkatesh.irc@gitam.edu",
      phone: "9876543250",
    });

    // Create DoAA officer
    await storage.createUser({
      username: "doaa1",
      password: "password123",
      role: "doaa",
      name: "Prof. Srinivas Reddy",
      email: "srinivas.doaa@gitam.edu",
      phone: "9876543260",
    });

    await storage.createScholarSupervisor(scholar1.id, supervisor.id);
    await storage.createScholarSupervisor(scholar2User.id, supervisor.id);

    // Add sample application for scholar1
    await storage.createApplication({
      scholarId: scholar1.id, // Uses scholar user ID as reference
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
      scholarId: scholar1.id,
      completedReviews: 4,
      pendingReports: 1,
      publications: 3,
    });

    await storage.createResearchProgress({
      scholarId: scholar2User.id,
      completedReviews: 2,
      pendingReports: 0,
      publications: 1,
    });

    console.log("Seeding complete! Created accounts:");
    console.log("  - scholar1 / password123 (Scholar)");
    console.log("  - scholar2 / password123 (Scholar)");
    console.log("  - supervisor1 / password123 (Supervisor)");
    console.log("  - drc1 / password123 (DRC Member)");
    console.log("  - irc1 / password123 (IRC Member)");
    console.log("  - doaa1 / password123 (DoAA Officer)");
  }
}
