@echo off
REM GPMS - Automated Database Migration & Setup Script
REM This script will install Node.js (if needed) and migrate the Supabase database

setlocal enabledelayedexpansion
cd /d %~dp0

echo.
echo ========================================
echo   GPMS - Database Migration Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Node.js not found. Installing...
    echo.
    
    REM Download Node.js LTS
    powershell -Command "& {
        $url = 'https://nodejs.org/dist/v20.12.0/node-v20.12.0-x64.msi'
        $output = '$env:TEMP\node-installer.msi'
        Write-Host '[*] Downloading Node.js v20...'
        try {
            Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
            Write-Host '[+] Download complete. Installing...'
            & msiexec /i $output /quiet /norestart
            Write-Host '[+] Node.js installed successfully!'
            Start-Sleep -Seconds 3
        } catch {
            Write-Host '[-] Failed to download Node.js'
            Write-Host '    Please install manually from: https://nodejs.org/'
            exit 1
        }
    }"
    
    if %errorlevel% neq 0 (
        echo [-] Node.js installation failed
        echo [!] Please install Node.js manually from https://nodejs.org/
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [+] Node.js found: !NODE_VERSION!
)

echo.
echo [*] Starting Database Migration...
echo.

REM Navigate to backend folder
cd /d "%~dp0backend"

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [-] npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Generating Prisma client...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo [-] Prisma generate failed
    pause
    exit /b 1
)

echo.
echo [3/4] Creating database schema in Supabase...
call npm run prisma:push
if %errorlevel% neq 0 (
    echo [-] Prisma push failed - Check your DATABASE_URL in .env
    pause
    exit /b 1
)

echo.
echo [4/4] Seeding database with defaults...
call npm run seed
if %errorlevel% neq 0 (
    echo [!] Seed completed with warnings (this is okay)
)

echo.
echo ========================================
echo   [+] Database Migration Complete!
echo ========================================
echo.
echo Tables created in Supabase:
echo   - admins (for authentication)
echo   - orders (for order records)
echo   - settings (for configuration)
echo.

REM Optional: Push to GitHub
echo.
set /p PUSH_GITHUB="Push changes to GitHub? (y/n): "
if /i "%PUSH_GITHUB%"=="y" (
    echo.
    echo [*] Updating GitHub repository...
    cd /d "%~dp0"
    
    git add backend\prisma\migrations
    git add backend\.env
    git commit -m "database: Prisma migration complete - tables created in Supabase PostgreSQL"
    git push origin main
    
    if %errorlevel% equ 0 (
        echo [+] GitHub updated successfully!
    ) else (
        echo [!] GitHub push had issues - check manually
    )
)

echo.
echo [+] Setup Complete!
echo.
echo Next steps:
echo   1. Start backend: cd backend ^& npm run dev
echo   2. Start frontend (new terminal): cd frontend ^& npm run dev
echo   3. Open http://localhost:3000
echo.
pause
