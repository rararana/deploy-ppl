from uuid import UUID

from pydantic import BaseModel


class RequestBase(BaseModel):
    request_type: str
    request_detail: str | None = None


class RequestCreate(RequestBase):
    pass


class RequestStatusUpdate(BaseModel):
    request_status: str  # "approved" | "rejected"


class RequestResponse(RequestBase):
    request_id: UUID
    account_id: UUID
    request_status: str

    model_config = {"from_attributes": True}
