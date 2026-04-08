from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Splitwise Multi-Currency"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://splitwise:splitwise_dev@localhost:5432/splitwise"
    database_url_sync: str = "postgresql://splitwise:splitwise_dev@localhost:5432/splitwise"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    jwt_secret_key: str = "dev-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30

    # Exchange Rate API
    frankfurter_base_url: str = "https://api.frankfurter.dev/v1"

    # Azure Blob Storage (optional)
    azure_storage_connection_string: str = ""
    azure_storage_container: str = "receipts"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
