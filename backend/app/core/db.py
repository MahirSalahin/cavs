from sqlmodel import SQLModel, create_engine, Session
from core.config import settings

# Create the engine for PostgreSQL
engine = create_engine(settings.DATABASE_URL)

# Create a session for the database connection
def get_session():
    with Session(engine) as session:
        yield session

# Function to initialize the database (to be used with Alembic for migrations)
def init_db():
    SQLModel.metadata.create_all(engine)
