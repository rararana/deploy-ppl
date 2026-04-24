import { useMemo, useState } from "react";
import Icon from "../../_components/Icon";
import { formatDate, formatTime } from "../_lib/format";
import type { AppRequest, RequestStatus, RequestType } from "../_lib/types";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";

const REQUESTS_PER_PAGE = 10;
const ALL_TYPES = "all";
type RequestTypeFilter = RequestType | typeof ALL_TYPES;
type SortOption = "newest" | "oldest" | "title_az" | "title_za" | "status" | "type" | "requester";

const TYPE_FILTERS: Array<{ label: string; value: RequestTypeFilter }> = [
  { label: "All types", value: ALL_TYPES },
  { label: "Trigger", value: "trigger" },
  { label: "Action", value: "action" },
];

const STATUS_FILTERS: Array<{ label: string; value: RequestStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Title A-Z", value: "title_az" },
  { label: "Title Z-A", value: "title_za" },
  { label: "Status", value: "status" },
  { label: "Type", value: "type" },
  { label: "Requester", value: "requester" },
];

const NAV_BTN =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-n-200 bg-surface text-text-secondary cursor-pointer hover:bg-n-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-45";

interface RequestsTableProps {
  requests: AppRequest[];
  isAdmin: boolean;
  onSelectRequest: (request: AppRequest) => void;
}

export default function RequestsTable({
  requests,
  isAdmin,
  onSelectRequest,
}: RequestsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<RequestTypeFilter>(ALL_TYPES);
  const [statusFilters, setStatusFilters] = useState<RequestStatus[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);


  // --- filter + sort ---

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = requests.filter((request) => {
      if (typeFilter !== ALL_TYPES && request.type !== typeFilter) return false;
      if (statusFilters.length > 0 && !statusFilters.includes(request.status)) return false;
      if (!normalizedQuery) return true;

      return [
        request.title,
        request.description,
        request.admin_note ?? "",
        request.type,
        request.status,
        request.account?.full_name ?? "",
        request.account?.email ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "title_az") return a.title.localeCompare(b.title);
      if (sortBy === "title_za") return b.title.localeCompare(a.title);
      if (sortBy === "status") return a.status.localeCompare(b.status) || b.created_at.localeCompare(a.created_at);
      if (sortBy === "type") return a.type.localeCompare(b.type) || b.created_at.localeCompare(a.created_at);
      if (sortBy === "requester") {
        const nameA = a.account?.full_name || a.account?.email || "";
        const nameB = b.account?.full_name || b.account?.email || "";
        return nameA.localeCompare(nameB) || b.created_at.localeCompare(a.created_at);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [query, requests, sortBy, statusFilters, typeFilter]);


  // --- handlers ---

  function resetPage() {
    setCurrentPage(1);
  }
  function updateQuery(value: string) { setQuery(value); resetPage(); }
  function updateTypeFilter(value: RequestTypeFilter) { setTypeFilter(value); resetPage(); }
  function clearStatusFilters() { setStatusFilters([]); resetPage(); }
  function clearAllFilters() { setTypeFilter(ALL_TYPES); setStatusFilters([]); resetPage(); }
  function toggleStatusFilter(value: RequestStatus) {
    setStatusFilters((current) =>
      current.includes(value) ? current.filter((s) => s !== value) : [...current, value],
    );
    resetPage();
  }
  function updateSort(value: SortOption) { setSortBy(value); resetPage(); }

  function chipClass(isActive: boolean) {
    return [
      "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 font-sans text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap",
      isActive
        ? "border-brand bg-ds-50 text-brand"
        : "border-n-200 bg-surface text-text-secondary hover:bg-n-100 hover:text-ink",
    ].join(" ");
  }


  // --- derived values ---

  const activeFilterCount = (typeFilter === ALL_TYPES ? 0 : 1) + statusFilters.length;

  function renderSortSelect(wrapperClassName = "") {
    const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest";

    return (
      <div className={`relative ${wrapperClassName}`}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none">
          <Icon k="sort" size={15} />
        </span>
        <span className="pointer-events-none absolute inset-x-10 top-1/2 -translate-y-1/2 truncate text-center font-sans text-[12px] font-medium text-text-secondary md:hidden">
          {selectedSortLabel}
        </span>
        <select
          value={sortBy}
          onChange={(e) => updateSort(e.target.value as SortOption)}
          className="h-10 w-full appearance-none rounded-[10px] border border-n-200 bg-surface pl-9 pr-9 text-left font-sans text-[12px] font-medium text-transparent outline-none cursor-pointer focus:border-brand focus:ring-[3px] focus:ring-brand/10 md:pr-10 md:text-text-secondary"
          aria-label="Sort requests"
        >
          {SORT_OPTIONS.filter((o) => isAdmin || o.value !== "requester").map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none">
          <Icon k="chevDown" size={14} />
        </span>
      </div>
    );
  }


  // --- pagination ---

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const firstIndex = (activePage - 1) * REQUESTS_PER_PAGE;
  const lastIndex = Math.min(firstIndex + REQUESTS_PER_PAGE, filteredRequests.length);
  const paginatedRequests = filteredRequests.slice(firstIndex, lastIndex);
  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(activePage - 1, totalPages - 2));
    const end = Math.min(totalPages, start + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [activePage, totalPages]);
  const columnWidths = isAdmin
    ? { requester: "w-[18%]", type: "w-[12%]", title: "w-[28%]", status: "w-[12%]", created: "w-[14%]", note: "w-[12%]" }
    : { type: "w-[14%]", title: "w-[36%]", status: "w-[14%]", created: "w-[16%]", note: "w-[16%]" };


  return (
    <div className="overflow-hidden md:rounded-xl md:border md:border-n-200 md:bg-surface">
      
      {/* filter bar */}
      <div className="border-b border-n-200 bg-page-bg px-0 py-3 md:bg-surface md:px-4 md:py-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none">
                <Icon k="search" size={15} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder={isAdmin ? "Search title, requester, status..." : "Search title, description, status..."}
                className="w-full h-10 rounded-[10px] border border-n-200 bg-surface pl-9.5 pr-3.5 font-sans text-[13px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-n-400 focus:border-brand focus:ring-[3px] focus:ring-brand/10"
              />
            </div>
            {renderSortSelect("hidden md:block md:min-w-40")}
          </div>

          <div className="grid grid-cols-2 gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((o) => !o)}
              className={[
                "relative h-10 rounded-[10px] border bg-surface px-10 font-sans text-[12px] font-semibold cursor-pointer transition-colors",
                mobileFiltersOpen || activeFilterCount > 0
                  ? "border-brand bg-ds-50 text-brand"
                  : "border-n-200 bg-surface text-text-secondary hover:bg-n-100 hover:text-ink",
              ].join(" ")}
              aria-expanded={mobileFiltersOpen}
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon k="filter" size={14} />
              </span>
              <span className="flex h-full min-w-0 items-center justify-center gap-1.5 truncate">
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon k="chevDown" size={14} className={mobileFiltersOpen ? "rotate-180" : ""} />
              </span>
            </button>
            {renderSortSelect("min-w-0")}
          </div>

          {activeFilterCount > 0 && (
            <div className="md:hidden flex gap-1.5 overflow-x-auto pb-0.5">
              {typeFilter !== ALL_TYPES && (
                <button
                  type="button"
                  onClick={() => updateTypeFilter(ALL_TYPES)}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-brand bg-ds-50 px-3 font-sans text-xs font-semibold text-brand"
                >
                  {TYPE_FILTERS.find((f) => f.value === typeFilter)?.label}
                  <Icon k="close" size={12} />
                </button>
              )}
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatusFilter(status)}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-brand bg-ds-50 px-3 font-sans text-xs font-semibold text-brand capitalize"
                >
                  {status}
                  <Icon k="close" size={12} />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex h-8 shrink-0 items-center rounded-lg border border-transparent px-2.5 font-sans text-xs font-semibold text-brand cursor-pointer transition-colors hover:bg-ds-50"
              >
                Clear
              </button>
            </div>
          )}

          {mobileFiltersOpen && (
            <div className="md:hidden rounded-[10px] border border-n-200 bg-n-50/70 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">Type</p>
              <div className="mb-3 flex flex-wrap gap-1.5" aria-label="Filter by request type">
                {TYPE_FILTERS.map((f) => (
                  <button key={f.value} type="button" onClick={() => updateTypeFilter(f.value)} className={chipClass(typeFilter === f.value)} aria-pressed={typeFilter === f.value}>
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">Status</p>
              <div className="flex flex-wrap gap-1.5" aria-label="Filter by request status. Multiple statuses can be selected.">
                {STATUS_FILTERS.map((f) => (
                  <button key={f.value} type="button" onClick={() => toggleStatusFilter(f.value)} className={chipClass(statusFilters.includes(f.value))} aria-pressed={statusFilters.includes(f.value)}>
                    {statusFilters.includes(f.value) && <Icon k="check" size={13} />}
                    {f.label}
                  </button>
                ))}
                {statusFilters.length > 0 && (
                  <button type="button" onClick={clearStatusFilters} className="inline-flex h-8 items-center rounded-lg border border-transparent px-2.5 font-sans text-xs font-semibold text-brand cursor-pointer transition-colors hover:bg-ds-50">
                    Clear statuses
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="hidden flex-col gap-2 md:flex md:flex-row md:flex-wrap md:items-center">
            <div className="flex flex-wrap gap-1.5" aria-label="Filter by request type">
              {TYPE_FILTERS.map((f) => (
                <button key={f.value} type="button" onClick={() => updateTypeFilter(f.value)} className={chipClass(typeFilter === f.value)} aria-pressed={typeFilter === f.value}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="hidden h-5 w-px bg-n-200 xl:block" />

            <div className="flex flex-wrap gap-1.5" aria-label="Filter by request status. Multiple statuses can be selected.">
              {STATUS_FILTERS.map((f) => (
                <button key={f.value} type="button" onClick={() => toggleStatusFilter(f.value)} className={chipClass(statusFilters.includes(f.value))} aria-pressed={statusFilters.includes(f.value)}>
                  {statusFilters.includes(f.value) && <Icon k="check" size={13} />}
                  {f.label}
                </button>
              ))}
              {statusFilters.length > 0 && (
                <button type="button" onClick={clearStatusFilters} className="inline-flex h-8 items-center rounded-lg border border-transparent px-2.5 font-sans text-xs font-semibold text-brand cursor-pointer transition-colors hover:bg-ds-50">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-surface px-4 py-12 text-center">
          <Icon k="search" size={28} className="text-n-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-ink">No matching requests</p>
          <p className="text-xs text-text-secondary mt-1">Try a different search, filter, or sort option.</p>
        </div>
      ) : (
        <>

          {/* mobile cards */}
          <div className="md:hidden flex flex-col gap-3 bg-page-bg py-3">
            {paginatedRequests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => onSelectRequest(request)}
                className="w-full min-h-28 rounded-lg border border-n-200 bg-surface px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors cursor-pointer hover:bg-n-50 active:bg-n-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <TypeBadge type={request.type} />
                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-2 mb-2 min-w-0">
                  <p className="text-sm font-semibold text-ink leading-5 line-clamp-1">{request.title}</p>
                  <p className="text-xs text-text-secondary leading-5 mt-0.5 line-clamp-2">
                    {request.description}
                  </p>
                </div>

                {isAdmin && (
                  <div className="mb-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Icon k="user" size={12} className="shrink-0" />
                      <p className="min-w-0 break-all line-clamp-1">
                        {request.account?.full_name ?? "-"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Icon k="calendar" size={12} className="shrink-0" />
                      <p className="min-w-0 line-clamp-1">
                        <span>{formatDate(request.created_at)}</span>
                        <span className="mx-1">·</span>
                        <span>{formatTime(request.created_at)}</span>
                      </p>
                    </div>
                    {request.admin_note && (
                      <p className="text-xs text-text-secondary mt-1 line-clamp-1">{request.admin_note}</p>
                    )}
                  </div>
                  <Icon k="chevRight" size={16} className="shrink-0 text-n-400" />
                </div>
              </button>
            ))}
          </div>


          {/* desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-n-200 bg-n-50/70">
                  {isAdmin && (
                    <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${columnWidths.requester}`}>
                      Requester
                    </th>
                  )}
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${columnWidths.type}`}>
                    Type
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${columnWidths.title}`}>
                    Title
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${columnWidths.status}`}>
                    Status
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${columnWidths.created}`}>
                    Created
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${columnWidths.note}`}>
                    Admin Note
                  </th>
                  <th className="w-10 px-4 py-3" aria-label="Details" />
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => onSelectRequest(request)}
                    className="border-b border-n-100 last:border-b-0 hover:bg-n-50/50 cursor-pointer"
                  >
                    {isAdmin && (
                      <td className="px-4 py-3 align-top max-w-55">
                        <p className="text-sm font-semibold text-ink wrap-break-word">{request.account?.full_name ?? "-"}</p>
                        <p className="text-xs text-text-secondary break-all">{request.account?.email ?? ""}</p>
                      </td>
                    )}
                    <td className="px-4 py-3 align-top">
                      <TypeBadge type={request.type} />
                    </td>
                    <td className="px-4 py-3 align-top max-w-65">
                      <p className="text-sm font-semibold text-ink truncate">{request.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{request.description}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-text-secondary whitespace-nowrap">
                      <span className="block">{formatDate(request.created_at)}</span>
                      <span className="block text-xs">{formatTime(request.created_at)}</span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="text-sm text-text-secondary wrap-break-word">{request.admin_note ?? "-"}</p>
                    </td>
                    <td className="px-4 py-3 align-middle text-right text-n-400">
                      <Icon k="chevRight" size={16} className="ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* pagination footer */}
          <div className="border-t border-n-200 bg-n-50/70 px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-text-secondary">
                Showing <span className="font-semibold text-ink">{firstIndex + 1}</span>
                {"-"}
                <span className="font-semibold text-ink">{lastIndex}</span>
                {" of "}
                <span className="font-semibold text-ink">{filteredRequests.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={activePage === 1}
                  className={`${NAV_BTN} hidden md:inline-flex`}
                  aria-label="First page"
                >
                  <Icon k="chevRightDouble" size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={activePage === 1}
                  className={NAV_BTN}
                  aria-label="Previous page"
                >
                  <Icon k="chevRight" size={16} className="rotate-180" />
                </button>
                <div className="hidden items-center gap-1 md:flex">
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCurrentPage(n)}
                      className={[
                        "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 font-sans text-xs font-semibold cursor-pointer transition-colors",
                        activePage === n
                          ? "border-brand bg-ds-50 text-brand"
                          : "border-n-200 bg-surface text-text-secondary hover:bg-n-100 hover:text-ink",
                      ].join(" ")}
                      aria-current={activePage === n ? "page" : undefined}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={activePage === totalPages}
                  className={NAV_BTN}
                  aria-label="Next page"
                >
                  <Icon k="chevRight" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={activePage === totalPages}
                  className={`${NAV_BTN} hidden md:inline-flex`}
                  aria-label="Last page"
                >
                  <Icon k="chevRightDouble" size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
