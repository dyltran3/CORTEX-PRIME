import os
import sys
import click
from google import genai
from google.genai import types
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_PRO_MODEL", "gemini-1.5-pro")

console = Console()

def setup_gemini():
    if not GEMINI_API_KEY:
        console.print("[red]Error: GEMINI_API_KEY not found in .env file.[/red]")
        sys.exit(1)
    # Using the pro model for better code generation and math understanding
    return genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """You are an expert mathematician and Python developer.
Your task is to convert LaTeX mathematical formulas into executable Python code.
Output your response as a valid Python script containing a function that implements the formula.
Use `numpy` or `scipy` for numerical implementations, or `sympy` if it requires symbolic manipulation.
Always include a clear docstring explaining the parameters, return value, and the original LaTeX formula.
Do NOT output any markdown explanations outside of the code block. Only output the python code block starting with ```python.
"""

def process_latex(latex_formula: str, output_file: str = None) -> str:
    client = setup_gemini()
    prompt = f"Convert the following LaTeX formula to a Python function:\n\n{latex_formula}"
    
    with console.status("[bold blue]Analyzing LaTeX and generating Python code...[/bold blue]"):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                )
            )
            text = response.text
            
            # Extract python code block
            if "```python" in text:
                code = text.split("```python")[1].split("```")[0].strip()
            elif "```" in text:
                code = text.split("```")[1].split("```")[0].strip()
            else:
                code = text.strip()
                
            return code
        except Exception as e:
            console.print(f"[red]Error generating code: {e}[/red]")
            return None

@click.command()
@click.argument('latex', required=False)
@click.option('--file', '-f', type=click.Path(exists=True), help='Path to a markdown or text file containing LaTeX.')
@click.option('--output', '-o', type=click.Path(), help='Output Python file path to save the generated code.')
def main(latex, file, output):
    """
    CORTEX-PRIME: Convert LaTeX formulas to executable Python code.
    
    You can provide the LaTeX formula directly as an argument, or use --file to read from a file.
    """
    formula = ""
    if file:
        with open(file, 'r', encoding='utf-8') as f:
            formula = f.read()
    elif latex:
        formula = latex
    else:
        # Check if stdin has data
        if not sys.stdin.isatty():
            formula = sys.stdin.read()
        else:
            console.print("[yellow]Please provide a LaTeX formula as an argument or via --file.[/yellow]")
            sys.exit(1)
            
    if not formula.strip():
        console.print("[red]Formula is empty.[/red]")
        sys.exit(1)
        
    console.print(Panel(formula, title="Input LaTeX", border_style="blue"))
    
    python_code = process_latex(formula, output)
    
    if python_code:
        if output:
            with open(output, 'w', encoding='utf-8') as f:
                f.write(python_code)
            console.print(f"[green]Successfully saved Python code to {output}[/green]")
        else:
            console.print("\n[bold green]Generated Python Code:[/bold green]")
            console.print(Panel(python_code, border_style="green"))

if __name__ == "__main__":
    main()
