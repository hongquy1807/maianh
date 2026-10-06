param([switch]$Install)
$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
$python=Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if ($Install) {
 if (!(Test-Path -LiteralPath $python)) { python -m venv .venv; if ($LASTEXITCODE) { throw 'venv failed' } }
 & $python -m pip install 'https://download.pytorch.org/whl/cu128/torch-2.8.0%2Bcu128-cp312-cp312-win_amd64.whl'
 if ($LASTEXITCODE) { throw 'PyTorch install failed' }
 & $python -m pip install -r requirements.txt
 if ($LASTEXITCODE) { throw 'Dependencies install failed' }
}
if (!(Test-Path -LiteralPath $python)) { throw 'Run with -Install first.' }
$env:PYTHONIOENCODING='utf-8'
& $python service.py --device cuda
if ($LASTEXITCODE) { throw 'Worker failed; read error above.' }
