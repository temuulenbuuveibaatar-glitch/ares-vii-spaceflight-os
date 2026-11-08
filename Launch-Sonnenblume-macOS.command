#!/bin/bash
cd "$(dirname "$0")"
echo "[Sonnenblume] Verifying runtime environment on macOS..."

if ! command -v node >/dev/null 2>&1; then
  echo "[Sonnenblume] Node.js not found. Installing via Homebrew..."
  brew install node
fi

if [ ! -d "node_modules" ]; then
  echo "[Sonnenblume] First-time setup on this Mac: installing dependencies..."
  npm install
fi

if [ ! -d ".agents/skills/design-motion-principles" ]; then
  npx --yes skills@latest add emilkowalski/skills -y
  npx --yes skills@latest add DietrichGebert/ponytail -y
  npx --yes skills@latest add kylezantos/design-motion-principles -y
fi

if ! curl -s http://127.0.0.1:5000/api/mission/overview >/dev/null 2>&1; then
  echo "[Sonnenblume] Starting Hermes AI & Space Telemetry Server..."
  npm run dev &
fi

echo "[Sonnenblume] Waiting for server readiness..."
until curl -s http://127.0.0.1:5000/api/mission/overview >/dev/null 2>&1; do
  sleep 1
done

if [ -d "/Applications/Google Chrome.app" ]; then
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app="http://127.0.0.1:5000" --window-size=1440,900 &
else
  open "http://127.0.0.1:5000"
fi
