from typing import Any

# import httpx

from app.core.config import settings


class N8nIntegrationService:
    # http client for n8n REST API, using httpx or similar library

    def __init__(self) -> None:
        self._base_url = settings.N8N_BASE_URL.rstrip("/")
        self._headers = {
            "X-N8N-API-KEY": settings.N8N_API_KEY,
            "Content-Type": "application/json",
        }

# worfklow management
    async def get_workflow(self, n8n_workflow_id: str) -> dict[str, Any]:
        pass

    async def activate_workflow(self, n8n_workflow_id: str) -> dict[str, Any]:
        pass

    async def deactivate_workflow(self, n8n_workflow_id: str) -> dict[str, Any]:
        pass


# webhook trigger
    async def trigger_webhook(self, webhook_path: str, payload: dict[str, Any]) -> dict[str, Any]:
        # send data to n8n webhook endpoint
        pass


n8n_service = N8nIntegrationService()
