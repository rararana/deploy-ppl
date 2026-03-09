from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.execution_history import ExecutionHistory
from app.schemas.execution_schema import ExecutionCreate

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/n8n-log", status_code=200)
async def receive_n8n_log(payload: ExecutionCreate, db: Session = Depends(get_db)) -> dict[str, Any]:
    # post execution log from n8n
    execution = ExecutionHistory(
        workflow_id=payload.workflow_id,
        n8n_execution_id=payload.n8n_execution_id,
        execution_status=payload.execution_status,
        error_message=payload.error_message,
    )
    db.add(execution)
    db.commit()
    return {"status": "logged"}
