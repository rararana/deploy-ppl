from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.workflow import Workflow
from app.schemas.workflow_schema import WorkflowCreate, WorkflowUpdate


def get_workflows(account_id: UUID, db: Session) -> list[Workflow]:
    return db.query(Workflow).filter(Workflow.account_id == account_id).all()


def get_workflow(workflow_id: UUID, account_id: UUID, db: Session) -> Workflow:
    workflow = (
        db.query(Workflow)
        .filter(Workflow.workflow_id == workflow_id, Workflow.account_id == account_id)
        .first()
    )
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found.")
    return workflow


def create_workflow(payload: WorkflowCreate, account_id: UUID, db: Session) -> Workflow:
    workflow = Workflow(**payload.model_dump(), account_id=account_id)
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


def update_workflow(workflow_id: UUID, payload: WorkflowUpdate, account_id: UUID, db: Session) -> Workflow:
    workflow = get_workflow(workflow_id, account_id, db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(workflow, key, value)
    db.commit()
    db.refresh(workflow)
    return workflow


def delete_workflow(workflow_id: UUID, account_id: UUID, db: Session) -> None:
    workflow = get_workflow(workflow_id, account_id, db)
    db.delete(workflow)
    db.commit()
