# PowerShell script to push to GitHub and set up GitHub Pages
param (
    [Parameter(Mandatory=$true, HelpMessage="Enter your GitHub Repository URL (e.g. https://github.com/username/college-lost-found.git)")]
    [string]$RepoUrl
)

$env:PATH = "C:\Users\user\.local\bin\git\cmd;" + $env:PATH

Write-Host "Configuring remote repository..." -ForegroundColor Cyan
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin $RepoUrl

Write-Host "Pushing main branch to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "To make your web app live with GitHub Pages:" -ForegroundColor Yellow
    Write-Host "1. Go to your repository on GitHub."
    Write-Host "2. Click Settings -> Pages (in the left sidebar)."
    Write-Host "3. Under 'Build and deployment', set Source to 'Deploy from a branch'."
    Write-Host "4. Select branch 'main' and folder '/ (root)', then click Save."
    Write-Host "5. Your app will be live in ~60 seconds at https://<your-username>.github.io/<repo-name>/" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Please verify repository URL and your GitHub authentication." -ForegroundColor Red
}
