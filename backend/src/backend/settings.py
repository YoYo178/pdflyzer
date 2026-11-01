from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = 'development'
    
    mongodb_uri: str
    db_name: str

    port: int = 3000

    access_token_secret: str
    refresh_token_secret: str

    gemini_api_key: str

    frontend_origin: str
    
    redis_url: str
    
    smtp_host: str
    smtp_port: int = 587
    smtp_username: str
    smtp_password: str
    smtp_from: str
    
    @property
    def DEV(self) -> bool:
        return self.app_env.lower() in ('development', 'dev', 'local')
    
    @property
    def PROD(self) -> bool:
        return not self.DEV

    model_config = SettingsConfigDict(
        env_file='.env',
        extra='ignore',
    )


settings = Settings()
