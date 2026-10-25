from backend.settings import settings

ALLOWED_ORIGINS = [settings.frontend_url]

CORS_CONFIG = {
    'allow_origins': ALLOWED_ORIGINS,
    'allow_credentials': True,
    'allow_methods': ['*'],
    'allow_headers': ['*'],
}
