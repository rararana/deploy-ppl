from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ExecutionBase(BaseModel):
    workflow_id: UUID
    status: str = "pending"
    initial_payload: dict = Field(default_factory=dict)
    current_state: dict = Field(default_factory=dict)


class ExecutionCreate(ExecutionBase):
    pass


class ExecutionResponse(ExecutionBase):
    id: UUID
    started_at: datetime
    finished_at: datetime | None = None

    model_config = {"from_attributes": True}
