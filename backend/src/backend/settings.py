from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_uri: str
    db_name: str

    port: int = 3000

    access_token_secret: str
    refresh_token_secret: str

    gemini_api_key: str

    frontend_url: str

    redis_host: str
    redis_port: int
    
    smtp_host: str
    smtp_port: int = 587
    smtp_username: str
    smtp_password: str
    smtp_from: str

    model_config = SettingsConfigDict(
        env_file='.env',
        extra='ignore',
    )


settings = Settings()
