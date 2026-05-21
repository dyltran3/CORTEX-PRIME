import os
import sys
import datetime
import frontmatter
from pathlib import Path

# Load config
sys.path.append(str(Path(__file__).parent.parent))
from config import VAULT_ROOT

def load_note(file_path: Path) -> frontmatter.Post:
    """
    Reads a Markdown file and parses its frontmatter and content.
    Returns a frontmatter.Post object.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        return frontmatter.load(f)

def save_note(file_path: Path, post: frontmatter.Post):
    """
    Writes a frontmatter.Post object back to a Markdown file.
    """
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(frontmatter.dumps(post))

def update_frontmatter_field(file_path: Path, key: str, value):
    """
    Updates a specific key in the frontmatter of a markdown file.
    """
    post = load_note(file_path)
    post[key] = value
    save_note(file_path, post)

def get_vault_folder(vault_short_name: str) -> str:
    """
    Maps a short vault name or full name to the actual vault subdirectory.
    """
    mapping = {
        "phy": "01-far-phy",
        "math": "02-far-math",
        "sec": "03-far-sec",
        "ai": "04-far-ai",
        "lang": "05-far-lang",
        "econ": "06-far-econ",
        "law": "07-far-law",
        "res": "08-far-res",
        "meta": "09-meta"
    }
    name_lower = vault_short_name.lower()
    for key, folder in mapping.items():
        if key in name_lower or folder in name_lower:
            return folder
    return "00-inbox"

def render_template(template_path: Path, variables: dict) -> str:
    """
    Reads a template and replaces all occurrences of double-bracketed keys.
    e.g., {{title}} -> variables['title']
    """
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found at: {template_path}")
        
    with open(template_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    for key, value in variables.items():
        content = content.replace(f"{{{{{key}}}}}", str(value))
        
    return content

def create_note_from_template(template_name: str, vault_name: str, filename: str, variables: dict) -> Path:
    """
    Creates a new note inside the specified vault using a template.
    Returns the Path to the created note.
    """
    now = datetime.datetime.now()
    
    # Enrich default variables
    default_vars = {
        "date:YYYY": now.strftime("%Y"),
        "date:YYYY-MM-DD": now.strftime("%Y-%m-%d"),
        "timestamp": now.strftime("%H%M%S"),
    }
    # Merge default variables and user variables
    merged_vars = {**default_vars, **variables}
    
    template_path = VAULT_ROOT / "09-meta" / "templates" / template_name
    note_content = render_template(template_path, merged_vars)
    
    # Determine output folder
    vault_folder = get_vault_folder(vault_name)
    target_dir = VAULT_ROOT / vault_folder
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Safe filename sanitization
    safe_filename = "".join(c for c in filename if c.isalnum() or c in ('-', '_', '.')).rstrip()
    if not safe_filename.endswith(".md"):
        safe_filename += ".md"
        
    note_path = target_dir / safe_filename
    with open(note_path, "w", encoding="utf-8") as f:
        f.write(note_content)
        
    return note_path
