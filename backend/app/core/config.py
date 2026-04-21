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

    # cors
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "AutoSix"
    FRONTEND_URL: str = "http://localhost:3000"


settings = Settings()
