# Use the official Python image as the base image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app/

# Install Poetry
RUN pip install poetry

# Copy the pyproject.toml and poetry.lock files to the container
COPY pyproject.toml poetry.lock /app/

# Install the dependencies
RUN poetry install --no-root

# Set the PYTHONPATH environment variable
ENV PYTHONPATH=/app

# Copy the Alembic configuration file
COPY app/alembic.ini /app/

# Copy the Alembic migration scripts
COPY app/alembic /app/alembic

# Copy the prestart script
COPY prestart.sh /app/
RUN chmod +x /app/prestart.sh

# Copy the application code
COPY app /app/app

# Expose the port that the FastAPI app will run on
EXPOSE 8000

# Use the prestart script as the entry point
ENTRYPOINT ["/app/prestart.sh"]

# Run the FastAPI application using Uvicorn
WORKDIR /app/app
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]