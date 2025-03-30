# --- Builder Stage ---
FROM python:{{python-version}}-buster AS builder

ARG ENV_NAME
ARG POETRY_VERSION

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN touch README.md

RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install --without dev --no-root

# --- Runtime Stage ---
FROM python:{{python-version}}-slim-buster AS runtime

ARG ENV_NAME
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Copy venv from builder
COPY --from=builder /app/.venv /app/.venv

# Copy source code
COPY {{project-name}} ./{{project-name}}

# Copy correct env file and load it
COPY env_files/env.${ENV_NAME} .env

# Load environment variables from .env
# And run fastapi using those
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["set -a && . ./.env && exec fastapi run {{project-name}}/main.py --host $HOST --port $PORT --workers $WORKERS"]
