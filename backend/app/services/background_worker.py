from typing import Any


class BackgroundWorker:
    """Placeholder worker implementation for async node execution."""

    def consume_queue(self) -> dict[str, Any]:
        return {"message": "Worker placeholder running."}

    def update_execution_status(self, execution_id: str, status: str) -> dict[str, Any]:
        return {
            "execution_id": execution_id,
            "status": status,
        }

    def log_task_result(self, execution_id: str, node_id: str, result: dict[str, Any]) -> dict[str, Any]:
        return {
            "execution_id": execution_id,
            "node_id": node_id,
            "result": result,
        }
