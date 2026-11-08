# ==============================================================================
# ARES-VII • Automated Rust Toolchain & Tauri Desktop Compiler (Windows/macOS/Linux)
# Installs Rust (rustup) if missing, installs @tauri-apps/cli, and compiles
# the native Rust desktop executable (.exe / .msi on Windows, .dmg / .app on macOS)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "[ARES-VII] Checking Rust compiler (rustc & cargo)..." -ForegroundColor Cyan
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "[ARES-VII] Installing Rust toolchain via rustup-init..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"
    & "$env:TEMP\rustup-init.exe" -y --default-toolchain stable
    $env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
}

rustc --version
cargo --version

Write-Host "[ARES-VII] Building Frontend Bundle (Vite)..." -ForegroundColor Cyan
npx vite build

Write-Host "[ARES-VII] Compiling Native Rust + Tauri v2 Desktop App..." -ForegroundColor Cyan
npx --yes @tauri-apps/cli@latest build

Write-Host "[ARES-VII] Done! Native installers are in src-tauri/target/release/bundle/" -ForegroundColor Green
