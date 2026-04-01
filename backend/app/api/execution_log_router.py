from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.execution_log_schema import ExecutionLogResponse
from app.services import execution_log_service

router = APIRouter(prefix="/execution-logs", tags=["execution-logs"])


@router.get("/", response_model=list[ExecutionLogResponse])
def list_execution_logs(db: Session = Depends(get_db)):
    pass


@router.get("/{workflow_id}", response_model=list[ExecutionLogResponse])
def list_execution_logs_by_workflow(workflow_id: str, db: Session = Depends(get_db)):
    pass
