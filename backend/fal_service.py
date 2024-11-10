import os
import base64
import requests
from typing import Dict, Any

FAL_KEY = os.getenv("FAL_KEY")
FAL_SECRET = os.getenv("FAL_SECRET")

async def train_model(image_content: bytes) -> Dict[str, Any]:
    # Convert bytes to base64
    base64_image = base64.b64encode(image_content).decode('utf-8')
    base64_url = f"data:image/jpeg;base64,{base64_image}"
    
    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "input": {
            "image_url": base64_url,
            "num_steps": 100,
            "seed": 42
        }
    }
    
    response = requests.post(
        "https://fal.ai/api/models/fal-ai/flux-lora-fast-training",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        raise Exception(f"FAL API error: {response.text}")
    
    return response.json()

async def generate_thumbnail(model_id: str) -> Dict[str, Any]:
    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "input": {
            "model_id": model_id,
            "prompt": "Generate a thumbnail version of the trained image",
            "num_inference_steps": 30,
            "seed": 42
        }
    }
    
    response = requests.post(
        "https://fal.ai/api/models/fal-ai/flux-lora-fast-training",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        raise Exception(f"FAL API error: {response.text}")
    
    return response.json()