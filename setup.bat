@echo off
echo ========================================
echo Caden Trusts - Authentication Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 20+ from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo Python dependencies installed successfully.
echo.

echo [2/4] Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo Node.js dependencies installed successfully.
echo.

echo [3/4] Environment Configuration
echo.
echo Your .env file has been created with default settings.
echo.
echo ========================================
echo SMTP SETUP FOR OTP EMAILS
echo ========================================
echo.
echo To enable real email OTP delivery, update your .env file with SMTP settings:
echo.
echo For Gmail:
echo   1. Go to https://myaccount.google.com/apppasswords
echo   2. Generate an App Password for "Mail"
echo   3. Update .env with:
echo      SMTP_HOST=smtp.gmail.com
echo      SMTP_PORT=587
echo      SMTP_USER=your-email@gmail.com
echo      SMTP_PASSWORD=your-16-char-app-password
echo.
echo For other providers, use their SMTP settings.
echo.
echo If SMTP is not configured, OTP codes will be printed to the server console.
echo ========================================
echo.

echo [4/4] Setup Complete!
echo.
echo To start the application:
echo.
echo   Terminal 1 (Backend):
echo     python run.py
echo.
echo   Terminal 2 (Frontend):
echo     npm run dev
echo.
echo Admin credentials:
echo   Email: cadentrust01@caden.com
echo   Password: Caden@67
echo.
echo ========================================
pause
