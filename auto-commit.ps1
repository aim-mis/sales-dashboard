# Auto-commit and push every 5 minutes
while ($true) {
    Set-Location "C:\Users\NVG\OneDrive - Arvin International\CLAUDE AI PROJECT\sales-dashboard"

    # Check for changes
    $status = git status --porcelain

    if ($status) {
        Write-Host "$(Get-Date): Changes detected, committing..." -ForegroundColor Green

        # Stage all changes
        git add .

        # Create commit with timestamp
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Update: Automated commit at $timestamp`n`nCo-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

        # Push to GitHub
        git push origin main

        Write-Host "✓ Changes committed and pushed at $timestamp" -ForegroundColor Green
    } else {
        Write-Host "$(Get-Date): No changes detected" -ForegroundColor Gray
    }

    # Wait 5 minutes
    Start-Sleep -Seconds 300
}
