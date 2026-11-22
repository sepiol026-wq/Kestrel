#!/usr/bin/env bash
# Provision a working offensive-security toolchain. Idempotent; safe to re-run.
#   ./install-security-toolbox.sh          install everything possible
#   ./install-security-toolbox.sh --check  only report what is present
set -u

CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

have() { command -v "$1" >/dev/null 2>&1; }
say()  { printf '%s\n' "$*"; }

APT_TOOLS="nmap masscan nikto whatweb sqlmap hydra medusa john hashcat sshpass proxychains4 \
tcpdump tshark socat netcat-openbsd jq ripgrep dnsutils whois unzip curl git python3-pip pipx \
gobuster ffuf feroxbuster"
GO_TOOLS="github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest \
github.com/projectdiscovery/httpx/cmd/httpx@latest \
github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest \
github.com/projectdiscovery/naabu/v2/cmd/naabu@latest \
github.com/projectdiscovery/dnsx/cmd/dnsx@latest \
github.com/projectdiscovery/katana/cmd/katana@latest \
github.com/projectdiscovery/notify/cmd/notify@latest \
github.com/tomnomnom/waybackurls@latest \
github.com/lc/gau/v2/cmd/gau@latest \
github.com/ffuf/ffuf/v2@latest"
PIPX_TOOLS="netexec impacket"

missing_apt=""; missing_go=""; missing_pipx=""
for t in $APT_TOOLS; do have "$t" || missing_apt="$missing_apt $t"; done
for t in nuclei httpx subfinder naabu dnsx katana gau waybackurls ffuf; do have "$t" || missing_go="$missing_go $t"; done
for t in nxc netexec impacket-smbserver; do have "$t" || missing_pipx="$missing_pipx $t"; done

say "== present =="
for t in nmap masscan naabu ffuf gobuster feroxbuster nikto whatweb wpscan nuclei httpx \
         subfinder amass dnsx katana gau waybackurls sqlmap hydra medusa john hashcat sshpass \
         proxychains4 nxc netexec tcpdump tshark nc socat openssl jq rg python3 go docker; do
    have "$t" && say "  ok   $t"
done

say "== missing =="
say "  apt :${missing_apt:- none}"
say "  go  :${missing_go:- none}"
say "  pipx:${missing_pipx:- none}"

[ "$CHECK_ONLY" = 1 ] && exit 0

SUDO=""
if [ "$(id -u)" != 0 ]; then have sudo && SUDO="sudo"; fi
PKG=""
have apt-get && PKG="apt-get"
have dnf && PKG="dnf"
have pacman && PKG="pacman"
have apk && PKG="apk"

if [ -n "$missing_apt" ] && [ -n "$PKG" ] && { [ -n "$SUDO" ] || [ "$(id -u)" = 0 ]; }; then
    say "== installing system packages via $PKG =="
    case "$PKG" in
        apt-get) $SUDO apt-get update -qq && $SUDO apt-get install -y -qq $missing_apt ;;
        dnf)     $SUDO dnf install -y $missing_apt ;;
        pacman)  $SUDO pacman -S --needed --noconfirm nmap masscan nikto sqlmap hydra john hashcat \
                     sshpass proxychains-ng tcpdump wireshark-cli socat openbsd-netcat jq ripgrep \
                     bind whois unzip curl git python-pipx gobuster ffuf 2>/dev/null || true ;;
        apk)     $SUDO apk add --no-cache nmap masscan sqlmap hydra john hashcat sshpass tcpdump \
                     socat netcat-openbsd jq ripgrep bind-tools whois unzip curl git 2>/dev/null || true ;;
    esac
else
    say "== no package manager usable, skipping system packages =="
fi

BIN="$HOME/.local/bin"
mkdir -p "$BIN"
case ":$PATH:" in *":$BIN:"*) ;; *) say "note: add $BIN to PATH";; esac

if have go && [ -n "$missing_go" ]; then
    say "== installing Go tools into $BIN =="
    for m in $GO_TOOLS; do
        name=$(printf '%s' "$m" | sed 's#.*/##; s#@.*##')
        have "$name" && continue
        say "  go install $m"
        GOBIN="$BIN" go install "$m" >/dev/null 2>&1 || say "  failed: $m"
    done
elif [ -n "$missing_go" ]; then
    say "== go not installed: skipping $missing_go =="
    say "   install Go from https://go.dev/dl/ and re-run for nuclei/httpx/subfinder/naabu/dnsx/katana/gau"
fi

if have pipx && [ -n "$missing_pipx" ]; then
    say "== installing python tools via pipx =="
    for p in $PIPX_TOOLS; do
        pipx install "$p" >/dev/null 2>&1 || pipx upgrade "$p" >/dev/null 2>&1 || say "  failed: $p"
    done
fi

have wpscan || { have gem && gem install wpscan >/dev/null 2>&1; }

say "== done =="
say "WordPress scanner and nuclei templates are fetched on first run; keep nuclei updated with 'nuclei -update-templates'."
