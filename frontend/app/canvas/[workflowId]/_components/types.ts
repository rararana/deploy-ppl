export interface ParameterField {
  key: string;
  label: string;
  type: "text" | "textarea" | "email" | "number" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
}

export interface ParameterSchema {
  fields: ParameterField[];
}

export interface CatalogItem {
  id: string;
  icon_key: string;
  name: string;
  description: string;
  category: "trigger" | "action";
  item_type: string;
  action_key: string | null;
  parameter_schema: ParameterSchema;
}

export interface WorkflowNodeData {
  label: string;
  nodeType: "trigger" | "action";
  catalogItem?: CatalogItem;
  config: Record<string, unknown>;
  isConfigured: boolean;
}
