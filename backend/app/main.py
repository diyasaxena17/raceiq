from fastapi import FastAPI

from app.routes.health import router as health_router
from app.routes.predict import router as predict_router
from app.routes.replay import router as replay_router

app = FastAPI(title="RaceIQ API")

app.include_router(health_router)
app.include_router(predict_router)
app.include_router(replay_router)
