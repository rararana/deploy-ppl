from uuid import UUID

from sqlalchemy.orm import Session

from app.models.execution_log import ExecutionLog
from app.schemas.execution_log_schema import ExecutionLogCreate


def get_all_execution_logs(db: Session) -> list[ExecutionLog]:
    pass


def get_execution_logs_by_workflow(workflow_id: UUID, db: Session) -> list[ExecutionLog]:
    pass


def create_execution_log(payload: ExecutionLogCreate, db: Session) -> ExecutionLog:
    pass
