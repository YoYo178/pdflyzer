from pathlib import Path
from collections.abc import AsyncIterator, Awaitable, Callable
from textwrap import dedent
from typing import TypeVar

from google import genai
from google.genai import types

from backend.settings import settings
from backend.types.document import RetrievedChunk
from backend.types.llm import LLMPrompt


T = TypeVar("T")

MODELS = (
    # "gemini-3.8-flash", # Thinking level MINIMAL not supported for this model (02-11-2026)
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
)

PROMPTS_PATH = Path(__file__).parent.parent.parent / "prompts"

DEFAULT_RAG_SYSTEM_PROMPT = (PROMPTS_PATH / "rag_system_prompt.txt").read_text(encoding="utf-8").strip()
DEFAULT_TITLE_SYSTEM_PROMPT = (PROMPTS_PATH / "title_system_prompt.txt").read_text(encoding="utf-8").strip()

class LLMService:
    def __init__(self) -> None:
        self._client = genai.Client(api_key=settings.gemini_api_key)

    def _build_prompt(self, question: str, chunks: list[RetrievedChunk]) -> LLMPrompt:
        document_context = "\n\n".join(
            dedent(
                f"""
                --- Document Chunk {index} ("[[{index}]]" for citation) ---
                {chunk.text}
                """
            ).strip()
            for index, chunk in enumerate(chunks, start=1)
        )

        user_prompt = "\n\n".join(
            part
            for part in (
                (
                    "Relevant Document Context:\n\n"
                    f"{document_context}"
                )
                if document_context
                else "",
                f"User question:\n{question}",
            )
            if part
        )

        return LLMPrompt(DEFAULT_RAG_SYSTEM_PROMPT, user_prompt)

    def _build_title_prompt(self, question: str) -> LLMPrompt:
        return LLMPrompt(
            system_prompt=DEFAULT_TITLE_SYSTEM_PROMPT,
            user_prompt=f'Prompt: "{question}"',
        )

    async def _run_with_fallback(self, callback: Callable[[str], Awaitable[T]]) -> T:
        last_error: Exception | None = None

        for model in MODELS:
            try:
                print(f"Trying model: {model}")
                return await callback(model)

            except Exception as exc:
                last_error = exc
                print(f"Model {model} failed: {exc}")

        if last_error is not None:
            raise last_error

        raise RuntimeError("No LLM models configured.")

    async def _stream_with_fallback(self, callback: Callable[[str], AsyncIterator[str]]) -> AsyncIterator[str]:
        for model in MODELS:
            print(f"Trying model: {model}")
            has_yielded = False

            try:
                async for chunk in callback(model):
                    if not chunk:
                        continue

                    has_yielded = True
                    yield chunk

                return

            except Exception as exc:
                print(f"Model {model} failed: {exc}")

                if has_yielded:
                    raise

                continue

        raise RuntimeError(
            "All configured LLM models failed before streaming."
        )

    async def generate_title(self, question: str) -> str | None:
        prompt = self._build_title_prompt(question)

        async def request(model: str) -> str | None:
            chat = self._client.aio.chats.create(model=model)

            response = await chat.send_message(
                message=prompt.user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=prompt.system_prompt,
                    thinking_config=types.ThinkingConfig(
                        thinking_level=types.ThinkingLevel.MINIMAL
                    ),
                    temperature=0.1
                ),
            )

            return response.text

        return await self._run_with_fallback(request)

    async def generate(self, question: str, chunks: list[RetrievedChunk]) -> str | None:
        prompt = self._build_prompt(question, chunks)

        async def request(model: str) -> str | None:
            chat = self._client.aio.chats.create(model=model)

            response = await chat.send_message(
                message=prompt.user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=prompt.system_prompt,
                    thinking_config=types.ThinkingConfig(
                        thinking_level=types.ThinkingLevel.MINIMAL
                    ),
                    temperature=0.1
                ),
            )

            return response.text

        return await self._run_with_fallback(request)

    async def stream(self, question: str, chunks: list[RetrievedChunk]) -> AsyncIterator[str]:
        prompt = self._build_prompt(question, chunks)

        async def request(model: str) -> AsyncIterator[str]:
            chat = self._client.aio.chats.create(model=model)

            response_stream = await chat.send_message_stream(
                message=prompt.user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=prompt.system_prompt,
                    thinking_config=types.ThinkingConfig(
                        thinking_level=types.ThinkingLevel.MINIMAL
                    ),
                    temperature=0.1
                ),
            )

            async for response in response_stream:
                if response.text:
                    yield response.text

        async for chunk in self._stream_with_fallback(request):
            yield chunk
