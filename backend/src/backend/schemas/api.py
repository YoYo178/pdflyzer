from pydantic import BaseModel


class APIResponse[T](BaseModel):
    status: bool
    message: str
    data: T | None = None