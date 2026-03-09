from fastapi import APIRouter, status
from app.schemas.request_schema import RequestResponse

router = APIRouter(prefix="/requests", tags=["requests"])


@router.get("/", response_model=list[RequestResponse])
def list_requests():
    # user can only see their own requests, admin can see all requests
    pass


@router.post("/", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
def create_request():
    pass


@router.put("/{request_id}/status", response_model=RequestResponse)
def update_request_status():
    pass
