from typing import Any

from app.services.actions.base import ActionStrategy


class WebhookCallbackAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        return {
            "status": "placeholder",
            "action": "webhook_callback",
            "state_payload": state_payload,
            "node_config": node_config,
        }
