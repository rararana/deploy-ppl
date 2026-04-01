from collections import deque
from typing import Any


class MessageBroker:
    """In-memory placeholder broker. Replace with Redis/RabbitMQ later."""

    def __init__(self) -> None:
        self._queue: deque[dict[str, Any]] = deque()

    def enqueue_task(self, node_data: dict[str, Any], state_payload: dict[str, Any]) -> dict[str, Any]:
        task = {
            "node_data": node_data,
            "state_payload": state_payload,
            "attempt": 0,
        }
        self._queue.append(task)
        return task

    def retry_task(self, task: dict[str, Any], attempt_count: int) -> dict[str, Any]:
        task["attempt"] = attempt_count
        self._queue.append(task)
        return task

    def pop_task(self) -> dict[str, Any] | None:
        if not self._queue:
            return None
        return self._queue.popleft()
