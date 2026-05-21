import os
import sys
import time
import json
from pathlib import Path
from google import genai
from google.genai import types

# Load central config
sys.path.append(str(Path(__file__).parent.parent))
from config import GEMINI_API_KEY, GEMINI_FLASH_MODEL, GEMINI_PRO_MODEL

class GeminiClientWrapper:
    """
    A robust, retry-enabled wrapper around the Google GenAI SDK.
    Provides easy access to generation, structured JSON, and text embeddings.
    """
    def __init__(self, api_key=None):
        self.api_key = api_key or GEMINI_API_KEY
        if not self.api_key or self.api_key == "your_key_here":
            raise ValueError("GEMINI_API_KEY not configured. Please set it in the .env file.")
        
        self.client = genai.Client(api_key=self.api_key)

    def generate_content(self, prompt: str, system_instruction: str = None, model: str = None, temperature: float = 0.2, max_retries: int = 5) -> str:
        """
        Generates content from a text prompt with automatic retry on rate limit (429) errors.
        """
        target_model = model or GEMINI_FLASH_MODEL
        config = types.GenerateContentConfig(
            temperature=temperature
        )
        if system_instruction:
            config.system_instruction = system_instruction

        delay = 1.0
        for attempt in range(max_retries):
            try:
                response = self.client.models.generate_content(
                    model=target_model,
                    contents=prompt,
                    config=config
                )
                return response.text
            except Exception as e:
                # Check for rate limit or resource exhausted (HTTP 429 / RESOURCE_EXHAUSTED)
                err_str = str(e).lower()
                if "429" in err_str or "resource" in err_str or "exhausted" in err_str or "rate limit" in err_str:
                    if attempt == max_retries - 1:
                        raise e
                    print(f"Rate limited. Retrying in {delay:.1f}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(delay)
                    delay *= 2
                else:
                    raise e

    def generate_structured_json(self, prompt: str, system_instruction: str = None, model: str = None, temperature: float = 0.1, max_retries: int = 5) -> dict:
        """
        Generates structured JSON data from a text prompt.
        Ensures the model returns valid JSON and parses it.
        """
        target_model = model or GEMINI_FLASH_MODEL
        config = types.GenerateContentConfig(
            temperature=temperature,
            response_mime_type="application/json"
        )
        if system_instruction:
            config.system_instruction = system_instruction

        delay = 1.0
        for attempt in range(max_retries):
            try:
                response = self.client.models.generate_content(
                    model=target_model,
                    contents=prompt,
                    config=config
                )
                
                result_text = response.text.strip()
                # Strip markdown code blocks if included
                if result_text.startswith("```json"):
                    result_text = result_text[7:]
                if result_text.startswith("```"):
                    result_text = result_text[3:]
                if result_text.endswith("```"):
                    result_text = result_text[:-3]
                
                return json.loads(result_text.strip())
            except Exception as e:
                err_str = str(e).lower()
                if "429" in err_str or "resource" in err_str or "exhausted" in err_str or "rate limit" in err_str:
                    if attempt == max_retries - 1:
                        raise e
                    print(f"Rate limited. Retrying in {delay:.1f}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(delay)
                    delay *= 2
                elif isinstance(e, json.JSONDecodeError):
                    print(f"JSON decode failed. Raw response: {response.text if 'response' in locals() else 'None'}")
                    raise e
                else:
                    raise e

    def get_embedding(self, text: str, model: str = "gemini-embedding-001", max_retries: int = 5) -> list:
        """
        Fetches the vector embedding for a given text string.
        Utilizes the text-embedding-004 model.
        """
        delay = 1.0
        for attempt in range(max_retries):
            try:
                response = self.client.models.embed_content(
                    model=model,
                    contents=text
                )
                # Structure of response from embed_content:
                # response.embeddings is a list of ContentEmbedding.
                # Each ContentEmbedding has a field `values` containing the float list.
                if response.embeddings and len(response.embeddings) > 0:
                    return response.embeddings[0].values
                elif hasattr(response, 'embedding') and response.embedding:
                    return response.embedding.values
                else:
                    raise ValueError(f"No embeddings returned in response: {response}")
            except Exception as e:
                err_str = str(e).lower()
                if "429" in err_str or "resource" in err_str or "exhausted" in err_str or "rate limit" in err_str:
                    if attempt == max_retries - 1:
                        raise e
                    print(f"Rate limited. Retrying in {delay:.1f}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(delay)
                    delay *= 2
                else:
                    raise e

# Direct utility function
def get_gemini_client():
    return GeminiClientWrapper()
