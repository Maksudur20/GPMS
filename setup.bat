@echo off
REM GPMS Setup Script for Windows

echo 🚀 GPMS Project Setup Started...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Backend setup
echo.
echo 📦 Setting up Backend...
cd backend
call npm install
copy .env.example .env
echo ⚠️  Please update .env with your Supabase credentials
call npm run prisma:generate
call npm run prisma:push
cd ..

REM Frontend setup
echo.
echo 📦 Setting up Frontend...
cd frontend
call npm install
copy .env.example .env
cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo 📝 Next steps:
echo   1. Update backend\.env with your Supabase credentials
echo   2. Update frontend\.env with your API URL
echo   3. Start backend: cd backend ^&^& npm run dev
echo   4. Start frontend: cd frontend ^&^& npm run dev
