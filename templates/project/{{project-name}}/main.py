from dotenv import load_dotenv

from {{project-name}}.app import create_app
from {{project-name}}.dependencies import APIDependencies
from {{project-name}}.settings import APISettings

load_dotenv()
# Parse settings
settings = APISettings()
# Create dependencies
dependencies = APIDependencies.from_settings(settings)
# Create app to be run in dev/prod environments
app = create_app(dependencies)


if __name__ == "__main__":
    import uvicorn

    # Run app in debug mode
    uvicorn.run(
        app=app,
        host=settings.host,
        port=settings.port,
        workers=settings.workers,
    )
