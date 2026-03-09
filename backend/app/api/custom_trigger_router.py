from typing import Any
from fastapi import APIRouter, Depends
from app.api.deps import get_current_account
from app.models.account import Account
from app.services.scrapers.six_itb_scraper import scrape_six_itb

router = APIRouter(prefix="/triggers", tags=["triggers"])


@router.post("/six-itb")
async def trigger_six_itb(
    _: Account = Depends(get_current_account),
) -> dict[str, Any]:
    # n8n cron job call this and run the scrapper
    data = await scrape_six_itb()
    return {"records": data}
