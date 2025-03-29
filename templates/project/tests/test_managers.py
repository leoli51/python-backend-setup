import pytest
from {{project-name}}.common.managers.greetings_manager import GreetingsManager


@pytest.fixture
def greetings_manager() -> GreetingsManager:
    return GreetingsManager()


def test_greeting(greetings_manager):
    assert greetings_manager.greet("Alice") == "Hello, Alice!"
