import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class CatalogCategory(str, Enum):
    # Category of catalog item: trigger or action
    TRIGGER = "trigger"
    ACTION = "action"


class CatalogItemType(str, Enum):
    # Type of catalog item: Event, Schedule, Webhook, or API
    EVENT = "Event"
    SCHEDULE = "Schedule"
    WEBHOOK = "Webhook"
    API = "API"

class CatalogItem(Base):
    """
    Database model for automation catalog items (triggers and actions).
    """
    __tablename__ = "catalog_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Display information
    icon_key = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # Classification
    category = Column(String(50), nullable=False)  # "trigger" or "action"
    item_type = Column(String(50), nullable=False)  # "Event", "Schedule", "Webhook", "API"
    action_key = Column(String(100), nullable=True)  # maps to backend action registry key

    # Parameter schema for frontend form rendering
    parameter_schema = Column(JSON, nullable=False, default=dict)

    # Metadata
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<CatalogItem(id={self.id}, name={self.name}, category={self.category})>"
