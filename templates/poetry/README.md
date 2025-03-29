# {{project-name}}

{{project-description}}

## Install

```bash
poetry install
```

## Running

```bash
poe run-dev # run in dev mode
poe run-prod # run in prod mode
```

To change and add environment variables and settings use the `env` files in the `env_files` folder.

## Tests

```bash
poe test
```

## Format, Lint, and Type Checks

```bash
poe format
poe lint
poe type-check 
```

## Docker build

```bash
docker build \
  --build-arg ENV_NAME=<prod|env|debug> \
  --build-arg POETRY_VERSION=<poetry-version> \
  -t {{project-name}} .

docker run -p 8080:8080 {{project-name}}
```