from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import os
from dotenv import load_dotenv
import fal
from typing import List

from .models import Base, ProcessedImage
from .database import SessionLocal, engine
from .schemas import ProcessedImageCreate, ProcessedImageResponse

load_dotenv()
Base.metadata.create_all(bind=engine)

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    raise ValueError("FAL_KEY must be set in .env file")

fal.config({
    'credentials': FAL_KEY
})

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def on_queue_update(update):
    if isinstance(update, fal.InProgress):
        for log in update.logs:
            print(log["message"])

@app.post("/api/process-image", response_model=ProcessedImageResponse)
async def process_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        import base64
        base64_image = base64.b64encode(content).decode('utf-8')
        base64_url = f"data:image/jpeg;base64,{base64_image}"
        
        result = fal.subscribe(
            "fal-ai/recraft-v3/create-style",
            arguments={
                "images_data_url": base64_url
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        style_url = result["images"][0]["url"]
        style_id = result["request_id"]
        
        db_image = ProcessedImage(
            original_filename=file.filename,
            model_id=style_id,
            thumbnail_url=style_url,
            processed_at=datetime.utcnow()
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        
        return ProcessedImageResponse(
            id=db_image.id,
            thumbnail_url=style_url,
            original_filename=file.filename,
            processed_at=db_image.processed_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate")
async def generate_image(
    prompt: str = Form(...),
    style_id: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        result = fal.subscribe(
            "fal-ai/recraft-v3",
            arguments={
                "prompt": prompt,
                "style_id": style_id
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        return {"image_url": result["images"][0]["url"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/images", response_model=List[ProcessedImageResponse])
def get_processed_images(db: Session = Depends(get_db)):
    images = db.query(ProcessedImage).order_by(ProcessedImage.processed_at.desc()).all()
    return images