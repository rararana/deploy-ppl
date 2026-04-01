from typing import Any

from app.services.actions.base import ActionStrategy


class CompressImageAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        return {
            "status": "placeholder",
            "action": "compress_image",
            "state_payload": state_payload,
            "node_config": node_config,
        }
