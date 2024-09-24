import pytest
from httpx import ASGITransport, AsyncClient
from ..main import app


@pytest.mark.anyio
async def test_get_audio_download_link():
    meeting_id = "12345"  # Example meeting ID
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get(f"/get_audio_download_link/{meeting_id}")
    assert response.status_code == 200
    assert "download_link" in response.json()
    assert response.json()["download_link"] == "temporary_s3_link"
