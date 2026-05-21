import os
import sys
import urllib.request
import json
from pathlib import Path
from dotenv import load_dotenv

# Add scripts directory to path to import config
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

try:
    from config import VAULT_ROOT, SCRIPTS_ROOT, LOGS_ROOT, ANKI_CONNECT_URL, GEMINI_API_KEY, GEMINI_FLASH_MODEL
except ImportError:
    # Fallback values if config fails to import before setup
    VAULT_ROOT = Path(__file__).parent.parent / "vault"
    SCRIPTS_ROOT = Path(__file__).parent
    LOGS_ROOT = Path(__file__).parent.parent / "logs"
    ANKI_CONNECT_URL = "http://localhost:8765"
    GEMINI_API_KEY = None
    GEMINI_FLASH_MODEL = "gemini-2.5-flash"

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.progress import Progress
    console = Console()
except ImportError:
    # Basic print fallback if rich is not installed yet
    class Console:
        def print(self, text, style=None):
            print(text)
    console = Console()

def create_directory_structure():
    console.print("[bold blue]Step 1: Creating CORTEX-PRIME directory structure...[/bold blue]")
    
    # Core system directories
    dirs_to_create = [
        LOGS_ROOT,
        VAULT_ROOT.parent / "zotero-exports",
        VAULT_ROOT / "00-inbox",
        VAULT_ROOT / "00-inbox/_daily",
        VAULT_ROOT / "00-inbox/_quick-capture",
        VAULT_ROOT / "01-far-phy",
        VAULT_ROOT / "01-far-phy/quantum",
        VAULT_ROOT / "01-far-phy/qft",
        VAULT_ROOT / "01-far-phy/classical",
        VAULT_ROOT / "01-far-phy/simulations",
        VAULT_ROOT / "02-far-math",
        VAULT_ROOT / "02-far-math/calculus",
        VAULT_ROOT / "02-far-math/tensor",
        VAULT_ROOT / "02-far-math/probability",
        VAULT_ROOT / "02-far-math/linear-algebra",
        VAULT_ROOT / "03-far-sec",
        VAULT_ROOT / "03-far-sec/web",
        VAULT_ROOT / "03-far-sec/firmware",
        VAULT_ROOT / "03-far-sec/rf",
        VAULT_ROOT / "03-far-sec/ai-security",
        VAULT_ROOT / "04-far-ai",
        VAULT_ROOT / "04-far-ai/gpu-opencl",
        VAULT_ROOT / "04-far-ai/fine-tuning",
        VAULT_ROOT / "04-far-ai/architectures",
        VAULT_ROOT / "04-far-ai/papers",
        VAULT_ROOT / "05-far-lang",
        VAULT_ROOT / "05-far-lang/chinese",
        VAULT_ROOT / "05-far-lang/chinese/HSK4",
        VAULT_ROOT / "05-far-lang/chinese/HSK5",
        VAULT_ROOT / "05-far-lang/chinese/HSK6",
        VAULT_ROOT / "05-far-lang/english",
        VAULT_ROOT / "05-far-lang/english/academic-writing",
        VAULT_ROOT / "05-far-lang/english/vocabulary",
        VAULT_ROOT / "06-far-econ",
        VAULT_ROOT / "06-far-econ/corporate-finance",
        VAULT_ROOT / "06-far-econ/marketing",
        VAULT_ROOT / "06-far-econ/growth-models",
        VAULT_ROOT / "07-far-law",
        VAULT_ROOT / "07-far-law/international-trade",
        VAULT_ROOT / "07-far-law/ip-law",
        VAULT_ROOT / "07-far-law/corporate-law",
        VAULT_ROOT / "08-far-res",
        VAULT_ROOT / "08-far-res/literature",
        VAULT_ROOT / "09-meta",
        VAULT_ROOT / "09-meta/weekly-reviews",
        VAULT_ROOT / "09-meta/synergy-reports",
        VAULT_ROOT / "09-meta/templates"
    ]
    
    for d in dirs_to_create:
        d.mkdir(parents=True, exist_ok=True)
        console.print(f"  [green]✓[/green] Created: {d.relative_to(VAULT_ROOT.parent.parent)}")
        
    console.print("[bold green]All directories successfully created/verified.[/bold green]\n")

def test_gemini_connection():
    console.print("[bold blue]Step 2: Testing Gemini API connection...[/bold blue]")
    
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        console.print("[red]✗ Error: GEMINI_API_KEY not configured in .env file.[/red]")
        console.print("[yellow]Please obtain a free API key from https://aistudio.google.com and add it to your .env file.[/yellow]\n")
        return False
        
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        console.print(f"  Calling Gemini API using {GEMINI_FLASH_MODEL}...")
        response = client.models.generate_content(
            model=GEMINI_FLASH_MODEL,
            contents="Say 'CORTEX-PRIME online!' in a cool sci-fi tone."
        )
        
        console.print(f"  [green]✓[/green] Response: {response.text.strip()}")
        console.print("[bold green]Gemini API connection test passed.[/bold green]\n")
        return True
    except Exception as e:
        console.print(f"[red]✗ Gemini API connection failed: {e}[/red]\n")
        return False

def test_anki_connection():
    console.print("[bold blue]Step 3: Testing AnkiConnect connection...[/bold blue]")
    
    request_json = json.dumps({'action': 'deckNames', 'version': 6}).encode('utf-8')
    try:
        req = urllib.request.Request(ANKI_CONNECT_URL, request_json)
        response = json.loads(urllib.request.urlopen(req, timeout=3).read().decode('utf-8'))
        
        if response.get('error') is not None:
            raise Exception(response['error'])
            
        decks = response.get('result', [])
        console.print(f"  [green]✓[/green] Connected to Anki! Found decks: {', '.join(decks[:5])}...")
        console.print("[bold green]AnkiConnect test passed.[/bold green]\n")
        return True
    except Exception as e:
        console.print("[yellow]⚠ Warning: Could not connect to AnkiConnect.[/yellow]")
        console.print(f"  Details: {e}")
        console.print("  Make sure Anki Desktop is running and the AnkiConnect addon (ID: 2055492159) is installed.\n")
        return False

def run_setup():
    welcome_msg = """
=========================================
      CORTEX-PRIME PERSONAL OS SETUP     
=========================================
Initializing local vaults, checking AI APIs, 
and setting up environment variables.
"""
    if 'rich' in sys.modules:
        console.print(Panel(welcome_msg, style="bold cyan"))
    else:
        print(welcome_msg)
        
    create_directory_structure()
    test_gemini_connection()
    test_anki_connection()
    
    console.print("[bold cyan]CORTEX-PRIME Setup Complete![/bold cyan]")
    console.print("You can now run your personal OS modules. Check scripts/ README.md for guidelines.")

if __name__ == "__main__":
    run_setup()
