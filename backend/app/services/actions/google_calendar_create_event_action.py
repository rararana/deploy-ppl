from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import quote

import httpx

from app.services.actions.base import ActionStrategy


class GoogleCalendarCreateEventAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        access_token = node_config.get("access_token")
        calendar_id = str(node_config.get("calendar_id", "primary"))
        dry_run = bool(node_config.get("dry_run", False))
        timeout = float(node_config.get("timeout_seconds", 10))

        summary = node_config.get("summary") or state_payload.get("summary") or "University Event"
        description = node_config.get("description") or state_payload.get("description")
        location = node_config.get("location") or state_payload.get("location")

        start = node_config.get("start") or state_payload.get("start")
        end = node_config.get("end") or state_payload.get("end")

        if not start:
            start = datetime.now(UTC).replace(microsecond=0).isoformat()
        if not end:
            end = (datetime.now(UTC) + timedelta(hours=1)).replace(microsecond=0).isoformat()

        event_body: dict[str, Any] = {
            "summary": summary,
            "start": {"dateTime": str(start)},
            "end": {"dateTime": str(end)},
        }
        if description:
            event_body["description"] = description
        if location:
            event_body["location"] = location

        if dry_run:
            return {
                "status": "success",
                "action": "google_calendar_create_event",
                "dry_run": True,
                "request_payload": event_body,
            }

        if not access_token:
            return {
                "status": "failed",
                "action": "google_calendar_create_event",
                "detail": "Missing access_token in node_config.",
            }

        url = f"https://www.googleapis.com/calendar/v3/calendars/{quote(calendar_id, safe='')}/events"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        try:
            response = httpx.post(url, json=event_body, headers=headers, timeout=timeout)
            body: Any
            try:
                body = response.json()
            except Exception:
                body = response.text

            if not response.is_success:
                return {
                    "status": "failed",
                    "action": "google_calendar_create_event",
                    "google_status_code": response.status_code,
                    "google_response": body,
                }

            return {
                "status": "success",
                "action": "google_calendar_create_event",
                "event_id": body.get("id"),
                "event_link": body.get("htmlLink"),
                "google_response": body,
            }
        except Exception as exc:
            return {
                "status": "failed",
                "action": "google_calendar_create_event",
                "detail": str(exc),
            }
