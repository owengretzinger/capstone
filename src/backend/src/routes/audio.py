from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class AudioLinkResponse(BaseModel):
    download_link: str


@router.get("/get_audio_download_link/{meeting_id}", response_model=AudioLinkResponse)
def get_audio_download_link(meeting_id: str):
    """
    Endpoint to generate a temporary S3 download link for meeting audio.
    """
    download_link = "temporary_s3_link"  # Placeholder
    return AudioLinkResponse(download_link=download_link)
