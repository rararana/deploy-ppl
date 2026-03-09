from uuid import UUID

from pydantic import BaseModel


class ExecutionBase(BaseModel):
    n8n_execution_id: str | None = None
    execution_status: str = "unknown"
    error_message: str | None = None


class ExecutionCreate(ExecutionBase):
    workflow_id: UUID


class ExecutionResponse(ExecutionBase):
    execution_id: UUID
    workflow_id: UUID

    model_config = {"from_attributes": True}
