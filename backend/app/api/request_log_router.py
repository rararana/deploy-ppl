from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.request_log_schema import RequestLogResponse
from app.services import request_log_service

router = APIRouter(prefix="/request-logs", tags=["request-logs"])


@router.get("/", response_model=list[RequestLogResponse])
def list_request_logs(db: Session = Depends(get_db)):
    pass


@router.get("/{workflow_id}", response_model=list[RequestLogResponse])
def list_request_logs_by_workflow(workflow_id: str, db: Session = Depends(get_db)):
    pass
