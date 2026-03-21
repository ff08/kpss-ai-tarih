# Kullanım (bir kez): gh auth login
# Sonra proje kökünden: .\scripts\push-to-github.ps1
# İsteğe bağlı: $env:GITHUB_REPO_NAME = "farkli-repo-adi"

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) bulunamadı. winget install GitHub.cli ile kurun."
}

$null = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Önce GitHub'a giriş yapın:" -ForegroundColor Yellow
  Write-Host "  gh auth login" -ForegroundColor Cyan
  exit 1
}

$repoName = if ($env:GITHUB_REPO_NAME) { $env:GITHUB_REPO_NAME } else { "kpss-ai-tarih" }
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

Write-Host "Kök: $root" -ForegroundColor Gray
Write-Host "Repo: $repoName (public)" -ForegroundColor Gray

$hasOrigin = $false
git remote get-url origin 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) { $hasOrigin = $true }

if ($hasOrigin) {
  Write-Host "origin mevcut; git push..." -ForegroundColor Yellow
  git push -u origin main
  exit $LASTEXITCODE
}

gh repo create $repoName --public --source=. --remote=origin --push
exit $LASTEXITCODE
