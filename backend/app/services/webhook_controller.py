from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from app.services.message_broker import MessageBroker
from app.services.workflow_engine import WorkflowEngine

# placeholder for the actual implementation of the WebhookController, which will handle incoming webhook events and trigger workflow executions accordingly.
class WebhookController:

    def __init__(self) -> None:
        self.engine = WorkflowEngine()
        self.broker = MessageBroker()

    def post_receive_event(
        self,
        workflow_id: UUID,
        payload: dict[str, Any],
        db: Session,
    ) -> dict[str, Any]:
        workflow = self.engine.get_workflow(workflow_id, db)
        if workflow is None:
            return {"accepted": False, "detail": "Workflow not found."}

        parsed = self.engine.parse_schema(workflow.workflow_schema or {})
        execution_context = self.engine.initiate_execution(workflow, payload)
        first_node = self.engine.find_next_node(parsed, current_node_id=None)

        if first_node is not None:
            self.broker.enqueue_task(first_node, execution_context)

        return {
            "accepted": True,
            "workflow_id": str(workflow_id),
            "queued": first_node is not None,
            "execution": execution_context,
        }
