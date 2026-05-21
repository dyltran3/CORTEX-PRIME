import os
import sys
import datetime
from pathlib import Path
import frontmatter

# Load config
sys.path.append(str(Path(__file__).parent.parent))
from config import VAULT_ROOT

def scan_vault(types_filter=None, status_filter=None, energy_filter=None, skip_dirs=None):
    """
    Scans the Obsidian vault for markdown files and parses their metadata.
    Returns a list of parsed notes.
    """
    if skip_dirs is None:
        skip_dirs = [".obsidian", "00-inbox"]
        
    notes = []
    
    for root, dirs, files in os.walk(VAULT_ROOT):
        # Skip designated directories
        if any(skip_dir in root for skip_dir in skip_dirs):
            continue
            
        for f in files:
            if f.endswith(".md"):
                file_path = Path(root) / f
                try:
                    with open(file_path, "r", encoding="utf-8") as md_file:
                        post = frontmatter.load(md_file)
                        
                        # Apply filters
                        if types_filter and post.get("type") not in types_filter:
                            continue
                        if status_filter and post.get("status") not in status_filter:
                            continue
                        if energy_filter and post.get("energy") not in energy_filter:
                            continue
                            
                        notes.append({
                            "path": file_path,
                            "filename": f,
                            "metadata": post.metadata,
                            "content": post.content,
                            "title": post.get("title", f.replace(".md", "")),
                            "vault": post.get("vault", "unknown"),
                            "tags": post.get("tags", []),
                            "type": post.get("type", "unknown"),
                            "status": post.get("status", "unknown"),
                            "energy": post.get("energy", "shallow"),
                            "created": post.get("created"),
                            "modified": post.get("modified")
                        })
                except Exception as e:
                    # Ignore parsing/reading errors for individual corrupted/unformatted files
                    pass
                    
    return notes

def get_recent_notes(limit=10):
    """
    Returns the most recently modified markdown files in the vault.
    """
    notes = scan_vault(skip_dirs=[".obsidian"])
    
    # Try to sort by modified date in metadata, fallback to system modification time
    def get_sort_key(note):
        mod = note["metadata"].get("modified")
        if isinstance(mod, datetime.date):
            return datetime.datetime.combine(mod, datetime.time.min)
        elif isinstance(mod, datetime.datetime):
            return mod
        # Fallback to filesystem mtime
        try:
            return datetime.datetime.fromtimestamp(note["path"].stat().st_mtime)
        except Exception:
            return datetime.datetime.min
            
    notes.sort(key=get_sort_key, reverse=True)
    return notes[:limit]

def get_vault_activity_stats(days=7):
    """
    Collects deep/shallow work stats for the past X days.
    """
    now = datetime.datetime.now()
    activity = {}
    
    for i in range(days):
        d = (now - datetime.timedelta(days=i)).strftime("%Y-%m-%d")
        activity[d] = {"deep": 0, "shallow": 0, "total": 0}
        
    notes = scan_vault(skip_dirs=[".obsidian", "00-inbox"])
    
    for note in notes:
        created = note.get("created")
        if not created:
            continue
            
        if isinstance(created, datetime.date):
            created_str = created.strftime("%Y-%m-%d")
        elif isinstance(created, datetime.datetime):
            created_str = created.strftime("%Y-%m-%d")
        elif isinstance(created, str):
            created_str = created.split("T")[0]
        else:
            continue
            
        if created_str in activity:
            energy = str(note.get("energy", "shallow")).lower()
            activity[created_str]["total"] += 1
            if "deep" in energy:
                activity[created_str]["deep"] += 1
            else:
                activity[created_str]["shallow"] += 1
                
    return activity
