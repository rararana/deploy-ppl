from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_account, get_db, require_admin
from app.models.account import Account
from app.schemas.request_schema import RequestCreate, RequestResponse, RequestUpdate
from app.services import request_service

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("/", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: RequestCreate,
    db: Session = Depends(get_db),
    current_account: Account = Depends(get_current_account),
):
    if current_account.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins cannot submit requests.")
    return request_service.create_request(payload, current_account.account_id, db)


@router.get("/", response_model=list[RequestResponse])
def list_requests(
    db: Session = Depends(get_db),
    current_account: Account = Depends(get_current_account),
):
    if current_account.role == "admin":
        return request_service.get_all_requests(db)
    return request_service.get_requests_by_account(current_account.account_id, db)


@router.patch("/{request_id}", response_model=RequestResponse)
def update_request(
    request_id: UUID,
    payload: RequestUpdate,
    db: Session = Depends(get_db),
    _: Account = Depends(require_admin),
):
    result = request_service.update_request_status(request_id, payload, db)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")
    return result
