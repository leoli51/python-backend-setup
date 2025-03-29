from pydantic_settings import BaseSettings


class APISettings(BaseSettings):
    host: str
    port: int
    workers: int
