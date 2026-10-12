from dataclasses import dataclass


@dataclass
class StoredFile:
    path: str
    size: int
    sha256: str
