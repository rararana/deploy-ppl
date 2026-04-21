from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_router import router as auth_router
from app.api.catalog_router import router as catalog_router
from app.api.request_log_router import router as request_log_router
from app.api.workflow_model_router import router as workflow_model_router
from app.api.execution_log_router import router as execution_log_router
from app.api.webhook_router import router as webhook_router
from app.core.config import settings
from app.core.database import SessionLocal
from app.services.account_seed import seed_accounts
from app.services.catalog_seed import seed_catalog_items
from app.services.workflow_seed import seed_workflows

app = FastAPI(
    title=settings.APP_NAME,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(catalog_router)
app.include_router(workflow_model_router)
app.include_router(request_log_router)
app.include_router(execution_log_router)
app.include_router(webhook_router)


@app.on_event("startup")
def startup_event():
    # Initialize catalog data on application startup.
    db = SessionLocal()
    try:
        seed_accounts(db)
        seed_catalog_items(db)
        seed_workflows(db)
    except Exception as e:
        print(f"Error during seeding: {e}")
    finally:
        db.close()

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
