from abc import ABC, abstractmethod
from typing import Any


class ActionStrategy(ABC):
    @abstractmethod
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError
