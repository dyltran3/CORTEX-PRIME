import os
import sys
import json
import datetime
import argparse
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_FLASH_MODEL, VAULT_ROOT
from pathlib import Path

# Configure Gemini API
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY and GEMINI_API_KEY != "your_key_here" else None

SYSTEM_PROMPT = """Bạn là một hệ thống phân loại tri thức cho một Polymath đang nghiên cứu 8 lĩnh vực.
Vault mapping: {phy: vật lý/quantum, math: toán/PDE/tensor, sec: bảo mật/hacking,
ai: machine learning/GPU, lang: ngôn ngữ/HSK, econ: kinh tế/tài chính, law: luật/CISG, res: paper/nghiên cứu}"""

USER_PROMPT_TEMPLATE = """Phân tích đoạn text sau và trả về ĐÚNG định dạng JSON (không có markdown backticks xung quanh JSON):
{{
  "tasks": [{{"action": "...", "vault": "...", "energy": "deep|shallow", "deadline": null}}],
  "knowledge": [{{"concept": "...", "definition": "...", "vault": "...", "tags": []}}],
  "references": [{{"title": "...", "url": "...", "vault": "..."}}],
  "primary_vault": "...",
  "energy_level": "deep|shallow",
  "summary": "1 câu tóm tắt"
}}

TEXT INPUT:
{user_text}"""

def get_vault_folder(vault_name):
    # Mapping short names to actual folder names
    mapping = {
        "phy": "01-far-phy",
        "math": "02-far-math",
        "sec": "03-far-sec",
        "ai": "04-far-ai",
        "lang": "05-far-lang",
        "econ": "06-far-econ",
        "law": "07-far-law",
        "res": "08-far-res"
    }
    for key, value in mapping.items():
        if key in vault_name.lower() or value in vault_name.lower():
            return value
    return "00-inbox/_quick-capture"

def render_template(template_path, variables):
    if not template_path.exists():
        return str(variables) # Fallback
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    for key, value in variables.items():
        content = content.replace(f"{{{{{key}}}}}", str(value))
    return content

def create_note(data, note_type, vault_short_name):
    now = datetime.datetime.now()
    timestamp = now.strftime("%H%M%S")
    date_ymd = now.strftime("%Y-%m-%d")
    date_y = now.strftime("%Y")
    
    vault_folder = get_vault_folder(vault_short_name)
    target_dir = VAULT_ROOT / vault_folder
    target_dir.mkdir(parents=True, exist_ok=True)
    
    template_dir = VAULT_ROOT / "09-meta/templates"
    
    if note_type == "knowledge":
        prefix = vault_short_name.upper()[:3]
        title = data.get('concept', 'Untitled').replace('/', '-')
        variables = {
            "vault_prefix": prefix,
            "date:YYYY": date_y,
            "timestamp": timestamp,
            "title": title,
            "date:YYYY-MM-DD": date_ymd,
            "vault": vault_folder,
            "energy": data.get("energy", "shallow"),
            "tags": ", ".join(data.get("tags", [])),
            "source": data.get("source", ""),
            "definition": data.get("definition", ""),
            "question": f"What is {title}?",
            "answer": data.get("definition", "")
        }
        content = render_template(template_dir / "KnowledgeNote.md", variables)
        filename = f"{prefix}-{date_y}-{timestamp}_{title}.md"
        
    elif note_type == "task":
        title = data.get('action', 'Untitled Task')
        variables = {
            "date:YYYY": date_y,
            "timestamp": timestamp,
            "title": title,
            "date:YYYY-MM-DD": date_ymd,
            "due_date": data.get("deadline", "") or "",
            "vault": vault_folder,
            "energy": data.get("energy", "shallow"),
            "tags": vault_short_name,
            "action": title
        }
        content = render_template(template_dir / "TaskNote.md", variables)
        filename = f"TASK-{date_y}-{timestamp}.md"
        
    else:
        return # Skip other types for now
        
    # Clean filename
    filename = "".join(c for c in filename if c.isalnum() or c in ('-', '_', '.')).rstrip()
    
    file_path = target_dir / filename
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Created {note_type} note: {file_path}")

def process_text(text):
    if not client:
        print("Error: GEMINI_API_KEY not configured. Please check .env file.")
        return

    prompt = USER_PROMPT_TEMPLATE.format(user_text=text)
    
    print("Calling Gemini API...")
    try:
        response = client.models.generate_content(
            model=GEMINI_FLASH_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json"
            )
        )
        
        result_text = response.text
        # Clean up if markdown backticks were accidentally included
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        data = json.loads(result_text)
        print("Parsed JSON successfully.")
        
        # Create notes
        for task in data.get('tasks', []):
            task['energy'] = task.get('energy') or data.get('energy_level', 'shallow')
            create_note(task, 'task', task.get('vault', data.get('primary_vault', 'inbox')))
            
        for kn in data.get('knowledge', []):
            kn['energy'] = data.get('energy_level', 'shallow')
            create_note(kn, 'knowledge', kn.get('vault', data.get('primary_vault', 'inbox')))
            
        # We can also handle references here, maybe append to an inbox file or create a reference note.
        for ref in data.get('references', []):
            print(f"Detected Reference: {ref.get('title')} ({ref.get('url')}) for vault {ref.get('vault')}")
            
    except Exception as e:
        print(f"Error calling API or parsing response: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CORTEX-PRIME Brain Dump Engine")
    parser.add_argument("text", nargs="?", help="Text input to process")
    args = parser.parse_args()
    
    text = args.text
    if not text:
        print("Enter text to process (press Ctrl+D or Ctrl+Z on Windows to end):")
        text = sys.stdin.read()
        
    if text.strip():
        process_text(text)
    else:
        print("No text provided.")
