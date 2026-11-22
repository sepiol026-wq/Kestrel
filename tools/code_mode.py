#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Code Mode Tool — Programmatic Tool Calling (PTC) without Sandboxes.

Allows the agent to write and execute Python code directly in the local environment,
programmatically chaining tool invocations (bash, file read/write/edit, search)
in a single turn to avoid multi-roundtrip token bloat and latency.

Inspired by Cloudflare Workers Code Mode and Anthropic Claude Code's Code Mode,
running directly on the host without Docker or VM sandboxes.
"""

from __future__ import annotations

import io
import json
import logging
import os
import re
import shlex
import subprocess
import sys
import traceback
from pathlib import Path
from typing import Any, Dict, List, Optional

from tools.registry import registry, tool_error

logger = logging.getLogger(__name__)

MAX_CODE_MODE_STDOUT_BYTES = 100_000
DEFAULT_TIMEOUT_SECONDS = 120


class BashResult(dict):
    """Result of a bash execution, accessible as a dict, object attributes, or string."""
    def __init__(self, exit_code: int, stdout: str, stderr: str, success: bool):
        super().__init__(exit_code=exit_code, stdout=stdout, stderr=stderr, success=success)
        self.exit_code = exit_code
        self.stdout = stdout
        self.stderr = stderr
        self.success = success

    def __str__(self) -> str:
        return self.stdout or (self.stderr if not self.success else "")

    def strip(self, *args: Any, **kwargs: Any) -> str:
        return str(self).strip(*args, **kwargs)

    def splitlines(self, *args: Any, **kwargs: Any) -> list[str]:
        return str(self).splitlines(*args, **kwargs)


class CodeModeTools:
    """Helper namespace exposed to scripts running inside Code Mode."""

    @staticmethod
    def bash(command: str, timeout: int = 60) -> BashResult:
        """Execute a shell command in the current working directory."""
        try:
            res = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=os.getcwd(),
            )
            return BashResult(
                exit_code=res.returncode,
                stdout=res.stdout,
                stderr=res.stderr,
                success=res.returncode == 0,
            )
        except subprocess.TimeoutExpired:
            return BashResult(
                exit_code=-1,
                stdout="",
                stderr=f"Command timed out after {timeout} seconds",
                success=False,
            )
        except Exception as exc:
            return BashResult(
                exit_code=-1,
                stdout="",
                stderr=str(exc),
                success=False,
            )

    @staticmethod
    def read_file(path: str, offset: int = 0, limit: Optional[int] = None) -> str:
        """Read text from a local file with optional line offset and limit."""
        target = Path(path).resolve()
        if not target.exists():
            return f"Error: File not found: {path}"
        if not target.is_file():
            return f"Error: Path is not a file: {path}"
        try:
            with open(target, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()
            if offset > 0:
                lines = lines[offset:]
            if limit is not None:
                lines = lines[:limit]
            return "".join(lines)
        except Exception as exc:
            return f"Error reading file {path}: {exc}"

    @staticmethod
    def write_file(path: str, content: str) -> str:
        """Write content to a file, creating parent directories if needed."""
        target = Path(path).resolve()
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            with open(target, "w", encoding="utf-8") as f:
                f.write(content)
            return f"Successfully wrote {len(content)} characters to {path}"
        except Exception as exc:
            return f"Error writing file {path}: {exc}"

    @staticmethod
    def edit_file(path: str, old_string: str, new_string: str) -> str:
        """Replace occurrences of old_string with new_string in a file."""
        target = Path(path).resolve()
        if not target.exists() or not target.is_file():
            return f"Error: File not found: {path}"
        try:
            with open(target, "r", encoding="utf-8", errors="replace") as f:
                text = f.read()
            if old_string not in text:
                return f"Error: Target text not found in {path}"
            count = text.count(old_string)
            updated = text.replace(old_string, new_string)
            with open(target, "w", encoding="utf-8") as f:
                f.write(updated)
            return f"Successfully replaced {count} occurrence(s) in {path}"
        except Exception as exc:
            return f"Error editing file {path}: {exc}"

    @staticmethod
    def search_files(pattern: str, path: str = ".", max_results: int = 50) -> list[str]:
        """Find files matching a glob pattern."""
        try:
            base = Path(path).resolve()
            matches = [str(p.relative_to(base)) for p in base.rglob(pattern) if p.is_file()]
            return matches[:max_results]
        except Exception as exc:
            return [f"Error searching files: {exc}"]

    @staticmethod
    def grep(pattern: str, path: str = ".", max_matches: int = 50) -> list[dict[str, Any]]:
        """Search for a regex pattern in files under path."""
        try:
            regex = re.compile(pattern)
            results = []
            base = Path(path).resolve()
            for file_path in base.rglob("*"):
                if not file_path.is_file() or ".git" in file_path.parts:
                    continue
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        for line_num, line in enumerate(f, 1):
                            if regex.search(line):
                                results.append({
                                    "file": str(file_path.relative_to(base)),
                                    "line": line_num,
                                    "text": line.rstrip(),
                                })
                                if len(results) >= max_matches:
                                    return results
                except (OSError, UnicodeDecodeError):
                    continue
            return results
        except Exception as exc:
            return [{"error": str(exc)}]


def _handle_code_mode(code: str, timeout: Optional[int] = None, **kwargs: Any) -> str:
    """Execute Python code in Code Mode directly on the host without sandboxes."""
    if not code or not code.strip():
        return tool_error("Empty code provided to Code Mode.")

    timeout_seconds = int(timeout or DEFAULT_TIMEOUT_SECONDS)
    code_text = code.strip()

    # Shared globals for direct Python execution
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()

    tools_instance = CodeModeTools()

    local_vars: dict[str, Any] = {
        "tools": tools_instance,
        "os": os,
        "sys": sys,
        "re": re,
        "json": json,
        "Path": Path,
    }

    # Redirect stdout and stderr during execution
    old_stdout = sys.stdout
    old_stderr = sys.stderr

    try:
        sys.stdout = stdout_buf
        sys.stderr = stderr_buf

        # Execute code in local environment
        compiled = compile(code_text, "<code_mode>", "exec")
        exec(compiled, local_vars, local_vars)
    except Exception as exc:
        traceback.print_exc(file=stderr_buf)
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    stdout_val = stdout_buf.getvalue()
    stderr_val = stderr_buf.getvalue()

    output_parts = []
    if stdout_val:
        if len(stdout_val) > MAX_CODE_MODE_STDOUT_BYTES:
            stdout_val = stdout_val[:MAX_CODE_MODE_STDOUT_BYTES] + "\n... [Code Mode stdout truncated]"
        output_parts.append(stdout_val)

    if stderr_val:
        output_parts.append(f"[stderr / traceback]:\n{stderr_val}")

    if not output_parts:
        return "Script completed successfully with no output."

    return "\n".join(output_parts)


execute_code_mode = _handle_code_mode


CODE_MODE_SCHEMA = {
    "type": "object",
    "properties": {
        "code": {
            "type": "string",
            "description": (
                "Python code to execute in Code Mode without sandboxes. "
                "Available helper 'tools' has methods: "
                "tools.bash(cmd), tools.read_file(path), tools.write_file(path, content), "
                "tools.edit_file(path, old, new), tools.search_files(pattern), tools.grep(pattern)."
            ),
        },
        "timeout": {
            "type": "integer",
            "description": "Execution timeout in seconds (default: 120).",
        },
    },
    "required": ["code"],
}

# Register Code Mode tool with the tool registry
registry.register(
    name="code_mode",
    toolset="coding",
    schema=CODE_MODE_SCHEMA,
    handler=_handle_code_mode,
    check_fn=lambda: True,
    emoji="⚡",
    max_result_size_chars=MAX_CODE_MODE_STDOUT_BYTES,
    compat_args=("code", "script", "repl"),
)
