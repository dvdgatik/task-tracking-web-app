import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)  # sin lifespan
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_create_task():
    transport = ASGITransport(app=app)  # sin lifespan
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/tasks", json={"title": "Nueva tarea"})
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Nueva tarea"
    assert data["completed"] is False
