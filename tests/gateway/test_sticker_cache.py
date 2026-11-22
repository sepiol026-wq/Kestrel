# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for gateway/sticker_cache.py — sticker description cache."""

from unittest.mock import patch

from gateway.sticker_cache import (
    _load_cache,
    get_cached_description,
    cache_sticker_description,
    build_sticker_injection,
)

class TestLoadSaveCache:

    def test_load_corrupt_file(self, tmp_path):
        bad_file = tmp_path / "bad.json"
        bad_file.write_text("not json{{{")
        with patch("gateway.sticker_cache.CACHE_PATH", bad_file):
            assert _load_cache() == {}

class TestCacheSticker:
    def test_cache_and_retrieve(self, tmp_path):
        cache_file = tmp_path / "cache.json"
        with patch("gateway.sticker_cache.CACHE_PATH", cache_file):
            cache_sticker_description("uid_1", "A happy dog", emoji="🐕", set_name="Dogs")
            result = get_cached_description("uid_1")

        assert result is not None
        assert result["description"] == "A happy dog"
        assert result["emoji"] == "🐕"
        assert result["set_name"] == "Dogs"
        assert "cached_at" in result

class TestBuildStickerInjection:

    def test_set_name_without_emoji_ignored(self):
        """set_name alone (no emoji) produces no context — only emoji+set_name triggers 'from' clause."""
        result = build_sticker_injection("A cat", set_name="MyPack")
        assert "A cat" in result
        assert "MyPack" not in result
