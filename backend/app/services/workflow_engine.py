from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.workflow_model import Workflow
from app.services.actions.registry import get_action_strategy

# placeholder for workflow execution orchestration logic
class WorkflowEngine:
    def get_workflow(self, workflow_id: UUID, db: Session) -> Workflow | None:
        return db.query(Workflow).filter(Workflow.id == workflow_id).first()

    def get_workflow_by_webhook_token(self, webhook_token: str, db: Session) -> Workflow | None:
        return db.query(Workflow).filter(Workflow.webhook_token == webhook_token).first()

    def parse_schema(self, schema_json: dict[str, Any]) -> dict[str, Any]:
        return {
            "nodes": schema_json.get("nodes", []),
            "edges": schema_json.get("edges", []),
        }

    def initiate_execution(self, workflow: Workflow, payload: dict[str, Any]) -> dict[str, Any]:
        # Placeholder execution bootstrap.
        return {
            "workflow_id": str(workflow.id),
            "status": "pending",
            "payload": payload,
        }

    def find_next_node(self, schema_json: dict[str, Any], current_node_id: str | None) -> dict[str, Any] | None:
        nodes = schema_json.get("nodes", [])
        if not nodes:
            return None

        if current_node_id is None:
            return nodes[0]

        for index, node in enumerate(nodes):
            if node.get("id") == current_node_id and index + 1 < len(nodes):
                return nodes[index + 1]

        return None

    def resolve_action_nodes(self, schema_json: dict[str, Any]) -> list[dict[str, Any]]:
        nodes = schema_json.get("nodes", [])
        if isinstance(nodes, list) and nodes:
            resolved_nodes: list[dict[str, Any]] = []
            for node in nodes:
                if not isinstance(node, dict):
                    continue
                node_type = str(node.get("type", "")).lower()
                data = node.get("data", {}) if isinstance(node.get("data"), dict) else {}
                config = node.get("config", {}) if isinstance(node.get("config"), dict) else {}
                action_type = (
                    node.get("action_type")
                    or node.get("action")
                    or data.get("action_type")
                    or data.get("action")
                    or config.get("action_type")
                    or config.get("action")
                )
                if node_type == "action" or action_type:
                    resolved_nodes.append(node)
            return resolved_nodes

        steps = schema_json.get("steps", [])
        resolved_steps: list[dict[str, Any]] = []
        for index, step in enumerate(steps if isinstance(steps, list) else []):
            if not isinstance(step, dict):
                continue
            if str(step.get("type", "")).lower() != "action":
                continue
            resolved_steps.append(
                {
                    "id": f"step-{index}",
                    "type": "action",
                    "config": {
                        "action_type": step.get("action_type") or self._infer_action_type_from_step(step),
                        **step,
                    },
                }
            )
        return resolved_steps

    def _infer_action_type_from_step(self, step: dict[str, Any]) -> str | None:
        name = str(step.get("name", "")).lower()
        if "whatsapp" in name:
            return "send_whatsapp"
        if "compress" in name and "image" in name:
            return "compress_image"
        if "webhook" in name:
            return "webhook_callback"
        if "calendar" in name or "gcal" in name:
            return "google_calendar_create_event"
        return None

    def execute_action_node(self, node: dict[str, Any], state_payload: dict[str, Any]) -> dict[str, Any]:
        data = node.get("data", {}) if isinstance(node.get("data"), dict) else {}
        node_config = node.get("config", {}) if isinstance(node.get("config"), dict) else data
        action_type = (
            node.get("action_type")
            or node.get("action")
            or node_config.get("action_type")
            or node_config.get("action")
            or data.get("action_type")
            or data.get("action")
        )

        if not action_type:
            return {
                "status": "failed",
                "detail": "Node missing action_type.",
                "node": node,
            }

        strategy = get_action_strategy(str(action_type))
        if strategy is None:
            return {
                "status": "failed",
                "detail": f"Unsupported action_type: {action_type}",
                "node": node,
            }

        return strategy.execute(state_payload=state_payload, node_config=node_config)
