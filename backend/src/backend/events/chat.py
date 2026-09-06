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

def event_chat_stream_end():
    return {
        "type": ServerToClientEvents.CHAT_STREAM_END,
        "data": None
    }