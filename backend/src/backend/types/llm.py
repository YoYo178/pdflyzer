from dataclasses import dataclass

@dataclass
class LLMPrompt():
    system_prompt: str
    user_prompt: str