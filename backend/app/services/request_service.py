from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.request import Request
from app.schemas.request_schema import RequestCreate, RequestStatusUpdate


def get_all_requests(db: Session) -> list[Request]:
    return db.query(Request).all()


def get_user_requests(account_id: UUID, db: Session) -> list[Request]:
    return db.query(Request).filter(Request.account_id == account_id).all()


def create_request(payload: RequestCreate, account_id: UUID, db: Session) -> Request:
    req = Request(**payload.model_dump(), account_id=account_id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


def update_request_status(
    request_id: UUID, payload: RequestStatusUpdate, db: Session
) -> Request:
    # approve/reject
    req = db.query(Request).filter(Request.request_id == request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")
    req.request_status = payload.request_status
    db.commit()
    db.refresh(req)
    return req
