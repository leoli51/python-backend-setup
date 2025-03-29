from fastapi import FastAPI

from {{project-name}}.dependencies import APIDependencies
from {{project-name}}.routes.v0.greetings.api import create_greetings_v0_router
from {{project-name}}.common.exception_handlers import init_exception_handlers


def create_app(dependencies: APIDependencies) -> FastAPI:
    # Create app
    app = FastAPI()

    # Add health check
    @app.get("/healthcheck")
    def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    # Add routers
    app.include_router(create_greetings_v0_router(dependencies))

    # Add exception handlers
    init_exception_handlers(app)

    return app
