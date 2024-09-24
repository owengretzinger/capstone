from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel


router = APIRouter()


class MeetingRequest(BaseModel):
    link: str


class MeetingResponse(BaseModel):
    meeting_id: str


@router.post("/submit_meeting_link", response_model=MeetingResponse)
def submit_meeting_link(data: MeetingRequest):
    """
    Endpoint to submit a meeting link and generate a meeting ID.
    """
    meeting_id = "generated_meeting_id"  # Placeholder
    return MeetingResponse(meeting_id=meeting_id)


class MeetingStatusResponse(BaseModel):
    status: str
    info: str = None


@router.get("/get_meeting/{meeting_id}", response_model=MeetingStatusResponse)
def get_meeting(meeting_id: str):
    """
    Endpoint to get the status and additional info of a meeting by its ID.
    """
    status = "meeting_status"  # Placeholder
    info = "additional_info"  # Placeholder
    return MeetingStatusResponse(status=status, info=info)


class FilterParams(BaseModel):
    date: Optional[str] = None
    attendees: Optional[List[str]] = None
    title: Optional[str] = None


@router.get("/get_meetings", response_model=list[MeetingStatusResponse])
def get_meetings(params: FilterParams = Depends()):
    """
    Endpoint to filter and return a list of meetings based on filter parameters.
    """
    meetings = [
        {"status": "status1", "info": "info1"},
        {"status": "status2", "info": "info2"},
    ]  # Placeholder
    return [MeetingStatusResponse(**meeting) for meeting in meetings]
