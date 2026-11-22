#!/bin/sh
# Report which hacking tools are already present. No package manager needed to read it.
for t in nmap masscan naabu rustscan zmap curl wget jq rg ffuf gobuster feroxbuster \
         nikto whatweb wpscan nuclei httpx subfinder amass dnsx katana gau waybackurls \
         sqlmap hydra medusa john hashcat sshpass proxychains4 nxc netexec \
         tcpdump tshark nc socat openssl python3 go docker kubectl nomad cargo git; do
    if command -v "$t" >/dev/null 2>&1; then
        printf 'ok   %s\n' "$t"
    else
        printf 'MISS %s\n' "$t"
    fi
done
