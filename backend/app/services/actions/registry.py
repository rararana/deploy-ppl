from app.services.actions.base import ActionStrategy
from app.services.actions.compress_image_action import CompressImageAction
from app.services.actions.google_calendar_create_event_action import GoogleCalendarCreateEventAction
from app.services.actions.send_whatsapp_action import SendWhatsAppAction
from app.services.actions.webhook_callback_action import WebhookCallbackAction


_ACTION_REGISTRY: dict[str, type[ActionStrategy]] = {
    "compress_image": CompressImageAction,
    "send_whatsapp": SendWhatsAppAction,
    "webhook_callback": WebhookCallbackAction,
    "google_calendar_create_event": GoogleCalendarCreateEventAction,
}


def get_action_strategy(action_type: str) -> ActionStrategy | None:
    strategy_cls = _ACTION_REGISTRY.get(action_type)
    if strategy_cls is None:
        return None
    return strategy_cls()


def get_supported_actions() -> list[str]:
    return sorted(_ACTION_REGISTRY.keys())
