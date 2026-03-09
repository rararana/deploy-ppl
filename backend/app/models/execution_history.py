import uuid

from sqlalchemy import Column, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class ExecutionHistory(Base):
    __tablename__ = "execution_history"

    execution_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.workflow_id"), nullable=False)
    n8n_execution_id = Column(String(255), nullable=True)
    execution_status = Column(
        Enum("running", "success", "error", "unknown", name="execution_status"),
        nullable=False,
        default="unknown",
    )
    error_message = Column(Text, nullable=True)

    workflow = relationship("Workflow", back_populates="executions")
