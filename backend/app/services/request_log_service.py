from uuid import UUID

from sqlalchemy.orm import Session

from app.models.request_log import RequestLog
from app.schemas.request_log_schema import RequestLogCreate


def get_all_request_logs(db: Session) -> list[RequestLog]:
    pass


def get_request_logs_by_workflow(workflow_id: UUID, db: Session) -> list[RequestLog]:
    pass


def create_request_log(payload: RequestLogCreate, db: Session) -> RequestLog:
    pass
