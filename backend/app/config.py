from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    frontend_url: str = "http://localhost:5173"
    resend_api_key: str = ""
    gmail_user: str = ""
    gmail_app_password: str = ""
    # Namecheap Private Email SMTP (preferred — sends from helio@baystreet.cc)
    smtp_user: str = ""       # helio@baystreet.cc
    smtp_password: str = ""   # mailbox password

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
