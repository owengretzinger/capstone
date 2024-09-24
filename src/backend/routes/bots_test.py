import pytest
from httpx import ASGITransport, AsyncClient
from ..main import app


@pytest.mark.anyio
async def test_setup_bots():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post("/setup_bots")
    assert response.status_code == 200
    assert response.json() == {"status": "bots setup triggered"}


@pytest.mark.anyio
async def test_heartbeat():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post("/heartbeat")
    assert response.status_code == 200
    assert response.json() == {"status": "heartbeat received"}
