-- Run after taking a database backup and before deploying the Cognito-enabled backend.
-- Password hashes belonged to the retired local-password authentication flow.
ALTER TABLE users ADD COLUMN IF NOT EXISTS cognito_sub VARCHAR(64) UNIQUE;
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(254);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uq ON users (LOWER(email));
ALTER TABLE users DROP COLUMN IF EXISTS password;
