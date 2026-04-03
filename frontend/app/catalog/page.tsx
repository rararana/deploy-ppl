"use client";

import { useState, useMemo } from "react";
import AppShell from "../_components/nav/AppShell";
import Icon from "../_components/Icon";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Mode = "trigger" | "action";
type ItemType = "Event" | "Schedule" | "Webhook" | "API";

interface CatalogItem {
  iconKey: string;
  name: string;
  desc: string;
  type: ItemType;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const TRIGGERS: CatalogItem[] = [
  { iconKey: "zap",         name: "On Form Submit",      desc: "Fires when a user submits a workflow form.",              type: "Event"    },
  { iconKey: "clock",       name: "Scheduled Run",       desc: "Trigger at fixed intervals or cron expression.",         type: "Schedule" },
  { iconKey: "link",        name: "Webhook Received",    desc: "Listens for an inbound HTTP POST to your endpoint.",     type: "Webhook"  },
  { iconKey: "filePlus",    name: "On Request Created",  desc: "Activates when a new request entry is submitted.",       type: "Event"    },
  { iconKey: "checkCircle", name: "On Approval",         desc: "Runs after a request receives an approval sign-off.",    type: "Event"    },
  { iconKey: "xCircle",     name: "On Rejection",        desc: "Triggered when an approver rejects a submission.",       type: "Event"    },
  { iconKey: "bell",        name: "Status Change",       desc: "Watches for any status transition on a record.",         type: "Schedule" },
  { iconKey: "radio",       name: "API Event",           desc: "Subscribes to external API events via polling.",         type: "API"      },
  { iconKey: "upload",      name: "On File Upload",      desc: "Triggers when an attachment is added to a request.",     type: "Event"    },
];

const ACTIONS: CatalogItem[] = [
  { iconKey: "mail",      name: "Send Email",          desc: "Dispatch a templated email to one or more recipients.",  type: "API"      },
  { iconKey: "msg",       name: "Post to Slack",       desc: "Send a message to a Slack channel or direct message.",   type: "Webhook"  },
  { iconKey: "edit",      name: "Update Record",       desc: "Modify fields on an existing request or entry.",         type: "Event"    },
  { iconKey: "lock",      name: "Lock Workflow",       desc: "Prevent further edits on a completed workflow.",         type: "Event"    },
  { iconKey: "chart",     name: "Generate Report",     desc: "Create and store a PDF summary of workflow data.",       type: "API"      },
  { iconKey: "refresh",   name: "Retry Action",        desc: "Re-run a failed step with exponential backoff.",         type: "Schedule" },
  { iconKey: "userCheck", name: "Assign User",         desc: "Route a task to a specific team member.",                type: "Event"    },
  { iconKey: "globe",     name: "HTTP Request",        desc: "Call any external REST endpoint with custom headers.",   type: "Webhook"  },
  { iconKey: "bellPlus",  name: "Create Notification", desc: "Push an in-app alert to the target user.",               type: "API"      },
];

// ─── Card ──────────────────────────────────────────────────────────────────────

function CatalogCard({ item, mode }: { item: CatalogItem; mode: Mode }) {
  return (
    <div className="group relative bg-surface rounded-[12px] border border-n-200 overflow-hidden flex flex-col gap-2 md:gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-[180ms] hover:border-ds-100 hover:shadow-[0_4px_12px_rgba(21,104,116,0.08)] active:scale-[0.97] active:bg-n-50 md:active:scale-100 md:hover:-translate-y-px p-[14px_12px] md:p-[18px_16px] min-h-[130px] md:min-h-0">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms]" />

      {/* Icon + type badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-[34px] h-[34px] md:w-9 md:h-9 rounded-lg md:rounded-[9px] bg-n-100 flex items-center justify-center text-n-900 shrink-0">
          <Icon k={item.iconKey} size={16} />
        </div>
        <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.06em] uppercase text-text-secondary bg-n-100 border border-n-200 rounded-full px-[7px] py-[2px] self-start shrink-0">
          {item.type}
        </span>
      </div>

      {/* Name + desc */}
      <div>
        <p className="text-[12px] md:text-[13px] font-semibold text-ink leading-[1.3]">{item.name}</p>
        <p className="text-[10px] md:text-[12px] text-text-secondary leading-[1.5] mt-0.5">{item.desc}</p>
      </div>

      {/* CTA — desktop only */}
      <div className="hidden md:flex items-center mt-auto pt-2.5 border-t border-n-100">
        <span className="text-[11px] font-semibold text-brand flex items-center gap-1">
          Use this {mode}
          <Icon k="chevRight" size={12} />
        </span>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [mode, setMode] = useState<Mode>("trigger");
  const [query, setQuery] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setQuery("");
  }

  const items = mode === "trigger" ? TRIGGERS : ACTIONS;
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter(
      (d) => d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <AppShell
      title="Triggers & Actions"
      mobileHeaderRight={
        <button
          aria-label="Settings"
          className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer text-brand rounded-full hover:bg-n-100 transition-colors duration-150"
        >
          <Icon k="settings" size={18} />
        </button>
      }
    >
      {/* ── Mobile: extended sticky header (large title + search + seg) ─── */}
      {/* top-11 = 44px = AppShell compact bar height                        */}
      <div className="md:hidden sticky top-11 z-30 bg-surface border-b border-n-200">
        <div className="px-4 pt-2 pb-3">
          <h1 className="text-[28px] font-bold text-ink tracking-[-0.02em] leading-[1.1]">
            Catalog
          </h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Automate your institution&apos;s workflows
          </p>
        </div>

        <div className="px-4 pb-2.5">
          <div className="flex items-center gap-2 bg-n-100 border border-n-200 rounded-[10px] px-3 h-9">
            <Icon k="search" size={14} className="text-n-400 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 border-none bg-transparent font-sans text-[14px] text-ink outline-none placeholder:text-n-400"
            />
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex bg-n-200 rounded-[9px] p-0.5 gap-px">
            {(["trigger", "action"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={[
                  "flex-1 h-8 rounded-[7px] border-none font-sans text-[13px] cursor-pointer transition-all duration-[180ms]",
                  mode === m
                    ? "bg-surface text-ink font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                    : "bg-transparent text-text-secondary font-medium hover:text-ink",
                ].join(" ")}
              >
                {m === "trigger" ? "Trigger" : "Action"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page body ──────────────────────────────────────────────────────── */}
      <div className="max-w-[960px] mx-auto px-4 md:px-8 pt-4 md:pt-10 pb-[100px] md:pb-20">

        {/* Desktop page header */}
        <header className="hidden md:block mb-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-1.5">
            Automation catalog
          </p>
          <h1 className="text-[26px] font-bold text-ink leading-[1.2]">
            Triggers &amp; Actions
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            Connect events to automated responses across your institution&apos;s workflows.
          </p>
        </header>

        {/* Desktop controls row */}
        <div className="hidden md:flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex bg-n-100 border border-n-200 rounded-[9px] p-[3px] gap-0.5">
            {(["trigger", "action"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={[
                  "flex items-center gap-[7px] text-[13px] px-6 py-[7px] rounded-[7px] border-none cursor-pointer font-sans transition-all duration-[180ms]",
                  mode === m
                    ? "bg-surface text-ink font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.10)]"
                    : "bg-transparent text-text-secondary font-medium hover:text-ink",
                ].join(" ")}
              >
                <Icon k={m === "trigger" ? "zap" : "filePlus"} size={14} />
                {m === "trigger" ? "Trigger" : "Action"}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none">
              <Icon k="search" size={15} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${mode}s\u2026`}
              className="w-full h-[38px] rounded-[10px] border border-n-200 bg-surface pl-[38px] pr-3.5 font-sans text-[13px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-n-400 focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <p className="text-[12px] font-medium text-text-secondary">
            Showing{" "}
            <span className="text-ink font-semibold">{filtered.length}</span>{" "}
            {filtered.length === 1 ? mode : `${mode}s`}
          </p>
          <select className="text-[12px] font-medium text-text-secondary bg-transparent border-none outline-none cursor-pointer font-sans">
            <option>Sort: Most used</option>
            <option>Sort: A–Z</option>
            <option>Sort: Type</option>
          </select>
        </div>

        {/* Card grid */}
        {filtered.length === 0 ? (
          <div className="bg-surface border border-dashed border-n-200 rounded-[12px] min-h-[160px] flex flex-col items-center justify-center gap-2">
            <Icon k="search" size={24} className="text-n-400" />
            <p className="text-sm font-medium text-text-secondary">No results found</p>
            <p className="text-xs text-n-400">Try a different keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
            {filtered.map((item) => (
              <CatalogCard key={item.name} item={item} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
