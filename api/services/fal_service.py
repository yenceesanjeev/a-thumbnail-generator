import os
import base64
import httpx
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.getenv("FAL_KEY")

if not FAL_KEY:
    raise ValueError("FAL_KEY must be set in .env file")

async def train_model(files: List[Dict[str, bytes]]) -> Dict[str, Any]:
    if not files:
        raise ValueError("No files provided")
        
    # Use the first image to create the style
    content = files[0]["content"]
    base64_image = base64.b64encode(content).decode('utf-8')
    
    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        # Create style
        create_style_response = await client.post(
            "https://fal.ai/api/models/fal-ai/recraft-v3/create-style",
            headers=headers,
            json={
                "input": {
                    "image": f"data:image/jpeg;base64,{base64_image}"
                }
            },
            timeout=120.0
        )
    
        if create_style_response.status_code != 200:
            raise Exception(f"FAL API error: {create_style_response.text}")
        
        result = create_style_response.json()
        style_id = result.get("style_id")
        preview_url = result.get("images", [{}])[0].get("url")
        
        if not style_id or not preview_url:
            raise Exception("Invalid response from FAL API")
        
        return {
            "style_id": style_id,
            "preview_url": preview_url,
            "filenames": [f["filename"] for f in files]
        }

async def generate_image(style_id: str, prompt: str) -> Dict[str, Any]:
    if not style_id or not prompt:
        raise ValueError("Style ID and prompt are required")
        
    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "input": {
            "style_id": style_id,
            "prompt": prompt,
            "negative_prompt": "ugly, blurry, low quality, distorted",
            "num_inference_steps": 30,
            "guidance_scale": 7.5
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://fal.ai/api/models/fal-ai/recraft-v3",
            headers=headers,
            json=payload,
            timeout=60.0
        )
    
        if response.status_code != 200:
            raise Exception(f"FAL API error: {response.text}")
        
        result = response.json()
        image_url = result.get("images", [{}])[0].get("url")
        
        if not image_url:
            raise Exception("No image URL found in response")
        
        return {
            "image_url": image_url
        }