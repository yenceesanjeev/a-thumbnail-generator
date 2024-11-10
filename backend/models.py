from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class ProcessedImage(Base):
    __tablename__ = "processed_images"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String)
    model_id = Column(String)
    thumbnail_url = Column(String)
    processed_at = Column(DateTime)