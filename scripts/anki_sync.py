import os
import re
import json
import urllib.request
import frontmatter
from pathlib import Path
from config import VAULT_ROOT, ANKI_CONNECT_URL, ANKI_DEFAULT_DECK

def invoke_anki(action, **params):
    request_json = json.dumps({'action': action, 'params': params, 'version': 6}).encode('utf-8')
    try:
        req = urllib.request.Request(ANKI_CONNECT_URL, request_json)
        response = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        if len(response) != 2:
            raise Exception('response has an unexpected number of fields')
        if 'error' not in response:
            raise Exception('response is missing required error field')
        if 'result' not in response:
            raise Exception('response is missing required result field')
        if response['error'] is not None:
            raise Exception(response['error'])
        return response['result']
    except urllib.error.URLError as e:
        print(f"Failed to connect to AnkiConnect: {e}. Is Anki running with AnkiConnect installed?")
        return None
    except Exception as e:
        print(f"AnkiConnect error: {e}")
        return None

def extract_flashcards(content):
    # Matches blocks like:
    # > #flashcard
    # > **Q:** Question?
    # > **A:** Answer.
    pattern = re.compile(r'>\s*#flashcard\s*\n>\s*\*\*Q:\*\*\s*(.*?)\n>\s*\*\*A:\*\*\s*(.*?)(?=\n>|$)', re.IGNORECASE | re.DOTALL)
    cards = []
    for match in pattern.finditer(content):
        cards.append({
            "q": match.group(1).strip(),
            "a": match.group(2).strip()
        })
    return cards

def sync_cards():
    print("Starting Anki Sync...")
    
    # Ensure deck exists
    decks = invoke_anki('deckNames')
    if decks is not None and ANKI_DEFAULT_DECK not in decks:
        invoke_anki('createDeck', deck=ANKI_DEFAULT_DECK)
        print(f"Created Anki deck: {ANKI_DEFAULT_DECK}")

    updated_notes = 0
    
    for root, dirs, files in os.walk(VAULT_ROOT):
        if ".obsidian" in root:
            continue
            
        for f in files:
            if f.endswith(".md"):
                file_path = Path(root) / f
                try:
                    with open(file_path, "r", encoding="utf-8") as md_file:
                        post = frontmatter.load(md_file)
                        
                    status = post.get("status")
                    if status != "acquired":
                        continue # Only process new notes
                        
                    content = post.content
                    cards = extract_flashcards(content)
                    
                    if not cards:
                        continue
                        
                    anki_note_ids = []
                    for card in cards:
                        # Create card in Anki
                        anki_note = {
                            "deckName": ANKI_DEFAULT_DECK,
                            "modelName": "Basic",
                            "fields": {
                                "Front": card["q"],
                                "Back": f"{card['a']}<br><br><small>Source: {f}</small>"
                            },
                            "options": {
                                "allowDuplicate": False
                            },
                            "tags": [post.get("vault", "unknown")]
                        }
                        
                        note_id = invoke_anki('addNote', note=anki_note)
                        if note_id:
                            anki_note_ids.append(note_id)
                            
                    if anki_note_ids:
                        print(f"Added {len(anki_note_ids)} cards from {f}")
                        post["status"] = "reviewing"
                        if not post.get("anki_id"):
                            post["anki_id"] = anki_note_ids[0]
                            
                        with open(file_path, "w", encoding="utf-8") as md_file:
                            md_file.write(frontmatter.dumps(post))
                        updated_notes += 1
                        
                except Exception as e:
                    print(f"Error processing {f}: {e}")
                    
    print(f"Sync complete. Updated {updated_notes} notes in vault.")

if __name__ == "__main__":
    sync_cards()
