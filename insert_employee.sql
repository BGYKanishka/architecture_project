-- Insert employee user emp1@example.com with password 'password123' (BCrypt hashed) and EMPLOYEE role
INSERT INTO users (name, email, password, role, enabled, created_at)
VALUES (
    'Employee One',
    'emp1@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'EMPLOYEE',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE
    SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        role = 'EMPLOYEE',
        enabled = true;

-- Verify
SELECT id, email, name, role, enabled FROM users WHERE email = 'emp1@example.com';
