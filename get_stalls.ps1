$ErrorActionPreference = "Stop"

$email = "emp1@example.com"
$password = "password123"
$backendUrl = "http://localhost:8080"

Write-Host "=== Employee Stall Map Access Tool ==="
Write-Host "Logging in as: $email"

# Step 1: Login
$loginUrl = "$backendUrl/api/auth/signin"
$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "Login Successful!"
    Write-Host "Login Response:"
    $loginResponse | ConvertTo-Json -Depth 5
    $token = $loginResponse.token
    if (-not $token) { $token = $loginResponse.accessToken }
    if (-not $token) { $token = $loginResponse.jwt }
} catch {
    Write-Host "Login Failed!"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Response: $($reader.ReadToEnd())"
    exit 1
}

if (-not $token) {
    Write-Host "No token found in login response!"
    exit 1
}

Write-Host ""
Write-Host "Token acquired. Fetching stall map..."

# Step 2: Fetch Stall Data
$stallsUrl = "$backendUrl/api/employee/stalls"
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $stallsResponse = Invoke-RestMethod -Uri $stallsUrl -Method GET -Headers $headers -ContentType "application/json"
    Write-Host ""
    Write-Host "=== STALL MAP DATA ==="
    $stallsResponse | ConvertTo-Json -Depth 10
    if ($stallsResponse -is [System.Array]) {
        Write-Host ""
        Write-Host "Total Stalls Retrieved: $($stallsResponse.Count)"
    }
} catch {
    Write-Host "Failed to fetch stall data!"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Response: $($reader.ReadToEnd())"
    exit 1
}
