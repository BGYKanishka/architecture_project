$loginUrl = "http://localhost:8080/api/auth/signin"
$loginBody = '{"email":"emp1@example.com","password":"password123"}'

$loginResp = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
$loginData = $loginResp.Content | ConvertFrom-Json
Write-Host "=== Login Successful ===" 
Write-Host "Email: $($loginData.email)"
Write-Host "Role:  $($loginData.roles -join ', ')"
Write-Host ""

$token = $loginData.token

$stallsUrl = "http://localhost:8080/api/employee/stalls"
$stallResp = Invoke-WebRequest -Uri $stallsUrl -Method GET -Headers @{Authorization = "Bearer $token" } -UseBasicParsing
$data = $stallResp.Content | ConvertFrom-Json

Write-Host "=== STALL MAP DATA (Total: $($data.Count) stalls) ==="
Write-Host ""

$reserved = $data | Where-Object { $_.reserved -eq $true }
$available = $data | Where-Object { $_.reserved -eq $false }

Write-Host "Reserved Stalls: $($reserved.Count)"
Write-Host "Available Stalls: $($available.Count)"
Write-Host ""

Write-Host "=== FULL JSON DATA ==="
$data | ConvertTo-Json -Depth 10
