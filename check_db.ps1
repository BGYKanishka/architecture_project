$psql = "psql"
$env:PGPASSWORD = "Converter"

# Check if user exists
Write-Host "=== Checking users table ==="
& $psql -U postgres -d bookfair_db -c "SELECT id, email, name, role FROM users WHERE email = 'emp1@example.com';"

Write-Host "=== All users with EMPLOYEE role ==="
& $psql -U postgres -d bookfair_db -c "SELECT id, email, name, role FROM users WHERE role = 'ROLE_EMPLOYEE' OR role = 'EMPLOYEE';"

Write-Host "=== All users (first 10) ==="
& $psql -U postgres -d bookfair_db -c "SELECT id, email, name, role FROM users LIMIT 10;"
