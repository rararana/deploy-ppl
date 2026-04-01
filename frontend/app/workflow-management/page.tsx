"use client";

import { useState } from "react";

import { FrontendAPIService } from "../_lib/frontendApiService";

const apiService = new FrontendAPIService();

export default function WorkflowManagementPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Workflow Management</h1>
      <p className="mt-2 text-sm text-slate-600">use for metadata/status management.</p>
    </main>
  );
}
