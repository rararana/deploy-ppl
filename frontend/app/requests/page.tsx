"use client";

import { useEffect, useState } from "react";
import Icon from "../_components/Icon";
import { apiRequest } from "../_lib/api";
import { getCurrentRole } from "../_lib/auth";
import AddRequestModal from "./_components/AddRequestModal";
import DetailsModal from "./_components/DetailsModal";
import RequestsTable from "./_components/RequestsTable";
import type { AppRequest, RequestFormData, ReviewAction } from "./_lib/types";

export default function RequestsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailsRequest, setDetailsRequest] = useState<AppRequest | null>(null);

  useEffect(() => {
    setRole(getCurrentRole());
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);
      const data = await apiRequest<AppRequest[]>("/requests/");
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddRequest(data: RequestFormData) {
    setIsSubmitting(true);
    setCreateError(null);
    try {
      const created = await apiRequest<AppRequest>("/requests/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setRequests((prev) => [created, ...prev]);
      setAddModalOpen(false);
      return true;
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create request.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function reviewRequest(request: AppRequest, action: ReviewAction, note: string) {
    setIsSubmitting(true);
    setReviewError(null);
    try {
      const updated = await apiRequest<AppRequest>(`/requests/${request.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: action, admin_note: note || null }),
      });
      setRequests((prev) => prev.map((current) => (current.id === updated.id ? updated : current)));
      setDetailsRequest(null);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed to update request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openAddModal() {
    setCreateError(null);
    setAddModalOpen(true);
  }

  const isAdmin = role === "admin";

  return (
    <>
      <div className="md:hidden sticky top-11 z-30 bg-surface border-b border-n-200 px-4 pt-2 pb-3">
        <h1 className="text-[28px] font-bold text-ink tracking-[-0.02em] leading-[1.1]">Requests</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {isAdmin
            ? "Review and manage trigger & action requests from users."
            : "Submit and track your trigger & action requests."}
        </p>
      </div>

      <main className="mx-auto px-4 md:px-8 pt-4 md:pt-10 pb-25 md:pb-20">
        <header className="hidden md:flex items-start justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-1.5">
              {isAdmin ? "Admin panel" : "My requests"}
            </p>
            <h1 className="text-[26px] font-bold text-ink leading-[1.2]">Requests</h1>
            <p className="text-sm text-text-secondary mt-1.5">
              {isAdmin
                ? "Review and manage trigger & action requests from users."
                : "Submit and track your trigger & action requests."}
            </p>
          </div>
          {!isAdmin && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-white font-sans text-sm font-medium border-none cursor-pointer hover:bg-brand/90 transition-colors shrink-0"
            >
              <Icon k="plus" size={15} />
              Add Request
            </button>
          )}
        </header>

        {!isAdmin && (
          <div className="flex justify-end mb-4 md:hidden">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white font-sans text-sm font-medium border-none cursor-pointer hover:bg-brand/90 transition-colors"
            >
              <Icon k="plus" size={15} />
              Add Request
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-text-secondary">Loading requests...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <p className="font-medium">Error loading requests</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              type="button"
              onClick={fetchRequests}
              className="mt-4 px-4 py-2 rounded-lg border border-red-200 bg-white font-sans text-sm font-semibold text-red-700 cursor-pointer hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-surface border border-dashed border-n-200 rounded-lg p-12 text-center">
            <Icon k="fileText" size={32} className="text-n-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-ink mb-1">No requests yet</p>
            <p className="text-sm text-text-secondary">
              {isAdmin ? "No requests have been submitted." : "Submit your first trigger or action request."}
            </p>
          </div>
        ) : (
          <RequestsTable
            requests={requests}
            isAdmin={isAdmin}
            onSelectRequest={(request) => {
              setReviewError(null);
              setDetailsRequest(request);
            }}
          />
        )}
      </main>

      <AddRequestModal
        open={addModalOpen}
        isSubmitting={isSubmitting}
        error={createError}
        onClose={() => {
          setCreateError(null);
          setAddModalOpen(false);
        }}
        onSubmit={handleAddRequest}
      />

      <DetailsModal
        key={detailsRequest?.id ?? "closed"}
        request={detailsRequest}
        isAdmin={isAdmin}
        isSubmitting={isSubmitting}
        error={reviewError}
        onClose={() => {
          setReviewError(null);
          setDetailsRequest(null);
        }}
        onReview={reviewRequest}
      />
    </>
  );
}
