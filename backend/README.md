# CAVS - Backend
## Requirements

- [Poetry](https://python-poetry.org/) for Python package and environment management.
- Python 3.12
- Supabase

## Development

- Install `Poetry`
- Install dependencies with `poetry install`
- Go to `/app/` directory and store `.env` file
- Execute following command to run server

```
poetry run uvicorn main:app --reload
```

## Alembic

### Add New Migration

Let's say we want to add a new table `file`

- Create a new version `alembic revision -m "create file table"`
- It'll generate a new file inside `/alembic/version` folder
- Change `upgrade` and `downgrade` function. `upgrade` function will have code to upgrade current database version. Here add code to create a new table. Please refer file `alembic/versions/ffe7001ffe08_create_file_table.py`
- `downgrade` will contain code to delete the table
- Run command from `/backend` with `alembic upgrade head`
  your new change will be applied

### Initialize

- initialize alembic using `alembic init app/alembic`
- update app/alembic/env.py sqlalchemy.url by adding this line
  `config.set_main_option('sqlalchemy.url', f"{os.environ['DATABASE_URL']}")` and set your database url in .env file
- upgrade database and alembic migration version using `alembic upgrade head`

### Swagger Doc

http://localhost:8080/docs

You can ping backend with `curl`

```
curl -i http://localhost:8080/docs
```
## Backend local development

### General workflow

By default, the dependencies are managed with [Poetry](https://python-poetry.org/), go there and install it.

From `./backend/` you can install all the dependencies with:

```console
$ poetry install
```

Then you can start a shell session with the new environment with:

```console
$ poetry shell
```

Make sure your editor is using the correct Python virtual environment.

Modify or add SQLModel models for data and SQL tables in `./backend/app/models.py`, API endpoints in `./backend/app/api/`.
