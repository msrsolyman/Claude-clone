# Atelier Windows Desktop Installer Script
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      Installing Atelier Desktop App       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$AppDir = "D:\Claude"
$IconPath = "$AppDir\electron\icon.ico"
$VbsLauncher = "$AppDir\Atelier.vbs"
$BatLauncher = "$AppDir\Atelier.bat"

if (-not (Test-Path $IconPath)) {
    Write-Host "Icon not found at $IconPath, fallback to generic icon" -ForegroundColor Yellow
}

$WshShell = New-Object -ComObject WScript.Shell

# 1. Create Desktop Shortcut
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$DesktopShortcutPath = Join-Path $DesktopPath "Atelier.lnk"

Write-Host "Creating Desktop shortcut at: $DesktopShortcutPath" -ForegroundColor Green
$Shortcut = $WshShell.CreateShortcut($DesktopShortcutPath)
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = "`"$VbsLauncher`""
$Shortcut.WorkingDirectory = $AppDir
$Shortcut.IconLocation = "$IconPath,0"
$Shortcut.Description = "Atelier - AI Workspace & Artifact Studio"
$Shortcut.Save()

# 2. Create Start Menu Programs Shortcut
$StartMenuPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs)
$StartShortcutPath = Join-Path $StartMenuPath "Atelier.lnk"

Write-Host "Creating Start Menu shortcut at: $StartShortcutPath" -ForegroundColor Green
$StartShortcut = $WshShell.CreateShortcut($StartShortcutPath)
$StartShortcut.TargetPath = "wscript.exe"
$StartShortcut.Arguments = "`"$VbsLauncher`""
$StartShortcut.WorkingDirectory = $AppDir
$StartShortcut.IconLocation = "$IconPath,0"
$StartShortcut.Description = "Atelier - AI Workspace & Artifact Studio"
$StartShortcut.Save()

Write-Host ""
Write-Host "Installation Completed Successfully!" -ForegroundColor Green
Write-Host "- Desktop Shortcut: Ready on your Windows Desktop" -ForegroundColor White
Write-Host "- Start Menu: Ready in Windows Search / Start Menu" -ForegroundColor White
Write-Host "- Direct Launcher: D:\Claude\Atelier.bat or D:\Claude\Atelier.vbs" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
