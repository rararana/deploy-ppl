from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from app.services.workflow_engine import WorkflowEngine

class WebhookController:

    def __init__(self) -> None:
        self.engine = WorkflowEngine()

    def _execute_workflow(
        self,
        workflow: Any,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        parsed = self.engine.parse_schema(workflow.workflow_schema or {})
        execution_context = self.engine.initiate_execution(workflow, payload)
        state_payload = {**payload}

        action_nodes = self.engine.resolve_action_nodes(parsed)
        results: list[dict[str, Any]] = []

        for node in action_nodes:
            result = self.engine.execute_action_node(node=node, state_payload=state_payload)
            node_result = {
                "node_id": node.get("id"),
                "action_type": (
                    node.get("action_type")
                    or (node.get("config") or {}).get("action_type")
                    or (node.get("data") or {}).get("action_type")
                ),
                "result": result,
            }
            results.append(node_result)
            state_payload["last_action_result"] = result

            continue_on_error = bool((node.get("config") or {}).get("continue_on_error", False))
            if result.get("status") == "failed" and not continue_on_error:
                execution_context["status"] = "failed"
                return {
                    "accepted": True,
                    "triggered": True,
                    "workflow_id": str(workflow.id),
                    "executed_nodes": len(results),
                    "results": results,
                    "execution": execution_context,
                }

        execution_context["status"] = "success"
        return {
            "accepted": True,
            "triggered": True,
            "workflow_id": str(workflow.id),
            "executed_nodes": len(results),
            "results": results,
            "execution": execution_context,
        }

    def post_receive_event(
        self,
        workflow_id: UUID,
        payload: dict[str, Any],
        db: Session,
    ) -> dict[str, Any]:
        workflow = self.engine.get_workflow(workflow_id, db)
        if workflow is None:
            return {"accepted": False, "detail": "Workflow not found."}
        if not workflow.is_active:
            return {"accepted": False, "detail": "Workflow is inactive."}
        return self._execute_workflow(workflow, payload)

    def post_receive_event_by_token(
        self,
        webhook_token: str,
        payload: dict[str, Any],
        db: Session,
    ) -> dict[str, Any]:
        workflow = self.engine.get_workflow_by_webhook_token(webhook_token, db)
        if workflow is None:
            return {"accepted": False, "detail": "Webhook token invalid."}
        if not workflow.is_active:
            return {"accepted": False, "detail": "Workflow is inactive."}
        return self._execute_workflow(workflow, payload)
