import base64
import io
from pathlib import Path
from typing import Any

from PIL import Image

from app.services.actions.base import ActionStrategy


class CompressImageAction(ActionStrategy):
    def execute(self, state_payload: dict[str, Any], node_config: dict[str, Any]) -> dict[str, Any]:
        image_base64 = state_payload.get("image_base64")
        image_path = state_payload.get("image_path")

        if not image_base64 and not image_path:
            return {
                "status": "failed",
                "action": "compress_image",
                "detail": "Missing image input. Provide image_base64 or image_path.",
            }

        output_format = str(node_config.get("output_format", "JPEG")).upper()
        quality = int(node_config.get("quality", 70))
        optimize = bool(node_config.get("optimize", True))
        output_path = node_config.get("output_path")

        try:
            if image_base64:
                raw_bytes = base64.b64decode(image_base64)
            else:
                raw_bytes = Path(str(image_path)).read_bytes()

            input_stream = io.BytesIO(raw_bytes)
            image = Image.open(input_stream)

            if output_format == "JPEG" and image.mode in {"RGBA", "LA", "P"}:
                image = image.convert("RGB")

            output_stream = io.BytesIO()
            save_kwargs: dict[str, Any] = {"format": output_format, "optimize": optimize}
            if output_format in {"JPEG", "WEBP"}:
                save_kwargs["quality"] = max(1, min(95, quality))

            image.save(output_stream, **save_kwargs)
            compressed = output_stream.getvalue()

            result: dict[str, Any] = {
                "status": "success",
                "action": "compress_image",
                "compressed_image_base64": base64.b64encode(compressed).decode("utf-8"),
                "meta": {
                    "original_size": len(raw_bytes),
                    "compressed_size": len(compressed),
                    "output_format": output_format,
                },
            }

            if output_path:
                Path(str(output_path)).write_bytes(compressed)
                result["output_path"] = str(output_path)

            return result
        except Exception as exc:
            return {
                "status": "failed",
                "action": "compress_image",
                "detail": str(exc),
            }
