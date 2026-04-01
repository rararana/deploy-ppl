from uuid import UUID

from pydantic import BaseModel


class ExecutionLogBase(BaseModel):
    workflow_id: UUID
    status: str
    details: str | None = None


class ExecutionLogCreate(ExecutionLogBase):
    pass


class ExecutionLogResponse(ExecutionLogBase):
    id: UUID

    model_config = {"from_attributes": True}
