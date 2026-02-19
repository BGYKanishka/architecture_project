-- Remove the incorrectly-hashed employee user so we can re-register via the API
DELETE FROM users WHERE email = 'emp1@example.com';
SELECT 'Deleted employee user' AS status;
