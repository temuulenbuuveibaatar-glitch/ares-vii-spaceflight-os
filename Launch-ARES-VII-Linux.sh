#!/bin/bash
cd "$(dirname "$0")"
echo "[ARES-VII] Verifying runtime environment on Linux..."

if [ ! -d "node_modules" ]; then
  echo "[ARES-VII] First-time setup: installing dependencies..."
  npm install
fi

if [ ! -d ".agents/skills/design-motion-principles" ]; then
  npx --yes skills@latest add emilkowalski/skills -y
  npx --yes skills@latest add DietrichGebert/ponytail -y
  npx --yes skills@latest add kylezantos/design-motion-principles -y
fi

if ! curl -s http://127.0.0.1:5000/api/mission/overview >/dev/null 2>&1; then
  echo "[ARES-VII] Starting Hermes AI & Space Telemetry Server..."
  npm run dev &
fi

until curl -s http://127.0.0.1:5000/api/mission/overview >/dev/null 2>&1; do
  sleep 1
done

if command -v google-chrome >/dev/null 2>&1; then
  google-chrome --app="http://127.0.0.1:5000" --window-size=1440,900 &
elif command -v chromium-browser >/dev/null 2>&1; then
  chromium-browser --app="http://127.0.0.1:5000" --window-size=1440,900 &
else
  xdg-open "http://127.0.0.1:5000"
fi
