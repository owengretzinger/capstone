import pytest
from httpx import ASGITransport, AsyncClient
from backend.routes.meetings import FilterParams
from ..main import app


@pytest.mark.anyio
async def test_submit_meeting_link():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/submit_meeting_link", json={"link": "http://example.com"}
        )
    assert response.status_code == 200
    assert "meeting_id" in response.json()


@pytest.mark.anyio
async def test_get_meeting():
    meeting_id = "test_meeting_id"
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get(f"/get_meeting/{meeting_id}")
    assert response.status_code == 200
    assert "status" in response.json()
    assert "info" in response.json()


@pytest.mark.anyio
async def test_get_meetings():
    params = FilterParams(
        date="2022-01-01", attendees=["Alice", "Bob"], title="Meeting"
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/get_meetings", params=params.model_dump())
    assert response.status_code == 200
    assert isinstance(response.json(), list)
