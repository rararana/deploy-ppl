"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import Icon from "../../../_components/Icon";
import type { WorkflowNodeData } from "./types";

export default function ActionNode({ data, selected }: NodeProps) {
  const d = data as unknown as WorkflowNodeData;

  return (
    <div
      className={[
        "w-52 rounded-xl border-2 bg-surface shadow-sm transition-all duration-150",
        selected ? "border-ds-700 shadow-[0_0_0_3px_rgba(21,104,116,0.12)]" : "border-n-200",
        !d.isConfigured && "border-dashed",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-ds-700 !border-2 !border-white" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-ds-50 rounded-t-[10px] border-b border-n-100">
        <div className="w-6 h-6 rounded-md bg-ds-100 flex items-center justify-center text-ds-700 shrink-0">
          <Icon k={d.catalogItem?.icon_key ?? "filePlus"} size={13} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ds-700">Action</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        {d.isConfigured ? (
          <>
            <p className="text-xs font-semibold text-ink leading-tight">{d.catalogItem?.name}</p>
            <p className="text-[10px] text-text-secondary mt-0.5 leading-snug line-clamp-2">
              {d.catalogItem?.description}
            </p>
          </>
        ) : (
          <p className="text-xs text-text-secondary italic">Klik untuk pilih action</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-ds-700 !border-2 !border-white" />
    </div>
  );
}
