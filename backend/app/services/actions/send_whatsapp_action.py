from typing import Any

import httpx

from app.services.actions.base import ActionStrategy


class SendWhatsAppAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        provider_url = node_config.get("provider_url")
        recipient = node_config.get("to") or state_payload.get("to") or state_payload.get("phone_number")
        template = str(node_config.get("message_template", "{message}"))
        api_token = node_config.get("api_token")
        timeout = float(node_config.get("timeout_seconds", 10))
        dry_run = bool(node_config.get("dry_run", False))

        if not recipient:
            return {
                "status": "failed",
                "action": "send_whatsapp",
                "detail": "Missing recipient phone number.",
            }

        message = template.format_map({k: str(v) for k, v in state_payload.items()})
        payload = {
            "to": recipient,
            "message": message,
        }

        if dry_run:
            return {
                "status": "success",
                "action": "send_whatsapp",
                "dry_run": True,
                "request_payload": payload,
            }

        if not provider_url:
            return {
                "status": "failed",
                "action": "send_whatsapp",
                "detail": "Missing provider_url in node_config.",
            }

        headers = {"Content-Type": "application/json"}
        if api_token:
            headers["Authorization"] = f"Bearer {api_token}"

        try:
            response = httpx.post(provider_url, json=payload, headers=headers, timeout=timeout)
            body: Any
            try:
                body = response.json()
            except Exception:
                body = response.text

            return {
                "status": "success" if response.is_success else "failed",
                "action": "send_whatsapp",
                "provider_status_code": response.status_code,
                "provider_response": body,
            }
        except Exception as exc:
            return {
                "status": "failed",
                "action": "send_whatsapp",
                "detail": str(exc),
            }
