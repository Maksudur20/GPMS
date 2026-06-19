# GPMS - Node.js Auto-Installer
# Run this in PowerShell (as Administrator recommended)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  GPMS - Node.js Installer" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
Write-Host "[*] Checking for Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $version = node --version
    Write-Host "[+] Node.js already installed: $version" -ForegroundColor Green
    exit 0
}

Write-Host "[!] Node.js not found. Installing..." -ForegroundColor Yellow
Write-Host ""

# Download Node.js LTS v20
$nodeUrl = "https://nodejs.org/dist/v20.12.0/node-v20.12.0-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

Write-Host "[*] Downloading Node.js v20 LTS..." -ForegroundColor Yellow
Write-Host "    URL: $nodeUrl" -ForegroundColor Gray

try {
    # Use BITS transfer for reliable download
    Start-BitsTransfer -Source $nodeUrl -Destination $installerPath -DisplayName "Node.js Installer" -Verbose
    
    if (Test-Path $installerPath) {
        Write-Host "[+] Download complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[*] Installing Node.js..." -ForegroundColor Yellow
        
        # Run MSI installer silently
        & msiexec /i $installerPath /quiet /norestart
        
        # Wait for installation
        Write-Host "[*] Installation in progress... (this may take 1-2 minutes)" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Verify installation
        $maxAttempts = 12
        $attempt = 0
        while ($attempt -lt $maxAttempts) {
            $nodePath = Get-Command node -ErrorAction SilentlyContinue
            if ($nodePath) {
                $version = node --version
                Write-Host "[+] Installation successful!" -ForegroundColor Green
                Write-Host "[+] Node.js version: $version" -ForegroundColor Green
                break
            }
            $attempt++
            if ($attempt -lt $maxAttempts) {
                Write-Host "    Checking... (attempt $attempt/$maxAttempts)" -ForegroundColor Gray
                Start-Sleep -Seconds 5
            }
        }
        
        if ($attempt -eq $maxAttempts) {
            Write-Host "[!] Installation may need PowerShell restart" -ForegroundColor Yellow
            Write-Host "[*] Please close and reopen PowerShell, then run:" -ForegroundColor Yellow
            Write-Host "    node --version" -ForegroundColor Cyan
        }
        
        # Cleanup
        Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
        
    } else {
        Write-Host "[-] Download failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[-] Error: $_" -ForegroundColor Red
    Write-Host "[!] Manual installation required:" -ForegroundColor Yellow
    Write-Host "    1. Visit https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "    2. Download LTS version" -ForegroundColor Cyan
    Write-Host "    3. Run the installer" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "[+] Ready to setup GPMS!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd d:\GPMS\backend" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. npm run prisma:push" -ForegroundColor White
Write-Host "  4. npm run dev" -ForegroundColor White
Write-Host ""
