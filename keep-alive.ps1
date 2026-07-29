while ($true) {
    $proc = Start-Process -FilePath "node" -ArgumentList "node_modules\next\dist\bin\next","start","-p","3000" -WorkingDirectory "C:\Users\GOLDEN AURA\OneDrive\Documents\health website\vitalx-ai" -PassThru -NoNewWindow
    Write-Output "Server started (PID: $($proc.Id))"
    $proc.WaitForExit()
    Write-Output "Server died. Restarting in 2s..."
    Start-Sleep -Seconds 2
}
