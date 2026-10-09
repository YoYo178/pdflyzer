from enum import StrEnum


class ClientToServerEvents(StrEnum):
    CHAT_MESSAGE_SEND = "chat.message.send"
    CHAT_MESSAGE_EDIT = "chat.message.edit"
    CHAT_MESSAGE_DELETE = "chat.message.delete"

class ServerToClientEvents(StrEnum):
    CHAT_MESSAGE_CREATED = "chat.message.created"
    
    CHAT_STREAM_BEGIN = "chat.stream.begin"
    CHAT_STREAM_CHUNK = "chat.stream.chunk"
    CHAT_STREAM_SOURCES_CHUNK = "chat.stream.sources_chunk"
    CHAT_STREAM_END = "chat.stream.end"
    
    CHAT_TITLE_UPDATE = "chat.title.update"
    
    CHAT_DOCUMENT_UPDATE = "chat.document.update"