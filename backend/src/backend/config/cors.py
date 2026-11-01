from backend.settings import settings

ALLOWED_ORIGINS = ['http://localhost:5173', 'https://yoyo178.github.io', settings.frontend_origin]

CORS_CONFIG = {
    'allow_origins': ALLOWED_ORIGINS,
    'allow_credentials': True,
    'allow_methods': ['*'],
    'allow_headers': ['*'],
}
