from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.workflow_model import Workflow
from app.schemas.workflow_model_schema import WorkflowCreate, WorkflowUpdate


def get_workflows(db: Session) -> list[Workflow]:
    return db.query(Workflow).order_by(Workflow.created_at.desc()).all()


def get_workflow(workflow_id: UUID, db: Session) -> Workflow:
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found.")
    return workflow


def create_workflow(payload: WorkflowCreate, db: Session) -> Workflow:
    webhook_token = payload.webhook_token or Workflow.generate_unique_webhook()
    workflow = Workflow(
        name=payload.name,
        description=payload.description,
        is_active=payload.is_active,
        workflow_schema=payload.workflow_schema,
        webhook_token=webhook_token,
    )
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


def update_workflow(workflow_id: UUID, payload: WorkflowUpdate, db: Session) -> Workflow:
    workflow = get_workflow(workflow_id, db)
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(workflow, key, value)

    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


def delete_workflow(workflow_id: UUID, db: Session) -> None:
    workflow = get_workflow(workflow_id, db)
    db.delete(workflow)
    db.commit()
