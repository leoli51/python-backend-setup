from fastapi.routing import APIRouter

from {{project-name}}.dependencies import APIDependencies
from {{project-name}}.routes.v0.constants import V0_PREFIX
from {{project-name}}.common.exceptions import GreetingsException


def create_greetings_v0_router(dependencies: APIDependencies) -> APIRouter:
    router = APIRouter(prefix=f"/{V0_PREFIX}/greetings")

    @router.get("")
    async def get_greeting(name: str) -> str:
        if name == "error":
            raise GreetingsException(name=name)
        return dependencies.greetings_manager.greet(name)

    return router
