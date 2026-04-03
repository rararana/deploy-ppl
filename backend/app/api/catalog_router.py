# API router for automation catalog endpoints.

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.catalog_schema import CatalogItemCreate, CatalogItemResponse, CatalogItemUpdate
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("/", response_model=list[CatalogItemResponse])
def list_all_catalog_items(db: Session = Depends(get_db)):
    # Retrieve all catalog items (triggers and actions).
    items = CatalogService.get_all_items(db)
    return items


@router.get("/triggers", response_model=list[CatalogItemResponse])
def list_triggers(db: Session = Depends(get_db)):
    # Retrieve all available trigger items.
    triggers = CatalogService.get_triggers(db)
    return triggers


@router.get("/actions", response_model=list[CatalogItemResponse])
def list_actions(db: Session = Depends(get_db)):
    # Retrieve all available action items.
    actions = CatalogService.get_actions(db)
    return actions


@router.get("/{category}", response_model=list[CatalogItemResponse])
def list_by_category(category: str, db: Session = Depends(get_db)):
    # Retrieve catalog items filtered by category.
    if category not in ["trigger", "action"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category must be 'trigger' or 'action'"
        )
    items = CatalogService.get_by_category(db, category)
    return items


@router.get("/item/{item_id}", response_model=CatalogItemResponse)
def get_catalog_item(item_id: UUID, db: Session = Depends(get_db)):
    # Retrieve a specific catalog item by ID.
    item = CatalogService.get_item_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catalog item not found"
        )
    return item


@router.post("/", response_model=CatalogItemResponse, status_code=status.HTTP_201_CREATED)
def create_catalog_item(payload: CatalogItemCreate, db: Session = Depends(get_db)):
    # Create a new catalog item (trigger or action).
    item = CatalogService.create_item(db, payload)
    return item


@router.put("/{item_id}", response_model=CatalogItemResponse)
def update_catalog_item(
    item_id: UUID,
    payload: CatalogItemUpdate,
    db: Session = Depends(get_db)
):
    # Update an existing catalog item.
    item = CatalogService.update_item(db, item_id, payload)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catalog item not found"
        )
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_catalog_item(item_id: UUID, db: Session = Depends(get_db)):
    # Delete a catalog item.
    success = CatalogService.delete_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catalog item not found"
        )