$ErrorActionPreference = "Continue"

$email = "emp1@example.com"
$password = "password123"

# Try both backend direct (8080) and frontend proxy (5173)
$urls = @("http://localhost:8080", "http://localhost:5173")

foreach ($baseUrl in $urls) {
    Write-Host ""
    Write-Host "======================================"
    Write-Host "Trying base URL: $baseUrl"
    Write-Host "======================================"

    $loginUrl = "$baseUrl/api/auth/signin"
    $body = '{"email":"emp1@example.com","password":"password123"}'

    try {
        $response = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
        Write-Host "SUCCESS! Status: $($response.StatusCode)"
        Write-Host "Response Body: $($response.Content)"
        
        $data = $response.Content | ConvertFrom-Json
        $token = $data.token
        if (-not $token) { $token = $data.accessToken }
        
        if ($token) {
            Write-Host ""
            Write-Host "Token: $token"
            Write-Host ""
            Write-Host "Fetching stall map..."
            
            $stallsUrl = "$baseUrl/api/employee/stalls"
            $stallResp = Invoke-WebRequest -Uri $stallsUrl -Method GET -Headers @{Authorization = "Bearer $token" } -UseBasicParsing
            Write-Host "Stalls Status: $($stallResp.StatusCode)"
            Write-Host ""
            Write-Host "=== STALL MAP DATA ==="
            Write-Host $stallResp.Content
            break
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "FAILED! Status: $statusCode"
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $body_resp = $reader.ReadToEnd()
            Write-Host "Error Response: $body_resp"
        }
        else {
            Write-Host "Error: $($_.Exception.Message)"
        }
    }
}
