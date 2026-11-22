"""Camoufox anti-detection stealth browser tools for Kestrel Agent.

Provides first-class stealth browser automation, bypassing Cloudflare Turnstile,
Datadome, Akamai, and fingerprinting challenges using Camoufox (anti-detect Firefox).
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional

from tools.registry import registry, tool_error

logger = logging.getLogger(__name__)


def check_camoufox_requirements() -> bool:
    """True when camoufox library is installed and importable."""
    try:
        import camoufox  # noqa: F401
        return True
    except Exception:
        return False


def _clean_html_text(html: str) -> str:
    """Convert HTML into clean text with markdown-like readability."""
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "noscript", "svg"]):
            tag.decompose()
        text = soup.get_text(separator="\n")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return "\n".join(lines)
    except Exception:
        import re
        no_script = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", html, flags=re.DOTALL | re.IGNORECASE)
        no_tags = re.sub(r"<[^>]+>", " ", no_script)
        lines = [l.strip() for l in no_tags.splitlines() if l.strip()]
        return "\n".join(lines)


async def _async_camoufox_fetch(
    url: str,
    headless: bool = True,
    wait_seconds: float = 3.0,
    extract_text: bool = True,
    screenshot_path: Optional[str] = None,
    block_images: bool = False,
) -> dict[str, Any]:
    from camoufox import AsyncCamoufox

    async with AsyncCamoufox(headless=headless, block_images=block_images) as browser:
        page = await browser.new_page()
        try:
            response = await page.goto(url, wait_until="domcontentloaded", timeout=45000)
            if wait_seconds > 0:
                await asyncio.sleep(wait_seconds)

            title = await page.title()
            final_url = page.url
            status = response.status if response else 200

            screenshot_saved = None
            if screenshot_path:
                p = Path(screenshot_path).resolve()
                p.parent.mkdir(parents=True, exist_ok=True)
                await page.screenshot(path=str(p), full_page=False)
                screenshot_saved = str(p)

            content = await page.content()
            text_content = _clean_html_text(content) if extract_text else None

            cookies = await page.context.cookies()

            return {
                "url": final_url,
                "title": title,
                "status": status,
                "cookies_count": len(cookies),
                "screenshot": screenshot_saved,
                "content_preview": (text_content[:15000] if text_content else content[:15000]),
                "content_length": len(text_content or content),
            }
        finally:
            await page.close()


def camoufox_fetch_tool(
    url: str,
    headless: bool = True,
    wait_seconds: float = 3.0,
    extract_text: bool = True,
    screenshot_path: Optional[str] = None,
    block_images: bool = False,
) -> str:
    """Fetch a target URL using stealth Camoufox browser."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        result = asyncio.run(_async_camoufox_fetch(
            url=url,
            headless=headless,
            wait_seconds=wait_seconds,
            extract_text=extract_text,
            screenshot_path=screenshot_path,
            block_images=block_images,
        ))
        return json.dumps(result, indent=2, ensure_ascii=False)
    except Exception as exc:
        logger.error("camoufox_fetch failed for %s: %s", url, exc)
        return tool_error(f"Camoufox fetch error on {url}: {exc}")


CAMOUFOX_FETCH_SCHEMA = {
    "type": "function",
    "function": {
        "name": "camoufox_fetch",
        "description": (
            "Fetch an URL using the anti-detection Camoufox browser. Bypasses Cloudflare, "
            "DataDome, Akamai, and anti-bot fingerprinting challenges. Extracts clean text/HTML, "
            "cookies, and can capture screenshots."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The HTTP or HTTPS URL to navigate to.",
                },
                "headless": {
                    "type": "boolean",
                    "description": "Whether to run headless (default true).",
                    "default": True,
                },
                "wait_seconds": {
                    "type": "number",
                    "description": "Seconds to wait after DOM load for challenges / dynamic JS to settle (default 3.0).",
                    "default": 3.0,
                },
                "extract_text": {
                    "type": "boolean",
                    "description": "Whether to extract clean text/markdown instead of raw HTML (default true).",
                    "default": True,
                },
                "screenshot_path": {
                    "type": "string",
                    "description": "Optional local filesystem path to save a page screenshot (PNG).",
                },
                "block_images": {
                    "type": "boolean",
                    "description": "Block image downloads for faster loading (default false).",
                    "default": False,
                },
            },
            "required": ["url"],
        },
    },
}

registry.register(
    name="camoufox_fetch",
    toolset="camoufox",
    schema=CAMOUFOX_FETCH_SCHEMA,
    handler=lambda args, **kw: camoufox_fetch_tool(
        args.get("url", ""),
        bool(args.get("headless", True)),
        float(args.get("wait_seconds", 3.0)),
        bool(args.get("extract_text", True)),
        args.get("screenshot_path"),
        bool(args.get("block_images", False)),
    ),
    check_fn=check_camoufox_requirements,
    emoji="🦊",
    max_result_size_chars=100_000,
)
