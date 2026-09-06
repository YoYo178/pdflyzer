from textwrap import dedent
from google import genai
from typing import AsyncIterator

from backend.settings import settings

from backend.types.document import RetrievedChunk
from backend.types.llm import LLMPrompt

class LLMService():
    _client: genai.Client | None = None
    _model: str = "gemini-3.6-flash"
    
    def __init__(self):
        self._client = genai.Client(api_key=settings.gemini_api_key)
        
    def _build_prompt(self, question: str, chunks: list[RetrievedChunk]) -> LLMPrompt:
        system_prompt = dedent("""
            You are an AI assistant that answers questions using the provided document context.

            Rules:
            - Answer the user's question using only the provided context.
            - Do not use outside knowledge.
            - Do not browse the web or provide web results.
            - If the provided context does not contain enough information to answer the question, say that you don't have enough information.
            - Do not invent or assume facts that are not present in the context.
            - Make sure the response doesn't look like any context is provided, such as "Based on the provided context..." sentences must be avoided.
        """).strip()
        
        user_prompt = "Relevant Document Context:"
        
        for index, chunk in enumerate(chunks):
            user_prompt += dedent(f"""
            
                --- Document Chunk {index + 1} ---
                {chunk.text}
                
            """).strip()
            
        user_prompt += dedent(f"""
            User question:
            
            {question}
        """).strip()
        
        return LLMPrompt(
            system_prompt,
            user_prompt
        )
                
    async def generate(self, question: str, chunks: list[RetrievedChunk]):
        if not self._client:
            raise RuntimeError("LLMService not initialized!")
        
        prompt_data = self._build_prompt(question, chunks)
        
        chat = self._client.aio.chats.create(
            model=self._model
        )
        
        response = await chat.send_message(
            config={
                "system_instruction": prompt_data.system_prompt
            },
            message=prompt_data.user_prompt,
        )
        
        return response.text
    
    async def stream(self, question: str, chunks: list[RetrievedChunk]) -> AsyncIterator[str]:
        if not self._client:
            raise RuntimeError("LLMService not initialized!")
        
        prompt_data = self._build_prompt(question, chunks)
        
        chat = self._client.aio.chats.create(
            model=self._model
        )
        
        chunks_generator = await chat.send_message_stream(
            config={
                "system_instruction": prompt_data.system_prompt
            },
            message=prompt_data.user_prompt
        )
        
        async for chunk in chunks_generator:
            if not chunk.text:
                continue
            
            yield chunk.text