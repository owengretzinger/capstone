from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db import init_db


from .routes.public.bots import router as bot_router
from .routes.hidden.users import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # await init_db()
    yield


app = FastAPI(title="MeetingBot Backend", version="0.1.0", lifespan=lifespan)


app.include_router(bot_router, tags=["bots"])

app.include_router(user_router, tags=["users"], include_in_schema=False)


@app.get("/ping", include_in_schema=False)
async def pong():
    return {"ping": "pong!"}
