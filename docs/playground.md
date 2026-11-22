---
title: Playground
description: "Run Python in your browser: an editor for quick experiments."
---

# Playground

Use this editor to try Python examples. Press **Ctrl + Enter** or, on a Mac, **⌘ + Enter** to run the code. **Stop** ends the run and starts a new Python session.

<ClientOnly><PythonPlayground /></ClientOnly>

## Good to know

- Each run starts with fresh variables.
- The standard library is built in, so `collections`, `heapq`, `bisect` and `itertools` all work.
- The editor stops ordinary runs after 15 seconds. Package loading has a longer timeout.
- Python runs through [Pyodide](https://pyodide.org/en/stable/usage/webworker.html), inside the browser. File and network access follow the limits of that environment.
