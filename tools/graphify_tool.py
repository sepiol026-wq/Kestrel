"""Graphify codebase knowledge graph tools for Kestrel Agent.

Provides direct structural inspection, AST symbol relations, architectural hubs,
and change impact analysis using the local graphify engine.
"""

from __future__ import annotations

import json
import logging
import os
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional

from tools.registry import registry, tool_error

logger = logging.getLogger(__name__)


def check_graphify_requirements() -> bool:
    """True when graphify executable is available in PATH."""
    return shutil.which("graphify") is not None


def graphify_tool(action: str, **kwargs: Any) -> str:
    """Execute graphify operations on the current codebase."""
    if not check_graphify_requirements():
        return tool_error("graphify CLI is not installed in PATH.")

    action = (action or "god-nodes").lower().strip()
    graph_path = kwargs.get("graph_path") or "graphify-out/graph.json"

    try:
        if action == "scan":
            project_path = kwargs.get("project_path") or "."
            max_workers = str(kwargs.get("max_workers") or "4")
            cmd = ["graphify", "extract", project_path, "--code-only", "--max-workers", max_workers]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
            if res.returncode != 0:
                return tool_error(f"graphify extract failed: {res.stderr or res.stdout}")
            
            # Follow with cluster-only
            sub_res = subprocess.run(["graphify", "cluster-only", project_path, "--no-label"],
                                     capture_output=True, text=True, timeout=60)
            return (
                f"Graphify scan complete for {project_path}.\n"
                f"Generated graph: graphify-out/graph.json\n"
                f"Report: graphify-out/GRAPH_REPORT.md\n"
                f"{sub_res.stdout[:500]}"
            )

        elif action == "god-nodes":
            top = str(kwargs.get("top") or "10")
            cmd = ["graphify", "god-nodes", "--top", top, "--json"]
            if os.path.exists(graph_path):
                cmd.extend(["--graph", graph_path])
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return res.stdout or res.stderr or "No architectural hubs found."

        elif action == "explain":
            symbol = kwargs.get("symbol", "").strip()
            if not symbol:
                return tool_error("Action 'explain' requires a 'symbol' parameter.")
            cmd = ["graphify", "explain", symbol]
            if os.path.exists(graph_path):
                cmd.extend(["--graph", graph_path])
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return res.stdout or res.stderr or f"No graph node found for symbol: {symbol}"

        elif action == "affected":
            symbol = kwargs.get("symbol", "").strip()
            if not symbol:
                return tool_error("Action 'affected' requires a 'symbol' parameter.")
            depth = str(kwargs.get("depth") or "2")
            cmd = ["graphify", "affected", symbol, "--depth", depth]
            if os.path.exists(graph_path):
                cmd.extend(["--graph", graph_path])
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return res.stdout or res.stderr or f"No affected nodes found for symbol: {symbol}"

        elif action == "path":
            node_a = kwargs.get("node_a", "").strip()
            node_b = kwargs.get("node_b", "").strip()
            if not node_a or not node_b:
                return tool_error("Action 'path' requires 'node_a' and 'node_b' parameters.")
            cmd = ["graphify", "path", node_a, node_b]
            if os.path.exists(graph_path):
                cmd.extend(["--graph", graph_path])
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return res.stdout or res.stderr or f"No path found between {node_a} and {node_b}"

        elif action == "query":
            question = kwargs.get("question", "").strip()
            if not question:
                return tool_error("Action 'query' requires a 'question' parameter.")
            budget = str(kwargs.get("budget") or "2000")
            cmd = ["graphify", "query", question, "--budget", budget]
            if os.path.exists(graph_path):
                cmd.extend(["--graph", graph_path])
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return res.stdout or res.stderr or "No query results returned from graph."

        else:
            return tool_error(f"Unknown graphify action: {action}. Expected: scan, god-nodes, explain, affected, path, query.")

    except Exception as exc:
        logger.error("graphify action %s failed: %s", action, exc)
        return tool_error(f"Graphify error ({action}): {exc}")


GRAPHIFY_SCHEMA = {
    "type": "function",
    "function": {
        "name": "graphify",
        "description": (
            "Inspect codebase architecture, symbol connections, dependency hubs, and change impact "
            "using Graphify knowledge graphs. Use 'scan' to index code AST, 'god-nodes' to find core hubs, "
            "'explain' to analyze a function/class and its callers/callees, 'affected' for impact analysis, "
            "or 'query' for natural-language architecture graph traversal."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["scan", "god-nodes", "explain", "affected", "path", "query"],
                    "description": "Graphify operation to execute.",
                },
                "symbol": {
                    "type": "string",
                    "description": "Symbol, function, or class name (required for explain, affected).",
                },
                "node_a": {
                    "type": "string",
                    "description": "First node name (for path action).",
                },
                "node_b": {
                    "type": "string",
                    "description": "Second node name (for path action).",
                },
                "question": {
                    "type": "string",
                    "description": "Natural language architectural question (for query action).",
                },
                "graph_path": {
                    "type": "string",
                    "description": "Optional path to existing graph.json (default graphify-out/graph.json).",
                },
                "depth": {
                    "type": "integer",
                    "description": "Reverse traversal depth for affected action (default 2).",
                    "default": 2,
                },
                "top": {
                    "type": "integer",
                    "description": "Number of top nodes for god-nodes action (default 10).",
                    "default": 10,
                },
            },
            "required": ["action"],
        },
    },
}

registry.register(
    name="graphify",
    toolset="coding",
    schema=GRAPHIFY_SCHEMA,
    handler=lambda args, **kw: graphify_tool(
        args.get("action", "god-nodes"),
        symbol=args.get("symbol", ""),
        node_a=args.get("node_a", ""),
        node_b=args.get("node_b", ""),
        question=args.get("question", ""),
        graph_path=args.get("graph_path"),
        depth=args.get("depth", 2),
        top=args.get("top", 10),
    ),
    check_fn=check_graphify_requirements,
    emoji="🕸️",
    max_result_size_chars=100_000,
)
