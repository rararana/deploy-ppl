from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CatalogItemBase(BaseModel):
    icon_key: str = Field(..., description="Icon identifier from frontend icons")
    name: str = Field(..., description="Display name of the trigger/action")
    description: str = Field(..., description="Description of what this trigger/action does")
    category: str = Field(..., description="Category: 'trigger' or 'action'")
    item_type: str = Field(..., description="Type: 'Event', 'Schedule', 'Webhook', or 'API'")


class CatalogItemCreate(CatalogItemBase):
    pass


class CatalogItemUpdate(BaseModel):
    # Schema for updating catalog item fields
    icon_key: str | None = None
    name: str | None = None
    description: str | None = None
    category: str | None = None
    item_type: str | None = None


class CatalogItemResponse(CatalogItemBase):
    # Schema for catalog item API responses
    id: UUID = Field(..., description="Unique identifier of the catalog item")
    created_at: datetime = Field(..., description="Timestamp when item was created")

    model_config = {"from_attributes": True}