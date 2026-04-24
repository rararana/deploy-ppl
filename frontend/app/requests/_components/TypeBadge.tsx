import Icon from "../../_components/Icon";

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const iconKey = type === "trigger" ? "zap" : "filePlus";

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.06em] uppercase text-text-secondary bg-n-100 border border-n-200 rounded-full px-2 py-0.5">
      <Icon k={iconKey} size={11} />
      {type}
    </span>
  );
}
