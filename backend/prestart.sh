#!/usr/bin/env bash

echo "Running prestart script..."

# Run migrations
poetry run alembic upgrade head

echo "Finished prestart script..."

exec "$@"