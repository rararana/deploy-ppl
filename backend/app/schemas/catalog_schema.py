from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CatalogItemBase(BaseModel):
    icon_key: str = Field(..., description="Icon identifier from frontend icons")
    name: str = Field(..., description="Display name of the trigger/action")
    description: str = Field(..., description="Description of what this trigger/action does")
    category: str = Field(..., description="Category: 'trigger' or 'action'")
    item_type: str = Field(..., description="Type: 'Event', 'Schedule', 'Webhook', or 'API'")
    action_key: str | None = Field(None, description="Backend action registry key, e.g. 'send_whatsapp'")
    parameter_schema: dict = Field(default_factory=dict, description="Form field definitions for frontend rendering")


class CatalogItemCreate(CatalogItemBase):
    pass


class CatalogItemUpdate(BaseModel):
    icon_key: str | None = None
    name: str | None = None
    description: str | None = None
    category: str | None = None
    item_type: str | None = None
    action_key: str | None = None
    parameter_schema: dict | None = None


class CatalogItemResponse(CatalogItemBase):
    id: UUID = Field(..., description="Unique identifier of the catalog item")
    created_at: datetime = Field(..., description="Timestamp when item was created")

    model_config = {"from_attributes": True}