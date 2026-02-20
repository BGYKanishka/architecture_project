$ErrorActionPreference = "Continue"

$email = "emp1@example.com"
$password = "password123"
$baseUrl = "http://localhost:8080"

Write-Host "=== Employee Stall Map Access Tool ==="
Write-Host "Base URL: $baseUrl"
Write-Host "User: $email"

# Step 1: Login
$loginUrl = "$baseUrl/api/auth/signin"
$loginBody = '{"email":"emp1@example.com","password":"password123"}'

Write-Host ""
Write-Host "--- Step 1: Login ---"
try {
    $loginResp = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    Write-Host "Login Status: $($loginResp.StatusCode)"
    Write-Host "Login Response: $($loginResp.Content)"
    
    $loginData = $loginResp.Content | ConvertFrom-Json
    $token = $loginData.token
    if (-not $token) { $token = $loginData.accessToken }
    Write-Host "Token: $token"
}
catch {
    Write-Host "Login Error: $($_.Exception.Message)"
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status Code: $statusCode"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Body: $($reader.ReadToEnd())"
    }
    exit 1
}

if (-not $token) {
    Write-Host "No token found!"
    exit 1
}

# Step 2: Get Stalls
$stallsUrl = "$baseUrl/api/employee/stalls"
Write-Host ""
Write-Host "--- Step 2: Fetching Stalls from $stallsUrl ---"
try {
    $stallResp = Invoke-WebRequest -Uri $stallsUrl -Method GET -Headers @{Authorization = "Bearer $token"; "Content-Type" = "application/json" } -UseBasicParsing
    Write-Host "Stalls Status: $($stallResp.StatusCode)"
    Write-Host ""
    Write-Host "=== STALL MAP DATA ==="
    # Pretty-print JSON
    $data = $stallResp.Content | ConvertFrom-Json
    $data | ConvertTo-Json -Depth 10
    Write-Host ""
    if ($data -is [System.Array]) {
        Write-Host "Total Stalls: $($data.Count)"
    }
}
catch {
    Write-Host "Stalls Error: $($_.Exception.Message)"
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status Code: $statusCode"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Body: $($reader.ReadToEnd())"
    }
}
