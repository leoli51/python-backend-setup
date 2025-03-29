from __future__ import annotations
from dataclasses import dataclass

from {{project-name}}.settings import APISettings
from {{project-name}}.common.managers.greetings_manager import GreetingsManager


@dataclass
class APIDependencies:
    greetings_manager: GreetingsManager

    @classmethod
    def from_settings(cls, api_settings: APISettings) -> APIDependencies:
        greetings_manager = GreetingsManager()

        return cls(
            greetings_manager=greetings_manager,
        )
