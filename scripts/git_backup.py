import os
import sys
import subprocess
import datetime
from pathlib import Path

# Load central config
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

try:
    from config import VAULT_ROOT, LOGS_ROOT
except ImportError:
    VAULT_ROOT = Path(__file__).parent.parent / "vault"
    LOGS_ROOT = Path(__file__).parent.parent / "logs"

try:
    from rich.console import Console
    from rich.panel import Panel
    console = Console()
except ImportError:
    class Console:
        def print(self, text, style=None):
            print(text)
    console = Console()

def log_message(message: str, is_error=False, is_warning=False):
    """Prints message to console and appends to logs/git_backup.log"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_text = f"[{timestamp}] {message}"
    
    # Print to console with styling
    if is_error:
        console.print(f"[bold red]✗ {message}[/bold red]")
    elif is_warning:
        console.print(f"[yellow]⚠ {message}[/yellow]")
    else:
        console.print(f"[green]✓ {message}[/green]")
        
    # Append to log file
    LOGS_ROOT.mkdir(parents=True, exist_ok=True)
    log_file = LOGS_ROOT / "git_backup.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(log_text + "\n")

def run_git_command(args, cwd=None) -> tuple[int, str]:
    """Runs a git command and returns its return code and output."""
    try:
        # Use shell=True for Windows, run with PAGER=cat
        env = os.environ.copy()
        env["PAGER"] = "cat"
        result = subprocess.run(
            args,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True,
            env=env
        )
        return result.returncode, result.stdout.strip() + "\n" + result.stderr.strip()
    except Exception as e:
        return -1, str(e)

def perform_backup():
    project_root = VAULT_ROOT.parent.resolve()
    
    log_message(f"Starting CORTEX-PRIME Auto-Backup for: {project_root}")
    
    # 1. Check if git is installed and configured
    code, output = run_git_command(["git", "--version"], cwd=project_root)
    if code != 0:
        log_message("Git is not installed or not available in the system PATH.", is_error=True)
        return False
        
    # 2. Check if it is a git repo
    code, output = run_git_command(["git", "rev-parse", "--is-inside-work-tree"], cwd=project_root)
    if code != 0 or "true" not in output.lower():
        log_message("Not a git repository. Running 'git init' first...", is_warning=True)
        code, output = run_git_command(["git", "init"], cwd=project_root)
        if code != 0:
            log_message(f"Failed to initialize git repository: {output}", is_error=True)
            return False
            
    # 3. Check git status to see if there are any changes
    code, output = run_git_command(["git", "status", "--porcelain"], cwd=project_root)
    if code != 0:
        log_message(f"Failed to check git status: {output}", is_error=True)
        return False
        
    if not output.strip():
        log_message("No changes detected in the vault. Backup skipped.")
        return True
        
    # Log detected changes
    log_message(f"Changes detected. Files modifying:\n{output.strip()}")
    
    # 4. Stage all changes
    log_message("Staging changes...")
    code, output = run_git_command(["git", "add", "."], cwd=project_root)
    if code != 0:
        log_message(f"Failed to stage changes: {output}", is_error=True)
        return False
        
    # 5. Commit changes with timestamped message
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"CORTEX-PRIME Auto-Backup: {now_str}"
    log_message(f"Committing changes with message: '{commit_message}'")
    code, output = run_git_command(["git", "commit", "-m", commit_message], cwd=project_root)
    if code != 0:
        log_message(f"Failed to commit changes: {output}", is_error=True)
        return False
        
    # 6. Push to remote if remote exists
    code, output = run_git_command(["git", "remote"], cwd=project_root)
    if code == 0 and output.strip():
        remotes = output.strip().split()
        primary_remote = remotes[0]
        
        # Get active branch name
        code_branch, output_branch = run_git_command(["git", "branch", "--show-current"], cwd=project_root)
        branch_name = output_branch.strip() if code_branch == 0 else "main"
        
        log_message(f"Pushing to remote '{primary_remote}' branch '{branch_name}'...")
        code_push, output_push = run_git_command(["git", "push", primary_remote, branch_name], cwd=project_root)
        if code_push != 0:
            log_message(f"Failed to push to remote: {output_push}", is_warning=True)
            log_message("Backup committed locally but could not be pushed to remote (check connection or remote config).")
        else:
            log_message("Successfully pushed backup to remote repository.")
    else:
        log_message("No git remote repository configured. Backup stored locally.", is_warning=True)
        
    log_message("Backup process completed successfully.")
    return True

if __name__ == "__main__":
    perform_backup()
