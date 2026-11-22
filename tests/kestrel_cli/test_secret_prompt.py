# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import pytest

from kestrel_cli.secret_prompt import _collect_masked_input, masked_secret_prompt


def _run_collect(chars: str):
    output: list[str] = []
    iterator = iter(chars)

    def read_char() -> str:
        return next(iterator, "")

    def write(text: str) -> None:
        output.append(text)

    value = _collect_masked_input(
        read_char,
        write,
        "API key: ",
    )
    return value, "".join(output)


def test_collect_masked_input_shows_feedback_without_echoing_secret():
    value, output = _run_collect("secret\n")

    assert value == "secret"
    assert output == "API key: ******\r\n"
    assert "secret" not in output




def test_collect_masked_input_raises_keyboard_interrupt():
    output: list[str] = []

    with pytest.raises(KeyboardInterrupt):
        _collect_masked_input(
            lambda: "\x03",
            output.append,
            "API key: ",
        )

    assert "".join(output) == "API key: \r\n"


def test_masked_secret_prompt_falls_back_to_getpass_for_non_tty(monkeypatch):
    class NonTty:
        def isatty(self):
            return False

    monkeypatch.setattr("sys.stdin", NonTty())
    monkeypatch.setattr("sys.stdout", NonTty())
    monkeypatch.setattr("getpass.getpass", lambda prompt: f"value from {prompt}")

    assert masked_secret_prompt("API key: ") == "value from API key: "
