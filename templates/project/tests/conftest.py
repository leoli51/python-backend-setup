import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from {{project-name}}.app import create_app
from {{project-name}}.dependencies import APIDependencies
from unittest.mock import MagicMock
from {{project-name}}.common.managers.greetings_manager import GreetingsManager


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture
def greetings_manager_mock():
    yield MagicMock(spec=GreetingsManager)


@pytest.fixture
def api_dependencies(greetings_manager_mock):
    yield APIDependencies(greetings_manager=greetings_manager_mock)


@pytest.fixture
def app(api_dependencies):
    yield create_app(api_dependencies)


@pytest.fixture
def client(app):
    yield TestClient(app)


@pytest.fixture
async def async_client(app):
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
