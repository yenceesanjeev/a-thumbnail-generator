import os
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    raise ValueError("FAL_KEY must be set in .env file")

CORS_ORIGINS = ["http://localhost:5173"]