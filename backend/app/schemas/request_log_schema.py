from uuid import UUID

from pydantic import BaseModel


class RequestLogBase(BaseModel):
    workflow_id: UUID
    status: str
    details: str | None = None


class RequestLogCreate(RequestLogBase):
    pass


class RequestLogResponse(RequestLogBase):
    id: UUID

    model_config = {"from_attributes": True}
