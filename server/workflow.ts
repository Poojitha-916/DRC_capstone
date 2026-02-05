export type WorkflowStage = "drc" | "irc" | "doaa" | "completed";
export type WorkflowDecision = "approved" | "rejected";

export interface WorkflowDefinition {
  id: string;
  stages: WorkflowStage[];
  stageRoles: Record<WorkflowStage, string[]>;
  terminalStage: WorkflowStage;
}

export interface WorkflowEvaluationInput {
  currentStage: WorkflowStage;
  decision: WorkflowDecision;
}

export interface WorkflowEvaluationResult {
  nextStage: WorkflowStage;
  status: "Pending" | "Approved" | "Rejected";
  finalOutcome: "Approved" | "Rejected" | null;
  isTerminal: boolean;
}

const baseWorkflow: WorkflowDefinition = {
  id: "phd-approval",
  stages: ["drc", "irc", "doaa", "completed"],
  stageRoles: {
    drc: ["drc"],
    irc: ["irc"],
    doaa: ["doaa"],
    completed: [],
  },
  terminalStage: "completed",
};

export function getWorkflowDefinition(_applicationType: string): WorkflowDefinition {
  return baseWorkflow;
}

export function isRoleAuthorized(
  workflow: WorkflowDefinition,
  stage: WorkflowStage,
  role: string,
): boolean {
  if (role === "admin") {
    return true;
  }

  return workflow.stageRoles[stage]?.includes(role) ?? false;
}

export function evaluateWorkflowDecision(
  workflow: WorkflowDefinition,
  input: WorkflowEvaluationInput,
): WorkflowEvaluationResult {
  const { currentStage, decision } = input;

  if (decision === "rejected") {
    return {
      nextStage: workflow.terminalStage,
      status: "Rejected",
      finalOutcome: "Rejected",
      isTerminal: true,
    };
  }

  const currentIndex = workflow.stages.indexOf(currentStage);
  const nextStage = workflow.stages[Math.min(currentIndex + 1, workflow.stages.length - 1)];
  const isTerminal = nextStage === workflow.terminalStage;

  return {
    nextStage,
    status: isTerminal ? "Approved" : "Pending",
    finalOutcome: isTerminal ? "Approved" : null,
    isTerminal,
  };
}
