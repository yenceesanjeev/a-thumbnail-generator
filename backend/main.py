from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import image_routes
from .config import CORS_ORIGINS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_routes.router, prefix="/api")