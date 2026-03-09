from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # app
    APP_NAME: str = "Platform otomasi"
    DEBUG: bool = False

    # db
    DATABASE_URL: str

    # jwt
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # n8n
    N8N_BASE_URL: str
    N8N_API_KEY: str

    # cors
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]


settings = Settings()
