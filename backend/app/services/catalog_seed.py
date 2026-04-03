"""
Data seeding script for catalog items.
Populates the database with default triggers and actions.
"""
from sqlalchemy.orm import Session
from app.models.catalog_model import CatalogItem
from app.schemas.catalog_schema import CatalogItemCreate
from app.services.catalog_service import CatalogService

# @rana ini atur-atur aja yaa tergantung fungsionalitas
DEFAULT_TRIGGERS = [
    CatalogItemCreate(
        icon_key="zap",
        name="On Form Submit",
        description="Fires when a user submits a workflow form.",
        category="trigger",
        item_type="Event"
    ),
    CatalogItemCreate(
        icon_key="clock",
        name="Scheduled Run",
        description="Trigger at fixed intervals or cron expression.",
        category="trigger",
        item_type="Schedule"
    ),

    CatalogItemCreate(
        icon_key="link",
        name="Webhook Received",
        description="Listens for an inbound HTTP POST to your endpoint.",
        category="trigger",
        item_type="Webhook"
    ),

    CatalogItemCreate(
        icon_key="filePlus",
        name="On Request Created",
        description="Activates when a new request entry is submitted.",
        category="trigger",
        item_type="Event"
    ),

    CatalogItemCreate(
        icon_key="checkCircle",
        name="On Approval",
        description="Runs after a request receives an approval sign-off.",
        category="trigger",
        item_type="Event"
    ),
    CatalogItemCreate(
        icon_key="xCircle",
        name="On Rejection",
        description="Triggered when an approver rejects a submission.",
        category="trigger",
        item_type="Event"
    ),

    CatalogItemCreate(
        icon_key="bell",
        name="Status Change",
        description="Watches for any status transition on a record.",
        category="trigger",
        item_type="Schedule"
    ),

    CatalogItemCreate(
        icon_key="radio",
        name="API Event",
        description="Subscribes to external API events via polling.",
        category="trigger",
        item_type="API"
    ),

    CatalogItemCreate(
        icon_key="upload",
        name="On File Upload",
        description="Triggers when an attachment is added to a request.",
        category="trigger",
        item_type="Event"
    ),
]

DEFAULT_ACTIONS = [

    CatalogItemCreate(
        icon_key="mail",
        name="Send Email",
        description="Dispatch a templated email to one or more recipients.",
        category="action",
        item_type="API"
    ),

    CatalogItemCreate(
        icon_key="msg",
        name="Post to Slack",
        description="Send a message to a Slack channel or direct message.",
        category="action",
        item_type="Webhook"
    ),

    CatalogItemCreate(
        icon_key="edit",
        name="Update Record",
        description="Modify fields on an existing request or entry.",
        category="action",
        item_type="Event"
    ),

    CatalogItemCreate(
        icon_key="lock",
        name="Lock Workflow",
        description="Prevent further edits on a completed workflow.",
        category="action",
        item_type="Event"
    ),

    CatalogItemCreate(
        icon_key="chart",
        name="Generate Report",
        description="Create and store a PDF summary of workflow data.",
        category="action",
        item_type="API"
    ),

    CatalogItemCreate(
        icon_key="refresh",
        name="Retry Action",
        description="Re-run a failed step with exponential backoff.",
        category="action",
        item_type="Schedule"
    ),

    CatalogItemCreate(
        icon_key="userCheck",
        name="Assign User",
        description="Route a task to a specific team member.",
        category="action",
        item_type="Event"
    ),

    CatalogItemCreate(
        icon_key="globe",
        name="HTTP Request",
        description="Call any external REST endpoint with custom headers.",
        category="action",
        item_type="Webhook"
    ),

    CatalogItemCreate(
        icon_key="bellPlus",
        name="Create Notification",
        description="Push an in-app alert to the target user.",
        category="action",
        item_type="API"
    ),
]

def seed_catalog_items(db: Session) -> None:
    # Seed the database with default catalog items (triggers and actions).
    # Only inserts data if the catalog is empty.

    # Check if catalog already has items
    existing_count = db.query(CatalogItem).count()
    if existing_count > 0:
        print(f"Catalog already has {existing_count} items. Skipping seed.")
        return
    
    # Create all default triggers
    for trigger_data in DEFAULT_TRIGGERS:
        CatalogService.create_item(db, trigger_data)
    
    # Create all default actions
    for action_data in DEFAULT_ACTIONS:
        CatalogService.create_item(db, action_data)
    
    total_items = len(DEFAULT_TRIGGERS) + len(DEFAULT_ACTIONS)
    print(f"Successfully seeded {total_items} catalog items ({len(DEFAULT_TRIGGERS)} triggers, {len(DEFAULT_ACTIONS)} actions)")
