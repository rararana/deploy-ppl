from typing import Any

from app.services.actions.base import ActionStrategy


class SendWhatsAppAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        return {
            "status": "placeholder",
            "action": "send_whatsapp",
            "state_payload": state_payload,
            "node_config": node_config,
        }
