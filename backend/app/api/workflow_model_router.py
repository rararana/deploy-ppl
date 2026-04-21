from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.workflow_model_schema import WorkflowCreate, WorkflowResponse, WorkflowUpdate
from app.services import workflow_model_service

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/", response_model=list[WorkflowResponse])
def list_workflows(db: Session = Depends(get_db)):
    return workflow_model_service.get_workflows(db)


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
def create_workflow(payload: WorkflowCreate, db: Session = Depends(get_db)):
    return workflow_model_service.create_workflow(payload, db)


@router.put("/{workflow_id}", response_model=WorkflowResponse)
def update_workflow(workflow_id: str, payload: WorkflowUpdate, db: Session = Depends(get_db)):
    from uuid import UUID
    return workflow_model_service.update_workflow(UUID(workflow_id), payload, db)


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow(workflow_id: str, db: Session = Depends(get_db)):
    from uuid import UUID
    workflow_model_service.delete_workflow(UUID(workflow_id), db)