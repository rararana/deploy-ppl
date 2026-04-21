"""
Data seeding script for workflows.
Populates the database with example workflows.
"""
from sqlalchemy.orm import Session
from app.models.workflow_model import Workflow


DUMMY_WORKFLOWS = [
    {
        "name": "Student Registration Workflow",
        "description": "Automate student registration process with email notifications and payment verification.",
        "is_active": True,
        "workflow_schema": {
            "steps": [
                {"type": "trigger", "name": "Form Submission"},
                {"type": "action", "name": "Verify Payment"},
                {"type": "action", "name": "Send Confirmation Email"},
            ]
        },
    },
    {
        "name": "Class Schedule Update",
        "description": "Notify students and instructors when class schedule changes with automatic email.",
        "is_active": True,
        "workflow_schema": {
            "steps": [
                {"type": "trigger", "name": "Schedule Change"},
                {"type": "action", "name": "Update Database"},
                {"type": "action", "name": "Send WhatsApp Notification"},
                {"type": "action", "name": "Generate PDF Notice"},
            ]
        },
    },
    {
        "name": "Grade Release Automation",
        "description": "Automatically notify students when grades are released and generate report cards.",
        "is_active": True,
        "workflow_schema": {
            "steps": [
                {"type": "trigger", "name": "Grade Upload"},
                {"type": "action", "name": "Validate Grades"},
                {"type": "action", "name": "Send Email Notification"},
                {"type": "action", "name": "Generate Transcript"},
            ]
        },
    },
    {
        "name": "Tuition Payment Reminder",
        "description": "Send automated payment reminders to students with pending UKT (tuition) payments.",
        "is_active": True,
        "workflow_schema": {
            "steps": [
                {"type": "trigger", "name": "Daily Check"},
                {"type": "action", "name": "Query Pending Payments"},
                {"type": "action", "name": "Send SMS Reminder"},
                {"type": "action", "name": "Send Email Reminder"},
            ]
        },
    },
    {
        "name": "Attendance Verification",
        "description": "Process attendance data and generate monthly attendance reports for verification.",
        "is_active": False,
        "workflow_schema": {
            "steps": [
                {"type": "trigger", "name": "Month End"},
                {"type": "action", "name": "Calculate Attendance"},
                {"type": "action", "name": "Generate Report"},
                {"type": "action", "name": "Send to Admin"},
            ]
        },
    },
]


def seed_workflows(db: Session) -> None:
    """
    Seed the database with dummy workflows if they don't exist.
    
    Args:
        db: Database session
    """
    existing_names = {name for (name,) in db.query(Workflow.name).all()}
    inserted_count = 0

    for workflow_data in DUMMY_WORKFLOWS:
        if workflow_data["name"] in existing_names:
            continue

        workflow = Workflow(
            name=workflow_data["name"],
            description=workflow_data["description"],
            is_active=workflow_data["is_active"],
            workflow_schema=workflow_data["workflow_schema"],
            webhook_token=Workflow.generate_unique_webhook(),
        )
        db.add(workflow)
        inserted_count += 1

    if inserted_count > 0:
        db.commit()

    skipped_count = len(DUMMY_WORKFLOWS) - inserted_count
    print(f"Workflow seeding complete: inserted {inserted_count}, skipped {skipped_count}")
