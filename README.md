# Kestrel Agent ✻

<p align="center">
  <img src="assets/banner.png" alt="Kestrel Agent" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPLv3-0284C7?style=for-the-badge" alt="License: AGPLv3"></a>
  <a href="#"><img src="https://img.shields.io/badge/Interface-Native%20Cyan%20TUI-38BDF8?style=for-the-badge" alt="Cyan TUI"></a>
  <a href="#"><img src="https://img.shields.io/badge/Code%20Mode-Host%20Direct%20(Zero%20Sandbox)-34D399?style=for-the-badge" alt="Code Mode"></a>
  <a href="#"><img src="https://img.shields.io/badge/Gateway-Goygram%20%2F%20Telegram-0284C7?style=for-the-badge" alt="Goygram Telegram Gateway"></a>
</p>

**Kestrel Agent** is an autonomous AI agent for hacking: penetration testing,
red teaming, vulnerability research, reverse engineering and hard systems work.
You point it at a target, a repository or a broken machine; it reconnoitres,
forms a hypothesis, runs the commands, checks the result against reality, and
keeps going until the job is actually done. It lives in the terminal, in a shell
next to your editor and in Telegram, and it does the work instead of describing
the work.

This is not a chat wrapper around a model. It is an operator: shell and file
system on the host, a browser that survives anti-bot walls, a knowledge graph of
whatever codebase you give it, and a skill library of field-tested tradecraft it
loads on demand.

---

## What it actually does

| Domain | What Kestrel does |
| --- | --- |
| **Recon** | Port and service discovery, banner fingerprinting, certificate and DNS enumeration, masscan/zmap sweeps, host inventory that separates real machines from honeypots |
| **Pentesting** | Web and API testing, authentication and access-control review, CVE-driven exploitation, privilege escalation, container and orchestrator escapes |
| **Red teaming** | Credential and pivot planning, Active Directory and lateral movement, covert persistence, log and artefact hygiene |
| **Reverse engineering** | Binary inspection, disassembly and debugging sessions, protocol and file-format reconstruction, APK and firmware work |
| **Vulnerability research** | Codebase audits driven by an AST dependency graph, data-flow reasoning, proof-of-concept construction and reproduction |
| **Ops** | Service deployment, host hardening, disk and process forensics, incident cleanup, monitoring and cron upkeep |

Every path runs through the same loop: the agent reads real output, not
plausible-looking text. When a command fails it fixes the command; when a result
is suspicious it double-checks it; when a claim cannot be verified it says so.

## Capabilities

### Autonomous execution loop
Every turn can plan, act, observe and correct without asking permission after
each step. Long jobs — a scan, a build, a migration, a hunt — keep running in
the background, report progress while they work, and come back with the finished
result instead of a status message.

### Native terminal UI
A low-latency TUI in electric cyan with a compact Cyber Falcon mascot, live turn
commentary and one key to every mode. Startup under 50 ms.

### Host-direct Code Mode
Multi-step work collapses into one Python script executed on the host instead of
a dozen round-trips: read files, patch them, run builds, drive pipelines,
transform data, all in a single call. Toggle with `/codemode`.

### Browser that does not fold
An integrated stealth browser (Camoufox) with humanised input, so pages behind
Cloudflare, DataDome, Akamai and similar walls open instead of returning a
challenge page. It is one tool among many, not a trick: no faked User-Agent
strings, no header games. When a page decides by JavaScript, the browser runs the
JavaScript; when it does not, Kestrel uses a CLI and the answer is faster.

### Hacker toolbox
The agent drives ordinary Unix security tools through the shell and knows which
one fits which job — ports and services (`nmap`, `masscan`, `naabu`), web
(`ffuf`, `feroxbuster`, `whatweb`, `nuclei`, `wpscan`, `nikto`, `sqlmap`,
`katana`), credential work (`hydra`, `medusa`, `john`, `hashcat`, `sshpass`),
tunnels and pivots (`ssh -D/-L/-R`, `proxychains4`, `socat`), packet truth
(`tcpdump`, `tshark`), Active Directory (`netexec`, `impacket`), and container
runtimes (`docker`, `kubectl`, `nomad`, `crictl`). The full map, including what to
install and when to skip it, ships as the `security-toolbox` skill; run
`scripts/kestrel-tools-check.sh` to see what is already on a host.

### Codebase knowledge graph
Structural analysis of a repository — modules, symbols, dependency edges, hub
("god") nodes and change-impact traversal. It gives penetration testing and code
review the map a senior engineer carries in their head.

### Telegram gateway
Native MTProto transport (Goygram) instead of HTTP polling: instant delivery,
rich messages, media and artefacts, session recovery across restarts. The agent
is reachable from a phone and behaves exactly as in the terminal.

### Skills
Procedural knowledge as loadable files: pentest suites, CVE playbooks, Android
reverse engineering, browser automation, deployment recipes, document pipelines,
and the field-tested security skills shipped with this repository:

- `node-hunting-at-scale` — where real hosts come from, how to sweep provider
  ranges, how to gate candidates before trusting them.
- `honeypot-farm-detection` — separating a real daemon from an imitation that
  only answers.
- `anonymous-service-to-root` — turning a no-auth service or a CVE into a root
  shell, ordered by conversion rate.
- `covert-node-persistence` — relay access, hidden files and processes, session
  accounting, cover story.

Skills are plain markdown; write your own and the agent picks them up on
`/reload skills`.

## Installation

### Linux, macOS & WSL2

```bash
curl -fsSL https://raw.githubusercontent.com/sepiol026-wq/Kestrel/main/scripts/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/sepiol026-wq/Kestrel/main/scripts/install.ps1 | iex
```

### From Source

```bash
git clone https://github.com/sepiol026-wq/Kestrel.git
cd Kestrel
./scripts/install.sh
```

## Quickstart

```bash
# interactive terminal session
kestrel chat

# one-shot task
kestrel chat -q "audit this repository and run the test suite"

# telegram / goygram gateway
kestrel gateway run

# version and runtime diagnostics
kestrel --version
```

Requirements: Linux or macOS, Python 3.11+, and a model endpoint (local or
hosted). Optional: Docker for container work, a stealth browser binary for
anti-bot pages.

## Commands

| Command | Purpose |
| --- | --- |
| `/codemode` | Toggle host-direct code execution |
| `/model` | Select a model or a custom endpoint |
| `/reload [all\|mcp\|skills\|env]` | Refresh tools, skills and environment |
| `/clear` | Reset the conversation |
| `/help` | Full command reference |

## Scope and intent

Kestrel is built for people who work on systems they own or are authorised to
test: their own servers, their clients' infrastructure, their own code. It is a
tool — judgement about what to point it at stays with the operator. The skills in
this repository encode technique, not permission.

## Attribution

Kestrel Agent is an independent fork and derivative work built upon Kestrel Agent
and Qwerty by Nous Research Inc. and community contributors. All original rights,
contributor attribution and upstream MIT license grants are retained pursuant to
17 U.S.C. § 1202. See [NOTICE](NOTICE) for provenance.

## License

GNU Affero General Public License v3 (AGPL-3.0). See [LICENSE](LICENSE).
