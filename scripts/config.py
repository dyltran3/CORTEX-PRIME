import os
from pathlib import Path
from dotenv import load_dotenv

# Find the .env file in the root directory
current_dir = Path(__file__).parent
root_dir = current_dir.parent
load_dotenv(root_dir / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_FLASH_MODEL = os.getenv("GEMINI_FLASH_MODEL", "gemini-1.5-flash")
GEMINI_PRO_MODEL = os.getenv("GEMINI_PRO_MODEL", "gemini-1.5-pro")

VAULT_ROOT = Path(os.getenv("VAULT_ROOT", root_dir / "vault")).resolve()
SCRIPTS_ROOT = Path(os.getenv("SCRIPTS_ROOT", root_dir / "scripts")).resolve()
LOGS_ROOT = Path(os.getenv("LOGS_ROOT", root_dir / "logs")).resolve()

BURNOUT_DEEPWORK_THRESHOLD = float(os.getenv("BURNOUT_DEEPWORK_THRESHOLD", 0.4))
BURNOUT_CHECK_DAYS = int(os.getenv("BURNOUT_CHECK_DAYS", 3))
SYNERGY_SIMILARITY_THRESHOLD = float(os.getenv("SYNERGY_SIMILARITY_THRESHOLD", 0.75))

ANKI_CONNECT_URL = os.getenv("ANKI_CONNECT_URL", "http://localhost:8765")
ANKI_DEFAULT_DECK = os.getenv("ANKI_DEFAULT_DECK", "CORTEX-PRIME")
