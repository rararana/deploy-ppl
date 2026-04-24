"use client";

import { useEffect, useState } from "react";
import Icon from "../../../_components/Icon";
import type { CatalogItem, ParameterField, WorkflowNodeData } from "./types";

interface NodeSidebarProps {
  nodeId: string;
  nodeData: WorkflowNodeData;
  onClose: () => void;
  onSave: (nodeId: string, catalogItem: CatalogItem, config: Record<string, unknown>) => void;
  onDelete: (nodeId: string) => void;
}

function FieldInput({ field, value, onChange }: {
  field: ParameterField;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const base = "w-full rounded-lg px-3 py-2 text-sm text-ink bg-n-50 border border-n-200 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";

  if (field.type === "select") {
    return (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">— Pilih —</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className={`${base} resize-none`}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-n-200 accent-brand"
        />
        <span className="text-sm text-text-secondary">{field.hint ?? field.label}</span>
      </label>
    );
  }

  return (
    <input
      type={field.type}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={base}
    />
  );
}

export default function NodeSidebar({ nodeId, nodeData, onClose, onSave, onDelete }: NodeSidebarProps) {
  const [step, setStep] = useState<"pick" | "configure">(nodeData.isConfigured ? "configure" : "pick");
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [selected, setSelected] = useState<CatalogItem | undefined>(nodeData.catalogItem);
  const [config, setConfig] = useState<Record<string, unknown>>(nodeData.config ?? {});
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const category = nodeData.nodeType;

  useEffect(() => {
    if (step !== "pick") return;
    setLoadingCatalog(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"}/catalog/${category}s`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}` },
    })
      .then((r) => r.json())
      .then((data) => setCatalogItems(Array.isArray(data) ? data : []))
      .catch(() => setCatalogItems([]))
      .finally(() => setLoadingCatalog(false));
  }, [step, category]);

  function handlePick(item: CatalogItem) {
    setSelected(item);
    setConfig({});
    setStep("configure");
  }

  function handleSave() {
    if (!selected) return;
    onSave(nodeId, selected, config);
    onClose();
  }

  const fields = selected?.parameter_schema?.fields ?? [];

  return (
    <aside className="w-80 shrink-0 border-l border-n-200 bg-surface flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-n-200">
        <div className="flex items-center gap-2">
          {step === "configure" && !nodeData.isConfigured && (
            <button onClick={() => setStep("pick")} className="text-text-secondary hover:text-ink">
              <Icon k="chevRight" size={16} className="rotate-180" />
            </button>
          )}
          <h2 className="text-sm font-semibold text-ink">
            {step === "pick" ? `Pilih ${category}` : (selected?.name ?? "Konfigurasi")}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {nodeData.nodeType === "action" && (
            <button
              onClick={() => onDelete(nodeId)}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
              title="Hapus node"
            >
              <Icon k="trashcan" size={14} />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:bg-n-100 hover:text-ink">
            <Icon k="close" size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {step === "pick" ? (
          <div className="p-3 space-y-1.5">
            {loadingCatalog ? (
              <div className="py-8 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : catalogItems.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">Tidak ada item tersedia</p>
            ) : (
              catalogItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePick(item)}
                  className="w-full text-left rounded-lg border border-n-200 p-3 hover:border-brand hover:bg-brand/5 transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-n-100 flex items-center justify-center text-n-900 shrink-0 group-hover:bg-brand/10 group-hover:text-brand">
                      <Icon k={item.icon_key} size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink">{item.name}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5 leading-snug line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Selected item info */}
            {selected && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-n-50 border border-n-200">
                <div className="w-7 h-7 rounded-md bg-n-100 flex items-center justify-center text-n-900 shrink-0">
                  <Icon k={selected.icon_key} size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink">{selected.name}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{selected.description}</p>
                </div>
              </div>
            )}

            {/* Parameter fields */}
            {fields.length > 0 ? (
              fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-medium text-ink flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                  </label>
                  {field.type !== "checkbox" && (
                    <FieldInput field={field} value={config[field.key]} onChange={(v) => setConfig((c) => ({ ...c, [field.key]: v }))} />
                  )}
                  {field.type === "checkbox" && (
                    <FieldInput field={field} value={config[field.key]} onChange={(v) => setConfig((c) => ({ ...c, [field.key]: v }))} />
                  )}
                  {field.hint && field.type !== "checkbox" && (
                    <p className="text-[10px] text-text-secondary">{field.hint}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-text-secondary italic">Tidak ada parameter yang perlu dikonfigurasi.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {step === "configure" && (
        <div className="px-4 py-3 border-t border-n-200">
          <button
            onClick={handleSave}
            disabled={!selected}
            className="w-full rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan
          </button>
        </div>
      )}
    </aside>
  );
}
