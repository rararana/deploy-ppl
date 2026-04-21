"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "../_components/Icon";
import { apiRequest } from "../_lib/api";

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  webhook_token: string;
}

interface DeleteConfirmDialogProps {
  open: boolean;
  workflowName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDialog({
  open,
  workflowName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
        <h2 className="text-lg font-bold text-ink mb-2">Delete Workflow</h2>
        <p className="text-sm text-text-secondary mb-6">
          Are you sure you want to delete <strong>{workflowName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg border border-n-200 bg-surface font-sans text-sm font-medium text-text-secondary cursor-pointer hover:bg-n-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-500 font-sans text-sm font-medium text-white cursor-pointer hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; workflowId: string; name: string }>({
    open: false,
    workflowId: "",
    name: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const data = await apiRequest<Workflow[]>("/workflows/");
        setWorkflows(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch workflows");
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflows();
  }, []);

  async function handleDeleteWorkflow() {
    if (!deleteDialog.workflowId) return;

    setIsDeleting(true);
    try {
      await apiRequest(`/workflows/${deleteDialog.workflowId}`, { method: "DELETE" });
      setWorkflows((prev) => prev.filter((w) => w.id !== deleteDialog.workflowId));
      setDeleteDialog({ open: false, workflowId: "", name: "" });
    } catch (err) {
      console.error("Failed to delete workflow", err);
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(workflow: Workflow) {
    setDeleteDialog({
      open: true,
      workflowId: workflow.id,
      name: workflow.name,
    });
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">Workflows</h1>
          <p className="text-text-secondary">Manage and edit your automation workflows</p>
        </div>
        <Link
          href="/canvas"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white font-sans font-medium no-underline cursor-pointer hover:bg-brand/90 transition-colors"
        >
          <Icon k="plus" size={16} />
          Create Workflow
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-text-secondary">Loading workflows...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-medium">Error loading workflows</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : workflows.length === 0 ? (
        <div className="bg-surface border border-dashed border-n-200 rounded-lg p-12 text-center">
          <Icon k="grid" size={32} className="text-n-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-ink mb-1">No workflows yet</p>
          <p className="text-sm text-text-secondary">Create your first workflow to get started</p>
          <Link
            href="/canvas"
            className="inline-block mt-6 px-6 py-2 rounded-lg bg-brand text-white font-sans font-medium no-underline cursor-pointer hover:bg-brand/90 transition-colors"
          >
            Create Workflow
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-n-200 rounded-xl">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-n-200 bg-n-50/70">
                <th className="w-[30%] text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">Title</th>
                <th className="w-[40%] text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">Created</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((workflow) => (
                <tr key={workflow.id} className="border-b border-n-100 last:border-b-0 hover:bg-n-50/50">
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm font-semibold text-ink">{workflow.name}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm text-text-secondary break-words">{workflow.description || "No description"}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                        workflow.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {workflow.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-text-secondary">{formatDate(workflow.created_at)}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/canvas/${workflow.id}`}
                        aria-label={`Edit ${workflow.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-n-200 text-text-secondary no-underline hover:bg-n-100 hover:text-ink"
                      >
                        <Icon k="pencil" size={15} />
                      </Link>
                      <button
                        onClick={() => openDeleteDialog(workflow)}
                        aria-label={`Delete ${workflow.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Icon k="trashcan" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialog.open}
        workflowName={deleteDialog.name}
        onConfirm={handleDeleteWorkflow}
        onCancel={() => setDeleteDialog({ open: false, workflowId: "", name: "" })}
        isDeleting={isDeleting}
      />
    </main>
  );
}
