Set-Location "C:\Users\GOLDEN AURA\OneDrive\Documents\health website\vitalx-ai"
$proc = Start-Process -FilePath "node" -ArgumentList "node_modules\next\dist\bin\next start -p 3000" -WindowStyle Hidden -PassThru
$proc.Id | Out-File "C:\Users\GOLDEN AURA\OneDrive\Documents\health website\vitalx-ai\server.pid"
Write-Host "Server PID: $($proc.Id)"
