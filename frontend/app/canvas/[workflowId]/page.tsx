"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Icon from "../../_components/Icon";
import { apiRequest } from "../../_lib/api";

const WorkflowCanvas = dynamic(
  () => import("./_components/WorkflowCanvas"),
  { ssr: false }
);

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  workflow_schema: Record<string, unknown>;
}

interface WorkflowCanvasPageProps {
  params: Promise<{ workflowId: string }>;
}

function EditMetaModal({
  workflow,
  onClose,
  onSaved,
}: {
  workflow: Workflow;
  onClose: () => void;
  onSaved: (updated: Workflow) => void;
}) {
  const [name, setName] = useState(workflow.name);
  const [description, setDescription] = useState(workflow.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  async function handleSave() {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const updated = await apiRequest<Workflow>(`/workflows/${workflow.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });
      onSaved(updated);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-surface rounded-2xl border border-n-200 shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-ink">Edit Workflow</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-n-100 hover:text-ink"
          >
            <Icon k="close" size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">
              Nama <span className="text-destructive">*</span>
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="w-full rounded-lg border border-n-200 px-3 py-2 text-sm text-ink bg-n-50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">
              Deskripsi <span className="text-text-secondary font-normal">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Apa yang dilakukan workflow ini?"
              rows={3}
              className="w-full rounded-lg border border-n-200 px-3 py-2 text-sm text-ink bg-n-50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-n-200 py-2 text-sm font-medium text-text-secondary hover:bg-n-100"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex-1 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowCanvasPage({ params }: WorkflowCanvasPageProps) {
  const { workflowId } = use(params);
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  useEffect(() => {
    apiRequest<Workflow>(`/workflows/${workflowId}`)
      .then(setWorkflow)
      .catch(() => setError("Workflow tidak ditemukan."));
  }, [workflowId]);

  async function handleToggleActive() {
    if (!workflow || isTogglingActive) return;
    setIsTogglingActive(true);
    try {
      const updated = await apiRequest<Workflow>(`/workflows/${workflowId}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !workflow.is_active }),
      });
      setWorkflow(updated);
    } finally {
      setIsTogglingActive(false);
    }
  }

  async function handleSave(schema: Record<string, unknown>) {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await apiRequest(`/workflows/${workflowId}`, {
        method: "PUT",
        body: JSON.stringify({ workflow_schema: schema }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="h-screen flex flex-col max-w-[2200px] mx-auto overflow-hidden">
      {/* Toolbar */}
      <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-n-200 bg-surface shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-n-200 text-text-secondary hover:bg-n-100 hover:text-ink shrink-0"
          aria-label="Kembali ke dashboard"
        >
          <Icon k="chevRight" size={16} className="rotate-180" />
        </button>

        <div className="flex-1 min-w-0">
          {workflow ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <h1 className="text-base font-semibold text-ink truncate">{workflow.name}</h1>
                {workflow.description && (
                  <p className="text-xs text-text-secondary truncate">{workflow.description}</p>
                )}
              </div>
              <button
                onClick={() => setIsEditingMeta(true)}
                className="shrink-0 p-1.5 rounded-lg text-text-secondary hover:bg-n-100 hover:text-ink"
                aria-label="Edit nama workflow"
              >
                <Icon k="pencil" size={13} />
              </button>
              <button
                onClick={handleToggleActive}
                disabled={isTogglingActive}
                className={[
                  "shrink-0 flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors disabled:opacity-50",
                  workflow.is_active
                    ? "text-green-600 bg-green-50 hover:bg-green-100"
                    : "text-red-400 bg-red-50 hover:bg-red-100",
                ].join(" ")}
                aria-label={workflow.is_active ? "Nonaktifkan workflow" : "Aktifkan workflow"}
              >
                <Icon k={workflow.is_active ? "eye" : "eyeOff"} size={13} />
                <span className="text-[10px] font-semibold leading-none">
                  {isTogglingActive ? "..." : workflow.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </button>
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <div className="h-4 w-40 rounded bg-n-100 animate-pulse" />
          )}
        </div>

        {saveSuccess && (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1 shrink-0">
            <Icon k="checkCircle" size={13} />
            Tersimpan
          </span>
        )}
      </header>

      {/* Canvas */}
      {workflow && (
        <WorkflowCanvas
          initialSchema={workflow.workflow_schema}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {!workflow && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Edit metadata modal */}
      {isEditingMeta && workflow && (
        <EditMetaModal
          workflow={workflow}
          onClose={() => setIsEditingMeta(false)}
          onSaved={setWorkflow}
        />
      )}
    </main>
  );
}
