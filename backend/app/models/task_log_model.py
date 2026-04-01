import uuid

from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class TaskLogModel(Base):
    __tablename__ = "task_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("executions.id"), nullable=False, index=True)
    node_id = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    result_output = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)

    execution = relationship("ExecutionModel", back_populates="task_logs")