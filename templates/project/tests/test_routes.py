import pytest


def test_healthcheck(client):
    response = client.get("/healthcheck")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.anyio
async def test_greeting_success(async_client, greetings_manager_mock):
    greetings_manager_mock.greet.return_value = "Hello, Alice!"
    response = await async_client.get("v0/greetings?name=Alice")

    greetings_manager_mock.greet.assert_called_once_with("Alice")
    assert response.status_code == 200
    assert response.json() == "Hello, Alice!"


@pytest.mark.anyio
async def test_greeting_failed(async_client, greetings_manager_mock):
    response = await async_client.get("v0/greetings?name=error")

    greetings_manager_mock.greet.assert_not_called()
    assert response.status_code == 418
