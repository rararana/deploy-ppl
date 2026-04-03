# Service layer for catalog item management.
# Handles business logic for retrieving and managing automation triggers and actions.

from uuid import UUID

from sqlalchemy.orm import Session

from app.models.catalog_model import CatalogItem
from app.schemas.catalog_schema import CatalogItemCreate, CatalogItemUpdate


class CatalogService:
    # Service class for catalog item operations

    @staticmethod
    def get_all_items(db: Session) -> list[CatalogItem]:
        # Retrieve all catalog items from the database.
        
        return db.query(CatalogItem).all()

    @staticmethod
    def get_triggers(db: Session) -> list[CatalogItem]:
        # Retrieve all trigger items from the catalog.
        return db.query(CatalogItem).filter(CatalogItem.category == "trigger").all()

    @staticmethod
    def get_actions(db: Session) -> list[CatalogItem]:
        # Retrieve all action items from the catalog.
        return db.query(CatalogItem).filter(CatalogItem.category == "action").all()

    @staticmethod
    def get_by_category(db: Session, category: str) -> list[CatalogItem]:
        # Retrieve catalog items filtered by category.
        return db.query(CatalogItem).filter(CatalogItem.category == category).all()

    @staticmethod
    def get_item_by_id(db: Session, item_id: UUID) -> CatalogItem | None:
        # Retrieve a specific catalog item by ID.
        return db.query(CatalogItem).filter(CatalogItem.id == item_id).first()

    @staticmethod
    def create_item(db: Session, payload: CatalogItemCreate) -> CatalogItem:
        # Create a new catalog item.
        item = CatalogItem(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def update_item(db: Session, item_id: UUID, payload: CatalogItemUpdate) -> CatalogItem | None:
        # Update an existing catalog item.
        
        item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()
        if not item:
            return None
        
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)
        
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete_item(db: Session, item_id: UUID) -> bool:
        # Delete a catalog item.
        item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()
        if not item:
            return False
        
        db.delete(item)
        db.commit()
        return True
