from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db import init_db


from .routes.bots import router as bot_router
from .routes.users import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # await init_db()
    yield


app = FastAPI(title="MeetingBot Backend", version="0.1.0", lifespan=lifespan)


app.include_router(bot_router, tags=["bots"])
app.include_router(user_router, tags=["users"])


@app.get("/ping")
async def pong():
    return {"ping": "pong!"}
