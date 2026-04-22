from typing import Any

import httpx

from app.services.actions.base import ActionStrategy


class WebhookCallbackAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        callback_url = node_config.get("callback_url")
        method = str(node_config.get("method", "POST")).upper()
        timeout = float(node_config.get("timeout_seconds", 10))
        dry_run = bool(node_config.get("dry_run", False))

        payload = node_config.get("payload", {})
        include_state = bool(node_config.get("include_state_payload", True))
        if include_state:
            payload = {**payload, **state_payload}

        if dry_run:
            return {
                "status": "success",
                "action": "webhook_callback",
                "dry_run": True,
                "request_payload": payload,
            }

        if not callback_url:
            return {
                "status": "failed",
                "action": "webhook_callback",
                "detail": "Missing callback_url in node_config.",
            }

        headers = {"Content-Type": "application/json", **node_config.get("headers", {})}

        try:
            response = httpx.request(
                method=method,
                url=callback_url,
                json=payload,
                headers=headers,
                timeout=timeout,
            )
            body: Any
            try:
                body = response.json()
            except Exception:
                body = response.text

            return {
                "status": "success" if response.is_success else "failed",
                "action": "webhook_callback",
                "callback_status_code": response.status_code,
                "callback_response": body,
            }
        except Exception as exc:
            return {
                "status": "failed",
                "action": "webhook_callback",
                "detail": str(exc),
            }
