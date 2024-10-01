from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class SetupBotsResponse(BaseModel):
    status: str


@router.post("/setup_bots", response_model=SetupBotsResponse)
def setup_bots():
    """
    Endpoint to setup bots, typically triggered by a lambda CRON job.
    """
    return SetupBotsResponse(status="bots setup triggered")


class HeartbeatResponse(BaseModel):
    status: str


@router.post("/heartbeat", response_model=HeartbeatResponse)
def heartbeat():
    """
    Endpoint for bots to update the backend with their status.
    """
    return HeartbeatResponse(status="heartbeat received")
