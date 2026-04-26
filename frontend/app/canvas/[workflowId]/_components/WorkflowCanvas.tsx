"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  BackgroundVariant,
} from "@xyflow/react";

import TriggerNode from "./TriggerNode";
import ActionNode from "./ActionNode";
import NodeSidebar from "./NodeSidebar";
import Icon from "../../../_components/Icon";
import type { CatalogItem, WorkflowNodeData } from "./types";

const nodeTypes = { trigger: TriggerNode, action: ActionNode };

function buildInitialNodes(schema: Record<string, unknown>): Node[] {
  const raw = (schema?.nodes ?? []) as Record<string, unknown>[];
  if (raw.length > 0) {
    return raw.map((n, i) => ({
      id: String(n.id ?? `node-${i}`),
      type: String(n.type ?? "action"),
      position: (n.position as { x: number; y: number }) ?? { x: 200, y: i * 160 + 60 },
      data: n.data as Record<string, unknown> ?? {},
    }));
  }
  // Default: one empty trigger node
  return [
    {
      id: "trigger-1",
      type: "trigger",
      position: { x: 200, y: 60 },
      data: {
        label: "Trigger",
        nodeType: "trigger",
        catalogItem: undefined,
        config: {},
        isConfigured: false,
      } satisfies WorkflowNodeData,
    },
  ];
}

function buildInitialEdges(schema: Record<string, unknown>): Edge[] {
  const raw = (schema?.edges ?? []) as Record<string, unknown>[];
  return raw.map((e, i) => ({
    id: String(e.id ?? `edge-${i}`),
    source: String(e.source),
    target: String(e.target),
    type: "smoothstep",
    animated: true,
  }));
}

interface WorkflowCanvasProps {
  initialSchema: Record<string, unknown>;
  onSave: (schema: Record<string, unknown>) => Promise<void>;
  isSaving: boolean;
}

export default function WorkflowCanvas({ initialSchema, onSave, isSaving }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildInitialNodes(initialSchema));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildInitialEdges(initialSchema));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const firstUnconfigured = nodes.find(
      (n) => {
        const d = n.data as unknown as WorkflowNodeData;
        return d.catalogItem && !d.isConfigured;
      }
    );
    if (firstUnconfigured) {
        const d = firstUnconfigured.data as unknown as WorkflowNodeData;
        // mark as configured
        setNodes((nds) =>
          nds.map((n) =>
            n.id === firstUnconfigured.id
              ? { ...n, data: { ...n.data, isConfigured: true, label: d.catalogItem!.name } }
              : n
          )
        );
        setSelectedNodeId(firstUnconfigured.id);
    }
  }, []); 

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "smoothstep", animated: true }, eds)),
    [setEdges]
  );

  function handleNodeClick(_: React.MouseEvent, node: Node) {
    setSelectedNodeId(node.id);
  }

  function handlePaneClick() {
    setSelectedNodeId(null);
  }

  function handleEdgeDoubleClick(_: React.MouseEvent, edge: Edge) {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }

  function addActionNode() {
    const id = `action-${Date.now()}`;
    const lastNode = nodes[nodes.length - 1];
    const y = lastNode ? (lastNode.position.y + 160) : 220;
    const newNode: Node = {
      id,
      type: "action",
      position: { x: 200, y },
      data: {
        label: "Action",
        nodeType: "action",
        catalogItem: undefined,
        config: {},
        isConfigured: false,
      } satisfies WorkflowNodeData,
    };
    setNodes((nds) => [...nds, newNode]);
    // Auto-connect from last node
    if (lastNode) {
      setEdges((eds) =>
        addEdge({ id: `e-${lastNode.id}-${id}`, source: lastNode.id, target: id, type: "smoothstep", animated: true }, eds)
      );
    }
    setSelectedNodeId(id);
  }

  function handleSidebarSave(nodeId: string, catalogItem: CatalogItem, config: Record<string, unknown>) {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                catalogItem,
                config,
                isConfigured: true,
                label: catalogItem.name,
              },
            }
          : n
      )
    );
  }

  function handleDeleteNode(nodeId: string) {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  }

  function buildSchema() {
    // hapus node dan edge terkait yang blm dikonfigurasi
    const configuredNodes = nodes.filter(
      (n) => (n.data as unknown as WorkflowNodeData).isConfigured
    );
    const configuredNodeIds = new Set(configuredNodes.map((n) => n.id));
    const validEdges = edges.filter(
      (e) => configuredNodeIds.has(e.source) && configuredNodeIds.has(e.target)
    );

    return {
      nodes: configuredNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
        action_key: (n.data as unknown as WorkflowNodeData).catalogItem?.action_key ?? null,
        config: (n.data as unknown as WorkflowNodeData).config ?? {},
      })),
      edges: validEdges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    };
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          deleteKeyCode={["Delete", "Backspace"]}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          className="bg-n-150"
        >
          <Background variant={BackgroundVariant.Lines} gap={24} lineWidth={0.5} color="#c8cdd5" />
          <Controls style={{ marginBottom: 70 }} />
          <MiniMap nodeStrokeWidth={3} className="!border !border-n-200 !rounded-lg" style={{ marginBottom: 100 }} />
        </ReactFlow>

        {/* Floating toolbar */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-surface border border-n-200 rounded-xl px-3 py-2 shadow-md z-10">
          <button
            onClick={addActionNode}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-ds-50 text-ds-700 border border-ds-100 hover:bg-ds-100 transition-colors"
          >
            <Icon k="plus" size={12} />
            Tambah Action
          </button>
          <div className="w-px h-5 bg-n-200" />
          <button
            onClick={() => onSave(buildSchema())}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-60"
          >
            {isSaving ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon k="checkCircle" size={12} />
            )}
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {selectedNode && (
        <NodeSidebar
          nodeId={selectedNode.id}
          nodeData={selectedNode.data as unknown as WorkflowNodeData}
          onClose={() => setSelectedNodeId(null)}
          onSave={handleSidebarSave}
          onDelete={handleDeleteNode}
        />
      )}
    </div>
  );
}
