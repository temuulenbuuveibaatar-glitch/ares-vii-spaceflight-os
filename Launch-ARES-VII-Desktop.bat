@echo off
setlocal
title ARES-VII Hermes Autonomous Space OS - Setup & Launcher
cd /d "%~dp0"

echo [ARES-VII] Verifying runtime environment on this machine...

REM 1. Ensure Node.js is installed on this computer
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ARES-VII] Node.js not found. Installing Node.js LTS via Windows Package Manager...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

REM 2. Ensure dependencies are installed
if not exist "node_modules" (
    echo [ARES-VII] First-time setup on this computer: installing dependencies...
    call npm install
)

REM 3. Ensure Emil Kowalski, Ponytail & Design Motion Principles skills are installed
if not exist ".agents\skills\design-motion-principles" (
    echo [ARES-VII] Installing Emil Kowalski, Ponytail & Design Motion Principles skills...
    call npx --yes skills@latest add emilkowalski/skills -y
    call npx --yes skills@latest add DietrichGebert/ponytail -y
    call npx --yes skills@latest add kylezantos/design-motion-principles -y
)

REM 4. Start the Hermes & Space Telemetry Server if not already listening on 5000
curl -s http://127.0.0.1:5000/api/mission/overview >nul 2>nul
if %errorlevel% neq 0 (
    echo [ARES-VII] Starting Hermes AI, NOAA SWPC & GMAT/Orbiter Server...
    start "ARES-VII Hermes Server" /min cmd /k "npm run dev"
)

REM 5. Wait until http://127.0.0.1:5000 is genuinely ready before opening window
echo [ARES-VII] Waiting for local mission server at http://127.0.0.1:5000 ...
:waitloop
curl -s http://127.0.0.1:5000/api/mission/overview >nul 2>nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak >nul
    goto waitloop
)

echo [ARES-VII] Server online. Opening desktop application...
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start "" msedge --app=http://127.0.0.1:5000 --window-size=1440,900
    exit /b 0
)

where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start "" chrome --app=http://127.0.0.1:5000 --window-size=1440,900
    exit /b 0
)

start http://127.0.0.1:5000
