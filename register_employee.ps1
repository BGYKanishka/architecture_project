$signupUrl = "http://localhost:8080/api/auth/signup"
$body = '{"name":"Employee One","email":"emp1@example.com","password":"password123","role":"EMPLOYEE","contactNumber":"0771234567","businessName":"BookFair Staff"}'

Write-Host "=== Registering employee user via /api/auth/signup ==="
try {
    $response = Invoke-WebRequest -Uri $signupUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "SUCCESS! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "FAILED! Status: $statusCode"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Error: $($reader.ReadToEnd())"
    }
    else {
        Write-Host "Error: $($_.Exception.Message)"
    }
}
