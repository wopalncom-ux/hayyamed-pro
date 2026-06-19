# setup-dev.ps1 — Run once before `npm run dev` to prevent OneDrive EBUSY errors.
#
# OneDrive syncs .next files while webpack writes them → EBUSY resource busy errors.
# Fix: create a Windows directory junction so .next physically lives outside OneDrive.
# The project still sees .next/ normally; OneDrive sees a junction and doesn't sync it.
#
# Usage: powershell -ExecutionPolicy Bypass -File scripts\setup-dev.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
$junctionPath = Join-Path $projectRoot ".next"
$targetPath = "C:\Users\$env:USERNAME\tmp\hayyamed-next"

Write-Host "Setting up dev junction..." -ForegroundColor Cyan
Write-Host "  Junction : $junctionPath"
Write-Host "  Target   : $targetPath"

# Create target directory
if (-not (Test-Path $targetPath)) {
    New-Item -ItemType Directory -Force $targetPath | Out-Null
    Write-Host "  Created target directory." -ForegroundColor Green
}

# Remove existing .next if it's a real directory (not a junction)
if (Test-Path $junctionPath) {
    $item = Get-Item $junctionPath -Force
    if ($item.LinkType -eq "Junction") {
        Write-Host "  .next junction already exists." -ForegroundColor Green
    } else {
        Write-Host "  Removing existing .next directory..." -ForegroundColor Yellow
        Remove-Item $junctionPath -Recurse -Force
        # Create .next junction
        New-Item -ItemType Junction -Path $junctionPath -Target $targetPath | Out-Null
        Write-Host "  .next junction created." -ForegroundColor Green
    }
}

# Create .next junction if it doesn't exist yet (skip if handled above)
if (-not (Test-Path $junctionPath)) {
    New-Item -ItemType Junction -Path $junctionPath -Target $targetPath | Out-Null
    if (Test-Path $junctionPath) {
        Write-Host "  .next junction created." -ForegroundColor Green
    } else {
        Write-Host "  Failed to create .next junction." -ForegroundColor Red
        exit 1
    }
}

# Create node_modules junction inside the target so Node.js can resolve packages.
# When Next.js runs compiled files from the physical tmp path, it walks up looking
# for node_modules. This junction makes it find the project's node_modules.
$nodeModsJunction = Join-Path $targetPath "node_modules"
$nodeModsTarget   = Join-Path $projectRoot "node_modules"
if (-not (Test-Path $nodeModsJunction)) {
    New-Item -ItemType Junction -Path $nodeModsJunction -Target $nodeModsTarget | Out-Null
    Write-Host "  node_modules junction created." -ForegroundColor Green
} else {
    Write-Host "  node_modules junction already exists." -ForegroundColor Green
}

Write-Host ""
Write-Host "  Setup complete. Run 'npm run dev' to start." -ForegroundColor Cyan
