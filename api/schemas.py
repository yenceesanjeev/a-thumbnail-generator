from pydantic import BaseModel
from datetime import datetime

class ProcessedImageCreate(BaseModel):
    original_filename: str
    model_id: str
    thumbnail_url: str

class ProcessedImageResponse(BaseModel):
    id: int
    original_filename: str
    thumbnail_url: str
    processed_at: datetime

    class Config:
        from_attributes = True