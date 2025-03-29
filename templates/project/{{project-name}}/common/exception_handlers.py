from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from {{project-name}}.common.exceptions import GreetingsException


def init_exception_handlers(app: FastAPI) -> None:
    """Initialize exception handlers for the FastAPI app."""

    @app.exception_handler(GreetingsException)
    async def greetings_exception_handler(
        request: Request, exception: GreetingsException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=418,
            content={"detail": f"{exception.name} is not a valid name"},
        )
