import os
import sys
import json
import math
import datetime
from pathlib import Path
import frontmatter

# Add scripts directory to path to import helpers
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from config import VAULT_ROOT, SYNERGY_SIMILARITY_THRESHOLD, LOGS_ROOT

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    console = Console()
except ImportError:
    class Console:
        def print(self, text, style=None):
            print(text)
    console = Console()

# Try importing gemini client
has_gemini = False
gemini_client = None
try:
    from utils.gemini_client import get_gemini_client
    gemini_client = get_gemini_client()
    has_gemini = True
except Exception as e:
    console.print(f"[yellow]⚠ Could not initialize Gemini Client for semantic embeddings. Fallback to Tag Jaccard similarity active. Details: {e}[/yellow]")

CACHE_PATH = LOGS_ROOT / "embeddings_cache.json"

def load_embeddings_cache():
    if CACHE_PATH.exists():
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_embeddings_cache(cache):
    LOGS_ROOT.mkdir(parents=True, exist_ok=True)
    try:
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        console.print(f"[yellow]⚠ Failed to save embeddings cache: {e}[/yellow]")

def load_all_knowledge_notes():
    notes = []
    for root, dirs, files in os.walk(VAULT_ROOT):
        # Exclude meta, inbox, and hidden folders
        if ".obsidian" in root or "00-inbox" in root or "09-meta" in root:
            continue
            
        for f in files:
            if f.endswith(".md"):
                file_path = Path(root) / f
                try:
                    with open(file_path, "r", encoding="utf-8") as md_file:
                        post = frontmatter.load(md_file)
                        if post.get("type") == "knowledge":
                            notes.append({
                                "path": file_path,
                                "id": post.get("id"),
                                "title": post.get("title", f.replace(".md", "")),
                                "vault": post.get("vault", file_path.parent.name),
                                "tags": set(post.get("tags", [])),
                                "content": post.content.strip()
                            })
                except Exception:
                    pass
    return notes

def cosine_similarity(v1, v2):
    dot_product = sum(x * y for x, y in zip(v1, v2))
    magnitude1 = math.sqrt(sum(x * x for x in v1))
    magnitude2 = math.sqrt(sum(x * x for x in v2))
    return dot_product / (magnitude1 * magnitude2) if (magnitude1 * magnitude2) > 0 else 0

def jaccard_similarity(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0

def get_note_embeddings(notes):
    """
    Retrieves embeddings for all notes, using the local cache to avoid API calls for unchanged files.
    """
    if not has_gemini or not gemini_client:
        return {}

    cache = load_embeddings_cache()
    embeddings = {}
    cache_updated = False
    
    console.print(f"Retrieving semantic embeddings for {len(notes)} knowledge notes...")
    for note in notes:
        note_path_str = str(note["path"].resolve())
        mtime = note["path"].stat().st_mtime
        
        # Check cache validity
        if note_path_str in cache and cache[note_path_str].get("mtime") == mtime:
            embeddings[note_path_str] = cache[note_path_str]["embedding"]
        else:
            # Generate new embedding
            text_to_embed = f"Title: {note['title']}\nContent: {note['content']}"
            try:
                # Limit length to avoid massive prompt embedding issues
                text_to_embed = text_to_embed[:4000]
                vector = gemini_client.get_embedding(text_to_embed)
                embeddings[note_path_str] = vector
                
                # Update cache
                cache[note_path_str] = {
                    "mtime": mtime,
                    "embedding": vector
                }
                cache_updated = True
                console.print(f"  [green]✓[/green] Computed embedding for: {note['title']}")
            except Exception as e:
                console.print(f"  [red]✗[/red] Failed to embed '{note['title']}': {e}")
                
    if cache_updated:
        save_embeddings_cache(cache)
        
    return embeddings

def find_synergies(notes, embeddings):
    synergies = []
    
    is_semantic = len(embeddings) > 0
    if is_semantic:
        console.print("[bold green]Comparing notes using Cosine Similarity of Gemini Embeddings...[/bold green]")
    else:
        console.print("[bold yellow]Comparing notes using Jaccard Similarity of tags (fallback)...[/bold yellow]")

    for i in range(len(notes)):
        for j in range(i + 1, len(notes)):
            n1 = notes[i]
            n2 = notes[j]
            
            # Must be from different vaults
            if n1["vault"] == n2["vault"]:
                continue
                
            n1_path = str(n1["path"].resolve())
            n2_path = str(n2["path"].resolve())
            
            if is_semantic and n1_path in embeddings and n2_path in embeddings:
                # Use Cosine Similarity
                score = cosine_similarity(embeddings[n1_path], embeddings[n2_path])
                method = "semantic"
            else:
                # Fallback to Jaccard similarity based on tags
                jaccard = jaccard_similarity(n1["tags"], n2["tags"])
                # Artificially boost fallback to match the scale of cosine similarity if they share tags
                if jaccard > 0:
                    score = min(0.95, max(SYNERGY_SIMILARITY_THRESHOLD + 0.05, jaccard + 0.6))
                elif len(n1["tags"].intersection(n2["tags"])) > 0:
                    score = SYNERGY_SIMILARITY_THRESHOLD + 0.01
                else:
                    score = 0.0
                method = "jaccard"
                
            if score >= SYNERGY_SIMILARITY_THRESHOLD:
                synergies.append((n1, n2, score, method))
                
    return sorted(synergies, key=lambda x: x[2], reverse=True)

def create_synergy_report(synergies):
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    timestamp = now.strftime("%H%M%S")
    
    report_lines = [
        "---",
        f"id: SYN-{date_str}-{timestamp}",
        f"title: \"Synergy Sparks Report — {date_str}\"",
        f"created: {date_str}",
        "vault: 09-meta",
        "type: synergy",
        "tags: [synergy, meta]",
        "---",
        "",
        "# Synergy Sparks Report 🧠⚡",
        f"*Generated: {now.strftime('%Y-%m-%d %H:%M')}*",
        "",
        f"Tìm thấy **{len(synergies)}** liên kết tri thức tiềm năng chéo giữa các Vault chuyên biệt.",
        ""
    ]
    
    if len(synergies) > 0:
        report_lines.append("## Các liên kết tương đồng cao nhất")
        report_lines.append("")
        
        for n1, n2, score, method in synergies[:15]: # Show top 15
            method_str = "🧠 Định nghĩa Ngữ nghĩa (Gemini Embeddings)" if method == "semantic" else "🏷 Trùng lặp Nhãn (Tag Jaccard)"
            
            report_lines.append(f"### {score:.2%} | {n1['vault']} ↔ {n2['vault']}")
            report_lines.append(f"- Ghi chú 1: [[{n1['path'].name}]] (Lĩnh vực: `{n1['vault']}`)")
            report_lines.append(f"- Ghi chú 2: [[{n2['path'].name}]] (Lĩnh vực: `{n2['vault']}`)")
            report_lines.append(f"- Cơ sở đánh giá: {method_str}")
            
            common_tags = n1["tags"].intersection(n2["tags"])
            if common_tags:
                report_lines.append(f"- Nhãn chung: {', '.join([f'`#{t}`' for t in common_tags])}")
                
            # Content snippet
            report_lines.append("  > [!NOTE]")
            report_lines.append(f"  > **Ghi chú 1 ({n1['title']}):** {n1['content'][:200]}...")
            report_lines.append(f"  > **Ghi chú 2 ({n2['title']}):** {n2['content'][:200]}...")
            report_lines.append("")
    else:
        report_lines.append("> [!INFO]")
        report_lines.append("> Hôm nay hệ thống không phát hiện mối liên kết chéo nào vượt qua ngưỡng tương đồng thiết lập.")
        
    report_content = "\n".join(report_lines)
    
    target_dir = VAULT_ROOT / "09-meta" / "synergy-reports"
    target_dir.mkdir(parents=True, exist_ok=True)
    report_path = target_dir / f"Synergy_Report_{date_str}.md"
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
        
    return report_path

def run_synergy_spark():
    welcome_msg = """
=========================================
          SYNERGY SPARK ENGINE           
=========================================
Scanning knowledge vaults, mapping concepts,
and discovering hidden cross-domain links.
"""
    console.print(Panel(welcome_msg, style="bold magenta"))
    
    notes = load_all_knowledge_notes()
    console.print(f"Loaded [bold]{len(notes)}[/bold] knowledge notes from specialists vaults.")
    
    if len(notes) < 2:
        console.print("[yellow]⚠ Not enough knowledge notes to calculate cross-vault connections.[/yellow]")
        return
        
    embeddings = {}
    if has_gemini and gemini_client:
        try:
            embeddings = get_note_embeddings(notes)
        except Exception as e:
            console.print(f"[yellow]⚠ Error generating embeddings: {e}. Falling back to Jaccard tag similarity.[/yellow]")
            
    synergies = find_synergies(notes, embeddings)
    console.print(f"Found [bold green]{len(synergies)}[/bold green] connections above threshold ({SYNERGY_SIMILARITY_THRESHOLD:.2%}).")
    
    if synergies:
        report_path = create_synergy_report(synergies)
        
        # Display top synergies in a table
        table = Table(title="Top Synergy Sparks")
        table.add_column("Score", justify="right", style="cyan", no_wrap=True)
        table.add_column("Vault 1", style="magenta")
        table.add_column("Note 1", style="white")
        table.add_column("Vault 2", style="magenta")
        table.add_column("Note 2", style="white")
        table.add_column("Method", style="green")
        
        for n1, n2, score, method in synergies[:5]:
            table.add_row(
                f"{score:.2%}",
                n1["vault"],
                n1["title"][:20],
                n2["vault"],
                n2["title"][:20],
                method
            )
        console.print(table)
        console.print(f"\n[bold green]✓[/bold green] Synergy Report successfully generated at: [blue]{report_path}[/blue]")
    else:
        console.print("[yellow]No sparks found above threshold today.[/yellow]")

if __name__ == "__main__":
    run_synergy_spark()
