from beanie import PydanticObjectId

from backend.core.llm import LLMService

from backend.repositories.chat import ChatRepository

async def generate_chat_title(
    ctx,
    user_id: str,
    chat_id: str,
    prompt: str
):
    llm_service = LLMService()
    chat_repository = ChatRepository()
    
    try:
        title = await llm_service.generate_title(prompt)
        
        if not title:
            return
        
        await chat_repository.update(
            PydanticObjectId(user_id),
            PydanticObjectId(chat_id),
            { "name": title }
        )
    except Exception:
        print(f'An error occured while trying to generate title for Chat ID: {chat_id}')

        raise