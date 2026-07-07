from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.forecast import router as forecast_router
from app.routes.health import router as health_router
from app.routes.predict import router as predict_router
from app.routes.replay import router as replay_router

app = FastAPI(title="RaceIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(predict_router)
app.include_router(replay_router)
app.include_router(forecast_router)
