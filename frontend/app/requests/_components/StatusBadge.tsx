interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] ?? "bg-n-100 text-text-secondary"}`}
    >
      {status}
    </span>
  );
}
