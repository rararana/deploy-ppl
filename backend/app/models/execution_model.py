import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class ExecutionModel(Base):
    __tablename__ = "executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=True, index=True)
    status = Column(String, nullable=False, default="pending")
    initial_payload = Column(JSON, nullable=True)
    current_state = Column(JSON, nullable=True)
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    error_details = Column(String, nullable=True)

    workflow = relationship("Workflow", back_populates="executions")
    task_logs = relationship("TaskLogModel", back_populates="execution", cascade="all, delete-orphan")