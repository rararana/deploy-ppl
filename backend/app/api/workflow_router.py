from fastapi import APIRouter, status
from app.schemas.workflow_schema import WorkflowResponse

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/", response_model=list[WorkflowResponse])
def list_workflows():
    pass

@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
def create_workflow():
    pass

@router.put("/{workflow_id}", response_model=WorkflowResponse)
def update_workflow():
    pass

@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow():
    pass