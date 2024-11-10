from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from ..services.fal_service import create_style, generate_image

router = APIRouter()

@router.post("/process-images")
async def process_images(files: List[UploadFile] = File(...)):
    try:
        if len(files) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
            
        content = await files[0].read()
        result = await create_style(content)
        
        return {
            "id": result["style_id"],
            "style_id": result["style_id"],
            "preview_url": result["preview_url"],
            "original_filename": files[0].filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-image")
async def generate_image_route(prompt: str = Form(...), style_id: str = Form(...)):
    try:
        result = await generate_image(prompt, style_id)
        return {
            **result,
            "prompt": prompt,
            "style_id": style_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))