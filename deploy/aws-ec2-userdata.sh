#!/bin/bash
# ==============================================================================
# Sonnenblume • HERMES BIO-ASTRO & NASA GMAT CLUSTER  •  AWS EC2 USER DATA
# Production Deployment Script with Cloudflare Proxying & PM2 Daemon Auto-Start
# Target AMIs: Amazon Linux 2023 (ami-0516089d963059a51) or Ubuntu 22.04/24.04 LTS
# ==============================================================================
set -e

exec > >(tee /var/log/sonnenblume-bootstrap.log | logger -t sonnenblume -s 2>/dev/console) 2>&1
echo "======================================================================"
echo "[Sonnenblume] Initializing AWS EC2 Provisioning for Space Health OS..."
echo "======================================================================"

# 1. Update OS and Install Core Toolchains (Node.js 20, Nginx, Git, Build Essentials)
if command -v dnf >/dev/null 2>&1; then
  # Amazon Linux 2023
  dnf update -y
  dnf install -y git curl gcc gcc-c++ make openssl-devel nginx tar
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs
elif command -v apt-get >/dev/null 2>&1; then
  # Ubuntu / Debian
  apt-get update -y
  apt-get install -y git curl build-essential libssl-dev pkg-config nginx tar
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

node -v
npm -v

# 2. Install Rust Toolchain for Native High-Performance Astrodynamics Engine
export HOME=/root
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env" || export PATH="$HOME/.cargo/bin:$PATH"
rustc --version
cargo --version

# 3. Install Global Process Managers
npm install -g pm2 tsx

# 4. Configure Cloudflare Nginx Reverse Proxy with Real IP Restoration
cat << 'EOF' > /etc/nginx/conf.d/sonnenblume.conf
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
real_ip_header CF-Connecting-IP;

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default || true
systemctl enable nginx
systemctl restart nginx

# 5. Clone Sonnenblume Repository & Build
APP_DIR="/opt/sonnenblume"
rm -rf "$APP_DIR"
git clone https://github.com/temuulenbuuveibaatar-glitch/ares-vii-spaceflight-os.git "$APP_DIR"
cd "$APP_DIR"

# Install project dependencies
npm ci || npm install

# Build client bundle & server
npm run build

# 6. Configure PM2 Process Daemon for 24/7 Resilience
cat << 'EOF' > "$APP_DIR/ecosystem.config.cjs"
module.exports = {
  apps: [{
    name: "sonnenblume-server",
    script: "dist/index.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    }
  }]
};
EOF

pm2 start "$APP_DIR/ecosystem.config.cjs"
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "======================================================================"
echo "[Sonnenblume] AWS EC2 Deployment Complete! Server live on Port 80/5000"
echo "======================================================================"
