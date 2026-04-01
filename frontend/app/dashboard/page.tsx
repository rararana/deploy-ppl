"use client";

import { useMemo } from "react";
import Link from "next/link";

import { getCurrentRole } from "../_lib/auth";

export default function DashboardPage() {
  const role = useMemo(() => getCurrentRole(), []);
  const links =
    role === "admin"
      ? [
          { label: "Requests", href: "/request-log" },
          { label: "Account Management", href: "/account-management" },
        ]
      : [
          { label: "Workflows Management", href: "/workflow-management" },
          { label: "Workflow Builder (Canvas)", href: "/workflows" },
          { label: "Execution Logs", href: "/execution-log" },
          { label: "Make Request", href: "/request"},
        ];

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
          >
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
