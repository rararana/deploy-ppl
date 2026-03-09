from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_router import router as auth_router
from app.api.custom_trigger_router import router as custom_trigger_router
from app.api.request_router import router as request_router
from app.api.webhook_router import router as webhook_router
from app.api.workflow_router import router as workflow_router
from app.core.config import settings

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
app.include_router(workflow_router)
app.include_router(request_router)
app.include_router(webhook_router)
app.include_router(custom_trigger_router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
