import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Workflows", href: "/workflows" },
          { label: "Requests", href: "/requests" },
        ].map(({ label, href }) => (
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
