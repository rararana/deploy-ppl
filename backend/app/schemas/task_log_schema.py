from uuid import UUID

from pydantic import BaseModel


class TaskLogBase(BaseModel):
    execution_id: UUID
    node_id: str
    status: str
    result_output: str | None = None
    error_message: str | None = None


class TaskLogCreate(TaskLogBase):
    pass


class TaskLogResponse(TaskLogBase):
    id: UUID

    model_config = {"from_attributes": True}
