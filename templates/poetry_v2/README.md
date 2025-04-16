# {{project-name}}

{{project-description}}

## Install

```bash
poetry install
eval $(poetry env activate)
```

## Running

```bash
poe run-dev # run in dev mode
poe run-prod # run in prod mode
```

To change and add environment variables and settings use the `env` files in the `env_files` folder.

## Tests

```bash
pytest
# or
poe test
```

## Format, Lint, and Type Checks

```bash
ruff format
ruff check
mypy {{project-name}}
# or
poe format
poe lint
poe type-check 
```

## Docker build

```bash
docker build \
  --build-arg ENV_NAME=<development|production|debug> \
  --build-arg POETRY_VERSION=<poetry-version> \
  -t {{project-name}} .

docker run -p 8080:8080 {{project-name}}
```