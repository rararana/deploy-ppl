from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class WorkflowBase(BaseModel):
    name: str
    description: str | None = None
    workflow_schema: dict = Field(default_factory=dict)
    is_active: bool = True


class WorkflowCreate(WorkflowBase):
    webhook_token: str | None = None


class WorkflowUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    workflow_schema: dict | None = None
    is_active: bool | None = None


class WorkflowResponse(WorkflowBase):
    id: UUID
    webhook_token: str
    created_at: datetime

    model_config = {"from_attributes": True}
