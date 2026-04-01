import { apiRequest } from "./api";

export interface WorkflowNode {
  id: string;
  type: string;
}

export interface WorkflowEdge {
  source: string;
  target: string;
}

export interface WorkflowPayload {
  name: string;
  description?: string;
  workflow_schema: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
}

export class FrontendAPIService {
  async fetchWorkflows() {
    return apiRequest<unknown[]>("/workflows/");
  }

  async saveWorkflowJSON(workflowData: WorkflowPayload) {
    return apiRequest<unknown>("/workflows/", {
      method: "POST",
      body: JSON.stringify(workflowData),
    });
  }

  async fetchExecutionLogs() {
    return apiRequest<unknown[]>("/execution-logs/");
  }
}
