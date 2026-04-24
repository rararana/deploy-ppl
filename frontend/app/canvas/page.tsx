"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormField from "../_components/FormField";
import PrimaryButton from "../_components/PrimaryButton";
import Icon from "../_components/Icon";
import { apiRequest } from "../_lib/api";

interface WorkflowResponse {
  id: string;
  name: string;
  description: string | null;
}

export default function CanvasPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const workflow = await apiRequest<WorkflowResponse>("/workflows/", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          workflow_schema: {},
        }),
      });
      router.push(`/canvas/${workflow.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workflow.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-[2200px] mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-ink mb-8"
      >
        <Icon k="chevRight" size={16} className="rotate-180" />
        Back
      </button>

      <div className="w-full max-w-md lg:max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-ink">New Workflow</h1>
          <p className="mt-2 text-sm lg:text-base text-text-secondary">Give your workflow a name before building it.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 border border-n-200 rounded-xl p-6 lg:p-10 bg-surface">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm lg:text-base font-medium text-ink">
              Title <span className="text-destructive">*</span>
            </label>
            <FormField
              id="name"
              type="text"
              placeholder="e.g. Send invoice on payment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="lg:px-6 lg:py-4 lg:text-xl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm lg:text-base font-medium text-ink">
              Description <span className="text-text-secondary font-normal">(optional)</span>
            </label>
            <textarea
              ref={textareaRef}
              id="description"
              placeholder="What does this workflow do?"
              value={description}
              onChange={handleDescriptionChange}
              rows={3}
              style={{ maxHeight: "432px" }}
              className="w-full rounded-xl px-5 py-3 lg:px-6 lg:py-4 text-lg lg:text-xl text-ink bg-field-bg border-2 border-field-border placeholder:text-ink/65 outline-none focus:ring-2 focus:ring-brand resize-none overflow-y-auto"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive text-center">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <PrimaryButton type="submit" disabled={isLoading || !name.trim()} className="flex-1">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </main>

  );
}
