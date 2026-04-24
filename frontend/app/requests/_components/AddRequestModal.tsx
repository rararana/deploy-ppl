"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Icon from "../../_components/Icon";
import type { RequestFormData, RequestType } from "../_lib/types";

interface AddRequestModalProps {
  open: boolean;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: RequestFormData) => Promise<boolean>;
}

export default function AddRequestModal({
  open,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddRequestModalProps) {
  const [type, setType] = useState<RequestType>("trigger");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setType("trigger");
    setTitle("");
    setDescription("");
  }

  function handleClose() {
    if (isSubmitting) return;
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const didSubmit = await onSubmit({ type, title, description });
    if (didSubmit) {
      reset();
    }
  }

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        reset();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 md:items-center"
      onClick={handleClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-xl bg-white p-5 shadow-lg md:rounded-xl md:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-request-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-request-title" className="text-lg font-bold text-ink">New Request</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close new request dialog"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-n-100 border-none bg-transparent cursor-pointer"
          >
            <Icon k="close" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Type</label>
            <div className="flex bg-n-100 border border-n-200 rounded-[9px] p-0.75 gap-0.5">
              {(["trigger", "action"] as const).map((requestType) => (
                <button
                  key={requestType}
                  type="button"
                  onClick={() => setType(requestType)}
                  className={[
                    "flex-1 h-8 rounded-[7px] border-none font-sans text-[13px] cursor-pointer transition-all duration-180 inline-flex items-center justify-center gap-1.5",
                    type === requestType
                      ? "bg-surface text-ink font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                      : "bg-transparent text-text-secondary font-medium hover:text-ink",
                  ].join(" ")}
                >
                  <Icon k={requestType === "trigger" ? "zap" : "filePlus"} size={13} />
                  {requestType === "trigger" ? "Trigger" : "Action"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your request"
              className="w-full h-9.5 rounded-[10px] border border-n-200 bg-surface px-3.5 font-sans text-[13px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-n-400 focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the trigger or action you want added, and what it should do..."
              rows={4}
              className="w-full rounded-[10px] border border-n-200 bg-surface px-3.5 py-2.5 font-sans text-[13px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-n-400 focus:border-brand focus:ring-[3px] focus:ring-brand/10 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-n-200 bg-surface font-sans text-sm font-medium text-text-secondary cursor-pointer hover:bg-n-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="px-4 py-2 rounded-lg bg-brand font-sans text-sm font-medium text-white cursor-pointer hover:bg-brand/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
