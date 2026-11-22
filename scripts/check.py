"""Run the Python code on every page of the site.

A block fenced with ```python gets a Run button on the site, so it has to work on its own. This
script runs each of those blocks and fails if one raises an error. Blocks fenced with ```py are
fragments (a single method, for example) and are skipped.

On a page with an exercise, the blocks inside the solution container must all print the same
output, because the Check button compares against the first one.

Run it from the repository root: python scripts/check.py
To check some pages only, name them: python scripts/check.py docs/trees/heap.md
"""

import re
import subprocess
import sys
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / 'docs'
BLOCK = re.compile(r'```python\n(.*?)```', re.DOTALL)


def run(code: str) -> tuple[bool, str]:
    result = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True, timeout=15)
    return result.returncode == 0, result.stdout if result.returncode == 0 else result.stderr


def check(page: Path) -> list[str]:
    parts = re.split(r'^::: details (?:Solution|Yeçim)\n', page.read_text(), maxsplit=1, flags=re.MULTILINE)
    body, solution = parts if len(parts) == 2 else (parts[0], '')
    errors = []
    for number, code in enumerate(BLOCK.findall(body), start=1):
        ok, output = run(code)
        if not ok:
            errors.append(f'block {number} failed:\n{output}')
    outputs = []
    for number, code in enumerate(BLOCK.findall(solution), start=1):
        ok, output = run(code)
        if not ok:
            errors.append(f'solution block {number} failed:\n{output}')
        outputs.append(output)
    if not errors and len(set(outputs)) > 1:
        errors.append('the solution blocks print different output')
    return errors


def main() -> int:
    only = [Path(arg).resolve() for arg in sys.argv[1:]]
    pages = sorted(page for page in DOCS.rglob('*.md') if '.vitepress' not in page.parts and (not only or page.resolve() in only))
    failed = 0
    for page in pages:
        errors = check(page)
        failed += bool(errors)
        print(f'{"FAIL" if errors else "ok  "} {page.relative_to(DOCS)}')
        for error in errors:
            print(f'     {error}')
    print(f'\n{len(pages) - failed} of {len(pages)} pages passed')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
