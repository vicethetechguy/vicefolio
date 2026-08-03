<#
    push-to-github.ps1
    ------------------
    Reusable push script for the vicefolio site, authenticating with a GitHub
    personal access token (PAT).

    Run it from this folder any time you want to ship changes:

        .\push-to-github.ps1
        .\push-to-github.ps1 -Message "Fix services section"

    FIRST RUN
      1. Create a token at https://github.com/settings/tokens
         - "Tokens (classic)" -> Generate new token (classic)
         - Scope: check `repo`
         - Copy it; GitHub only shows it once.
      2. Save it so you're not retyping it every time:
             .\push-to-github.ps1 -SetToken
         That stores it in a user environment variable. Reopen PowerShell after.
      3. Then just run .\push-to-github.ps1 whenever you want to push.

    SECURITY
      The token is never written into this file, into .git/config, or into the
      remote URL. It's passed as a one-off HTTP auth header per git command.
      Never commit a token to the repo. If one ever leaks, revoke it immediately
      at https://github.com/settings/tokens
#>

[CmdletBinding()]
param(
    # Commit message. Prompted for if omitted.
    [string]$Message,

    # Branch to push to.
    [string]$Branch = "main",

    # Store the token in a user environment variable, then exit.
    [switch]$SetToken,

    # Skip the confirmation prompt.
    [switch]$Force
)

# ─────────────────────────── CONFIG ───────────────────────────

$RepoUrl  = "https://github.com/vicethetechguy/vicefolio.git"
$TokenVar = "VICEFOLIO_GITHUB_TOKEN"

# ──────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"
$RepoDir = $PSScriptRoot

function Write-Step($m) { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Write-Ok($m)   { Write-Host "    $m"   -ForegroundColor Green }
function Write-Warn($m) { Write-Host "    $m"   -ForegroundColor Yellow }

function Read-Token {
    $secure = Read-Host "GitHub personal access token" -AsSecureString
    $bstr   = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try   { return [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

# ── -SetToken: save and exit ──────────────────────────────────

if ($SetToken) {
    $t = Read-Token
    if (-not $t) { throw "No token entered." }
    [Environment]::SetEnvironmentVariable($TokenVar, $t, "User")
    Write-Ok "Token saved to the '$TokenVar' user environment variable."
    Write-Warn "Close and reopen PowerShell for it to take effect."
    return
}

# ── 0. Prerequisites ──────────────────────────────────────────

Write-Step "Checking prerequisites"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "git is not installed or not on PATH. Get it from https://git-scm.com/download/win"
}

$Token = [Environment]::GetEnvironmentVariable($TokenVar, "User")
if (-not $Token) { $Token = $env:GITHUB_TOKEN }
if (-not $Token) {
    Write-Warn "No saved token found. Run '.\push-to-github.ps1 -SetToken' to save one."
    $Token = Read-Token
}
if (-not $Token) { throw "A personal access token is required." }

# Token travels as a per-command auth header — never touches disk or the remote URL.
$AuthHeader = "Authorization: Basic " + [Convert]::ToBase64String(
    [Text.Encoding]::ASCII.GetBytes("x-access-token:$Token")
)
function Git-Auth { git -c "http.extraHeader=$AuthHeader" @args }

Write-Ok "git found, token loaded"

Set-Location $RepoDir

# A crashed git leaves this behind and blocks everything afterwards.
$Lock = Join-Path $RepoDir ".git\index.lock"
if (Test-Path $Lock) {
    Write-Warn "Clearing stale git lock"
    Remove-Item $Lock -Force
}

# ── 1. Make sure this folder is a repo wired to GitHub ────────

if (-not (Test-Path (Join-Path $RepoDir ".git"))) {
    Write-Step "First-time setup — linking this folder to $RepoUrl"
    Write-Warn "This folder came from a ZIP download, so it has no git history."
    Write-Warn "Attaching it on top of the existing history on GitHub. Nothing is force-pushed."

    git init -b $Branch | Out-Null
    git remote add origin $RepoUrl

    Git-Auth fetch origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Could not reach the repo. Check the token's `repo` scope and that it hasn't expired." }

    # Point HEAD at the remote tip and sync the index, leaving your files untouched.
    # Your edits then show up as a normal diff against what's already on GitHub.
    git reset "origin/$Branch" | Out-Null
    git branch --set-upstream-to="origin/$Branch" $Branch | Out-Null

    Write-Ok "Linked. Future runs will just commit and push."
} else {
    Write-Step "Fetching latest from origin"
    Git-Auth fetch origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Fetch failed. Check your token and network." }
}

# ── 2. Stage everything ───────────────────────────────────────

Write-Step "Staging changes"
git add -A

$stat = git diff --cached --stat
if (-not $stat) {
    Write-Ok "Nothing has changed — already up to date with origin/$Branch."
    return
}
Write-Host $stat

# Deletions are the one thing worth a second look, especially on the first run:
# anything added to GitHub after you downloaded the ZIP is missing locally and
# would be committed as a deletion.
$deleted = git diff --cached --name-only --diff-filter=D
if ($deleted) {
    Write-Host ""
    Write-Warn "These files would be DELETED from the repo:"
    $deleted | ForEach-Object { Write-Host "      $_" -ForegroundColor Red }
    Write-Warn "If any of those should still exist, stop and check before continuing."
}

# ── 3. Confirm, commit, push ──────────────────────────────────

if (-not $Force) {
    $answer = Read-Host "`nCommit and push to '$Branch'? (y/n)"
    if ($answer -ne "y") {
        Write-Warn "Aborted. Changes are still staged; run 'git reset' to unstage."
        return
    }
}

if (-not $Message) {
    $Message = Read-Host "Commit message"
    if (-not $Message) { $Message = "Update site - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
}

Write-Step "Committing"
git commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "Commit failed." }

Write-Step "Pushing to origin/$Branch"
Git-Auth push origin "HEAD:$Branch"
if ($LASTEXITCODE -ne 0) {
    throw @"
Push failed. Common causes:
  - Token expired or missing the 'repo' scope -> make a new one and run -SetToken
  - The account behind the token lacks write access to vicethetechguy/vicefolio
  - Someone else pushed in the meantime -> run 'git pull --rebase origin $Branch' then retry
"@
}

Write-Ok "Pushed successfully"
Write-Host "`n$RepoUrl -> $Branch" -ForegroundColor Green
