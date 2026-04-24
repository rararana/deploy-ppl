import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    webhook_token = Column(String(255), nullable=False, unique=True, default=lambda: uuid.uuid4().hex)
    workflow_schema = Column(JSON, nullable=False, default=dict)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    execution_logs = relationship("ExecutionLog", back_populates="workflow", cascade="all, delete-orphan")
    executions = relationship("ExecutionModel", back_populates="workflow", cascade="all, delete-orphan")

    @staticmethod
    def generate_unique_webhook() -> str:
        return uuid.uuid4().hex
