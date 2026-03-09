import uuid

from sqlalchemy import Column, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Request(Base):
    __tablename__ = "requests"

    request_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.account_id"), nullable=False)
    request_type = Column(Enum("trigger", "approval", "other", name="request_type"), nullable=False)
    request_detail = Column(Text, nullable=True)
    request_status = Column(
        Enum("pending", "approved", "rejected", name="request_status"),
        nullable=False,
        default="pending",
    )

    account = relationship("Account", back_populates="requests")
