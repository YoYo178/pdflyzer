from typing import Literal
from backend.types.events import ServerToClientEvents

def event_chat_stream_begin():
    return {
        "type": ServerToClientEvents.CHAT_STREAM_BEGIN,
        "data": None
    }

def event_chat_stream_chunk(chunk: str):
    return {
        "type": ServerToClientEvents.CHAT_STREAM_CHUNK,
        "data": chunk
    }

def event_chat_stream_sources_chunk(data: list[str]):
    return {
        "type": ServerToClientEvents.CHAT_STREAM_SOURCES_CHUNK,
        "data": data
    }

def event_chat_stream_end():
    return {
        "type": ServerToClientEvents.CHAT_STREAM_END,
        "data": None
    }

def event_chat_title_update(title: str):
    return {
        "type": ServerToClientEvents.CHAT_TITLE_UPDATE,
        "data": title
    }