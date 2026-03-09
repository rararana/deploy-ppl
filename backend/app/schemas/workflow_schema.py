from uuid import UUID

from pydantic import BaseModel


class WorkflowBase(BaseModel):
    workflow_name: str
    description: str | None = None
    n8n_workflow_id: str | None = None
    is_active: bool = True


class WorkflowCreate(WorkflowBase):
    pass


class WorkflowUpdate(BaseModel):
    workflow_name: str | None = None
    description: str | None = None
    n8n_workflow_id: str | None = None
    is_active: bool | None = None


class WorkflowResponse(WorkflowBase):
    workflow_id: UUID
    account_id: UUID

    model_config = {"from_attributes": True}
