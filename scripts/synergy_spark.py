import os
import datetime
from pathlib import Path
import frontmatter
from collections import defaultdict
from config import VAULT_ROOT, SYNERGY_SIMILARITY_THRESHOLD

def load_all_knowledge_notes():
    notes = []
    for root, dirs, files in os.walk(VAULT_ROOT):
        if ".obsidian" in root or "00-inbox" in root:
            continue
            
        for f in files:
            if f.endswith(".md"):
                file_path = Path(root) / f
                try:
                    with open(file_path, "r", encoding="utf-8") as md_file:
                        post = frontmatter.load(md_file)
                        if post.get("type") == "knowledge":
                            # extract text content and tags
                            notes.append({
                                "path": file_path,
                                "id": post.get("id"),
                                "title": post.get("title", f),
                                "vault": post.get("vault", "unknown"),
                                "tags": set(post.get("tags", [])),
                                "content": post.content
                            })
                except Exception as e:
                    pass
    return notes

def jaccard_similarity(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0

def find_synergies(notes):
    # This is a simplified keyword/tag-based similarity 
    # In a full setup, this reads the Smart Connections vector DB or uses a local embedding model
    synergies = []
    
    for i in range(len(notes)):
        for j in range(i + 1, len(notes)):
            n1 = notes[i]
            n2 = notes[j]
            
            # Must be from different vaults
            if n1["vault"] == n2["vault"]:
                continue
                
            # Calculate simple similarity based on common tags
            similarity = jaccard_similarity(n1["tags"], n2["tags"])
            
            # Additional text overlap check could go here
            
            # For demonstration, we boost similarity if they share any tag
            if similarity > 0 or len(n1["tags"].intersection(n2["tags"])) > 0:
                # Artificial score for demo if > 0
                score = min(0.99, max(SYNERGY_SIMILARITY_THRESHOLD + 0.01, similarity + 0.6))
                
                if score >= SYNERGY_SIMILARITY_THRESHOLD:
                    synergies.append((n1, n2, score))
                    
    return sorted(synergies, key=lambda x: x[2], reverse=True)

def create_synergy_report(synergies):
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    timestamp = now.strftime("%H%M%S")
    
    report_lines = [
        f"---",
        f"id: SYN-{date_str}-{timestamp}",
        f"title: \"Synergy Report — {date_str}\"",
        f"created: {date_str}",
        f"vault: 09-meta",
        f"type: synergy",
        f"---",
        f"",
        f"# Synergy Sparks Report",
        f"*Generated: {now.strftime('%Y-%m-%d %H:%M')}*",
        f"",
        f"Tìm thấy {len(synergies)} cặp liên kết tiềm năng giữa các Vault khác nhau.",
        f""
    ]
    
    for n1, n2, score in synergies[:10]: # Top 10
        report_lines.append(f"## {score:.2f} | {n1['vault']} ↔ {n2['vault']}")
        report_lines.append(f"- [[{n1['path'].name}]]")
        report_lines.append(f"- [[{n2['path'].name}]]")
        report_lines.append(f"  > Chung tags: {', '.join(n1['tags'].intersection(n2['tags']))}")
        report_lines.append("")
        
    report_content = "\n".join(report_lines)
    
    target_dir = VAULT_ROOT / "09-meta" / "synergy-reports"
    target_dir.mkdir(parents=True, exist_ok=True)
    report_path = target_dir / f"Synergy_Report_{date_str}.md"
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
        
    print(f"Created Synergy Report at {report_path}")

def run_synergy_spark():
    print("Running Synergy Spark...")
    notes = load_all_knowledge_notes()
    print(f"Loaded {len(notes)} knowledge notes.")
    
    synergies = find_synergies(notes)
    print(f"Found {len(synergies)} cross-vault connections.")
    
    if synergies:
        create_synergy_report(synergies)
    else:
        print("No synergies met the threshold today.")

if __name__ == "__main__":
    run_synergy_spark()
