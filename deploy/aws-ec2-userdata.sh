#!/bin/bash
# ==============================================================================
# Sonnenblume • HERMES BIO-ASTRO & NASA GMAT/ORBITER SERVER  •  AWS EC2 USER DATA
# Compatible with: Amazon Linux 2023 (ami-0516089d963059a51 in eu-north-1) & Ubuntu 22.04/24.04
# Paste this into AWS EC2 -> "Launch an instance" -> "Advanced details" -> "User data"
# Make sure your EC2 Security Group allows Inbound HTTP (Port 80), HTTPS (443), and Custom TCP (5000)
# ==============================================================================
set -e

exec > >(tee /var/log/ares-vii-bootstrap.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "[Sonnenblume] Starting AWS EC2 Bootstrap for Hermes AI & Rust Telemetry Engine..."

# 1. Install System Packages, Node.js 20, Nginx, and Git
if command -v dnf >/dev/null 2>&1; then
  # Amazon Linux 2023
  dnf update -y
  dnf install -y git curl gcc gcc-c++ make openssl-devel nginx
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs
elif command -v apt-get >/dev/null 2>&1; then
  # Ubuntu / Debian
  apt-get update -y
  apt-get install -y git curl build-essential libssl-dev pkg-config nginx
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# 2. Install Rust Toolchain (rustc + cargo) for Fast Reliable Native Engine
export HOME=/root
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustc --version
cargo --version

# 3. Install PM2 Process Manager for 24/7 Mission Reliability
npm install -g pm2 tsx

# 4. Configure Nginx Reverse Proxy (Port 80 -> Port 5000) with CORS for Vercel & Desktop App
cat << 'EOF' > /etc/nginx/conf.d/ares-vii.conf
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default || true
systemctl enable nginx
systemctl restart nginx

echo "[Sonnenblume] AWS EC2 Node.js 20 + Rust + Nginx environment provisioned!"
