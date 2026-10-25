from dataclasses import dataclass

from backend.models.user import User

from backend.schemas.auth import TokensData

@dataclass
class VerifiedEmailData:
    user: User
    tokens: TokensData