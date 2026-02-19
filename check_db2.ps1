$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$env:PGPASSWORD = "Converter"

Write-Host "=== Checking users table structure ==="
& $psql -U postgres -d bookfair_db -c "\d users"

Write-Host ""
Write-Host "=== All users ==="
& $psql -U postgres -d bookfair_db -c "SELECT id, email, name, role, password FROM users LIMIT 20;"
