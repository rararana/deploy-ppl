from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel


class AccountBrief(BaseModel):
    full_name: str
    email: str

    model_config = {"from_attributes": True}


class RequestCreate(BaseModel):
    type: Literal["trigger", "action"]
    title: str
    description: str


class RequestUpdate(BaseModel):
    status: Literal["approved", "rejected"]
    admin_note: Optional[str] = None


class RequestResponse(BaseModel):
    id: UUID
    account_id: UUID
    type: str
    title: str
    description: str
    status: str
    admin_note: Optional[str]
    created_at: datetime
    account: Optional[AccountBrief] = None

    model_config = {"from_attributes": True}
