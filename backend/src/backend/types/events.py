from enum import StrEnum

class ClientToServerEvents(StrEnum):
    CHAT_MESSAGE_SEND = "chat.message.send"
    CHAT_MESSAGE_EDIT = "chat.message.edit"
    CHAT_MESSAGE_DELETE = "chat.message.delete"

class ServerToClientEvents(StrEnum):
    CHAT_MESSAGE_CREATED = "chat.message.created"