from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from app.models.request import Request
from app.schemas.request_schema import RequestCreate, RequestUpdate


def create_request(payload: RequestCreate, account_id: UUID, db: Session) -> Request:
    request = Request(
        account_id=account_id,
        type=payload.type,
        title=payload.title,
        description=payload.description,
        status="pending",
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return (
        db.query(Request)
        .options(joinedload(Request.account))
        .filter(Request.id == request.id)
        .first()
    )


def get_requests_by_account(account_id: UUID, db: Session) -> list[Request]:
    return (
        db.query(Request)
        .options(joinedload(Request.account))
        .filter(Request.account_id == account_id)
        .order_by(Request.created_at.desc())
        .all()
    )


def get_all_requests(db: Session) -> list[Request]:
    return (
        db.query(Request)
        .options(joinedload(Request.account))
        .order_by(Request.created_at.desc())
        .all()
    )


def update_request_status(request_id: UUID, payload: RequestUpdate, db: Session) -> Request | None:
    request = (
        db.query(Request)
        .options(joinedload(Request.account))
        .filter(Request.id == request_id)
        .first()
    )
    if not request:
        return None
    request.status = payload.status
    request.admin_note = payload.admin_note
    db.commit()
    db.refresh(request)
    return request
