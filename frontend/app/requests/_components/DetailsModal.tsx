"use client";

import { useEffect, useState } from "react";
import Icon from "../../_components/Icon";
import { formatDateTime } from "../_lib/format";
import type { AppRequest, ReviewAction } from "../_lib/types";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";

interface DetailsModalProps {
  request: AppRequest | null;
  isAdmin: boolean;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onReview: (request: AppRequest, action: ReviewAction, note: string) => void;
}

export default function DetailsModal({
  request,
  isAdmin,
  isSubmitting,
  error,
  onClose,
  onReview,
}: DetailsModalProps) {
  const [note, setNote] = useState("");

  function handleClose() {
    if (isSubmitting) return;
    onClose();
  }

  useEffect(() => {
    if (!request) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [request, isSubmitting, onClose]);

  if (!request) return null;
  const canReview = isAdmin && request.status === "pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 md:items-center"
      onClick={handleClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-5 shadow-lg md:rounded-xl md:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge type={request.type} />
              <StatusBadge status={request.status} />
            </div>
            <h2 id="request-details-title" className="text-lg font-bold text-ink leading-snug wrap-break-word">{request.title}</h2>
            <p className="text-xs text-text-secondary mt-1">Created {formatDateTime(request.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close request details dialog"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-n-100 border-none bg-transparent cursor-pointer shrink-0"
          >
            <Icon k="close" size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {isAdmin && request.account && (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-secondary mb-1.5">
                Requester
              </p>
              <div className="rounded-lg border border-n-200 bg-n-50/70 px-3.5 py-3 min-w-0">
                <p className="text-sm font-semibold text-ink wrap-break-word">{request.account.full_name}</p>
                <p className="text-xs text-text-secondary mt-0.5 break-all">{request.account.email}</p>
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-secondary mb-1">
              Description
            </p>
            <div className="rounded-lg border border-n-200 bg-n-50/70 px-3.5 py-3 min-h-13 min-w-0">
              <p className="text-sm text-ink leading-6 whitespace-pre-wrap wrap-break-word">{request.description}</p>
            </div>
          </div>

          {request.admin_note && (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-secondary mb-1.5">
                Admin Note
              </p>
              <div className="rounded-lg border border-n-200 bg-n-50/70 px-3.5 py-3 min-h-13 min-w-0">
                <p className="text-sm text-ink leading-6 whitespace-pre-wrap wrap-break-word">{request.admin_note}</p>
              </div>
            </div>
          )}
        </div>

        {canReview && (
          <>
            <div className="mt-4">
              <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-text-secondary mb-1.5">
                Note{" "}
                <span className="font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for the requester..."
                rows={3}
                className="w-full rounded-[10px] border border-n-200 bg-surface px-3.5 py-2.5 font-sans text-[13px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-n-400 focus:border-brand focus:ring-[3px] focus:ring-brand/10 resize-none"
              />
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 justify-end mt-4 md:flex-row">
              <button
                onClick={() => onReview(request, "rejected", note)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-transparent text-red-700 font-sans text-sm font-semibold border border-red-700 cursor-pointer hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                <Icon k="xCircle" size={14} />
                {isSubmitting ? "Submitting..." : "Reject"}
              </button>
              <button
                onClick={() => onReview(request, "approved", note)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white font-sans text-sm font-semibold border border-green-600 cursor-pointer hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Icon k="checkCircle" size={14} />
                {isSubmitting ? "Submitting..." : "Approve"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
