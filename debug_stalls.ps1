$loginUrl = "http://localhost:8080/api/auth/signin"
$loginBody = '{"email":"emp1@example.com","password":"password123"}'

$loginResp = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
$token = ($loginResp.Content | ConvertFrom-Json).token

Write-Host "Token acquired."

# Get stalls with full verbose error 
$stallsUrl = "http://localhost:8080/api/employee/stalls"
try {
    $stallResp = Invoke-WebRequest -Uri $stallsUrl -Method GET -Headers @{Authorization = "Bearer $token" } -UseBasicParsing
    Write-Host "Status: $($stallResp.StatusCode)"
    $stallResp.Content
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "FAILED Status: $statusCode"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $body = $reader.ReadToEnd()
    Write-Host "Full Error Body:"
    Write-Host $body
}
