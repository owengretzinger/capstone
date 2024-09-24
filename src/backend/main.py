from fastapi import FastAPI
from .routes.meetings import router as meeting_router
from .routes.audio import router as audio_router
from .routes.bots import router as bot_router


app = FastAPI()

app.include_router(meeting_router, tags=["meetings"])
app.include_router(audio_router, tags=["audio"])
app.include_router(bot_router, tags=["bots"])
