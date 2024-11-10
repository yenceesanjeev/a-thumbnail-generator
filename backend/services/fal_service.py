import fal
import base64
from typing import Dict, Any
from ..config import FAL_KEY

fal.config({
    'credentials': FAL_KEY
})

def on_queue_update(update):
    if isinstance(update, fal.InProgress):
        for log in update.logs:
            print(log["message"])

async def create_style(image_content: bytes) -> Dict[str, Any]:
    base64_image = base64.b64encode(image_content).decode('utf-8')
    base64_url = f"data:image/jpeg;base64,{base64_image}"
    
    result = fal.subscribe(
        "fal-ai/recraft-v3/create-style",
        arguments={
            "images_data_url": base64_url
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )
    
    return {
        "style_id": result["request_id"],
        "preview_url": result["images"][0]["url"]
    }

async def generate_image(prompt: str, style_id: str) -> Dict[str, Any]:
    result = fal.subscribe(
        "fal-ai/recraft-v3",
        arguments={
            "prompt": prompt,
            "style_id": style_id
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )
    
    return {
        "id": result["request_id"],
        "image_url": result["images"][0]["url"],
        "generated_at": result.get("created_at", "")
    }