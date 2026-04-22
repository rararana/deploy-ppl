from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.webhook_controller import WebhookController

router = APIRouter(prefix="/webhook", tags=["webhook"])
controller = WebhookController()


@router.post("/trigger/{webhook_token}")
async def webhook_by_token(webhook_token: str, request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    return controller.post_receive_event_by_token(webhook_token, payload, db)


@router.post("/{workflow_id}")
async def webhook_by_workflow_id(workflow_id: UUID, request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    return controller.post_receive_event(workflow_id, payload, db)
