import os
import json
import argparse
import datetime
from pathlib import Path
from pypdf import PdfReader
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_PRO_MODEL, VAULT_ROOT

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY and GEMINI_API_KEY != "your_key_here" else None

SYSTEM_PROMPT = """Bạn là một trợ lý nghiên cứu khoa học chuyên phân tích Paper cho một Polymath.
Vault đích: Far-Res."""

USER_PROMPT_TEMPLATE = """Hãy phân tích tài liệu khoa học sau và trả về ĐÚNG định dạng JSON (không dùng markdown backticks quanh JSON):
{{
  "paper_title": "Tên bài báo",
  "main_idea": "Ý tưởng chính (2-3 câu)",
  "methods": "Phương pháp nghiên cứu (bullet points)",
  "results": "Kết quả chính (bullet points)",
  "gaps": "Hạn chế và khoảng trống nghiên cứu (bullet points)",
  "latex_formulas": [
    {{
      "formula": "Mã LaTeX của công thức",
      "description": "Mô tả công thức",
      "vault_tag": "Far-Math hoặc Far-Phy hoặc..."
    }}
  ],
  "bibtex": "Chuỗi BibTeX của bài báo",
  "doi": "DOI nếu có",
  "domain_tags": ["tag1", "tag2"],
  "math_connection": "Liên kết với Toán học (nếu có)",
  "physics_connection": "Liên kết với Vật lý (nếu có)",
  "research_questions": ["Câu hỏi 1", "Câu hỏi 2"]
}}

NỘI DUNG TÀI LIỆU:
{text}
"""

def extract_text_from_pdf(pdf_path):
    print(f"Reading PDF: {pdf_path}")
    reader = PdfReader(pdf_path)
    text = ""
    for i, page in enumerate(reader.pages):
        # Limit to 50 pages to save tokens
        if i >= 50:
            print("Warning: PDF exceeds 50 pages. Truncating.")
            break
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def create_paper_note(data, source_pdf):
    now = datetime.datetime.now()
    timestamp = now.strftime("%H%M%S")
    date_ymd = now.strftime("%Y-%m-%d")
    date_y = now.strftime("%Y")
    
    target_dir = VAULT_ROOT / "08-far-res"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Process formulas to string
    formulas_str = ""
    for f in data.get("latex_formulas", []):
        formulas_str += f"**{f.get('description')}**\n"
        formulas_str += f"$$\n{f.get('formula')}\n$$\n"
        formulas_str += f"Tag: {f.get('vault_tag')}\n\n"
        
    # Process lists
    methods_str = "\n".join([f"- {m}" for m in data.get("methods", [])]) if isinstance(data.get("methods"), list) else data.get("methods", "")
    results_str = "\n".join([f"- {r}" for r in data.get("results", [])]) if isinstance(data.get("results"), list) else data.get("results", "")
    gaps_str = "\n".join([f"- {g}" for g in data.get("gaps", [])]) if isinstance(data.get("gaps"), list) else data.get("gaps", "")
    rqs_str = "\n".join([f"- {rq}" for rq in data.get("research_questions", [])])
    
    template_dir = VAULT_ROOT / "09-meta/templates"
    template_path = template_dir / "PaperNote.md"
    
    variables = {
        "date:YYYY": date_y,
        "timestamp": timestamp,
        "paper_title": data.get("paper_title", "Untitled Paper").replace('"', "'"),
        "date:YYYY-MM-DD": date_ymd,
        "bibtex_key": data.get("doi", "").replace("/", "_") or f"Paper_{timestamp}",
        "doi": data.get("doi", ""),
        "domain_tags": ", ".join(data.get("domain_tags", [])),
        "main_idea": data.get("main_idea", ""),
        "methods": methods_str + "\n\n### Kết quả\n" + results_str,
        "latex_formula": formulas_str,
        "gaps": gaps_str,
        "math_connection": data.get("math_connection", "N/A"),
        "physics_connection": data.get("physics_connection", "N/A"),
    }
    
    content = ""
    if template_path.exists():
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()
        for key, value in variables.items():
            content = content.replace(f"{{{{{key}}}}}", str(value))
            
        # Add research questions
        content = content.replace("## Câu hỏi nghiên cứu từ paper này\n\n- ", f"## Câu hỏi nghiên cứu từ paper này\n\n{rqs_str}")
    else:
        content = json.dumps(data, indent=2, ensure_ascii=False)
        
    filename = f"RES-{date_y}-{timestamp}_{variables['paper_title'][:30].replace(' ', '_')}.md"
    filename = "".join(c for c in filename if c.isalnum() or c in ('-', '_', '.')).rstrip()
    
    file_path = target_dir / filename
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Created Paper note: {file_path}")
    
    # Optional: Save BibTeX to zotero-exports
    bibtex = data.get("bibtex")
    if bibtex:
        bibtex_path = VAULT_ROOT.parent / "zotero-exports" / "cortex-prime-library.bib"
        bibtex_path.parent.mkdir(exist_ok=True)
        with open(bibtex_path, 'a', encoding='utf-8') as f:
            f.write(f"\n{bibtex}\n")
        print(f"Appended BibTeX to {bibtex_path}")

def process_pdf(pdf_path):
    if not client:
        print("Error: GEMINI_API_KEY not configured.")
        return

    text = extract_text_from_pdf(pdf_path)
    if not text.strip():
        print("Error: Could not extract text from PDF.")
        return
        
    prompt = USER_PROMPT_TEMPLATE.format(text=text)
    
    print("Calling Gemini Pro API for paper analysis... This may take a while.")
    try:
        response = client.models.generate_content(
            model=GEMINI_PRO_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        
        result_text = response.text
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        data = json.loads(result_text)
        print("Parsed Paper JSON successfully.")
        
        create_paper_note(data, pdf_path)
            
    except Exception as e:
        print(f"Error calling API or parsing response: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CORTEX-PRIME Paper Deconstructor")
    parser.add_argument("pdf", help="Path to the PDF file")
    args = parser.parse_args()
    
    pdf_path = Path(args.pdf)
    if pdf_path.exists() and pdf_path.suffix.lower() == '.pdf':
        process_pdf(pdf_path)
    else:
        print(f"Error: Invalid PDF path: {pdf_path}")
