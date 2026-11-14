# Database

PostgreSQL schema and initial inventory for the CIBF platform.

## Files

- `schema.sql` creates application tables and a case-insensitive unique index for user email addresses.
- `seed.sql` inserts the initial floors, stalls, and genres. Review inventory and prices before using it for an event.
- `migrations/V1__cognito_auth.sql` upgrades an existing local-password database for Cognito sign-in. It adds the Cognito subject, expands email length, enforces case-insensitive email uniqueness, and drops the old password-hash column.

## Fresh database

Create the database, then run the schema and seed scripts once:

```bash
createdb -U postgres bookfair_db
psql -U postgres -d bookfair_db -f database/schema.sql
psql -U postgres -d bookfair_db -f database/seed.sql
```

Do not add passwords, Cognito client secrets, or production users to seed files. The first administrator is provisioned as a row with a verified Cognito email through the secure database operator path.

## Existing local-password database

Take and verify a database backup first. Check for duplicate emails ignoring case:

```sql
SELECT lower(email), count(*) FROM users GROUP BY lower(email) HAVING count(*) > 1;
```

Resolve any duplicates, then run `database/migrations/V1__cognito_auth.sql` once with a migration account. Dropping password hashes is irreversible without restoring the backup. Existing users link to their application roles when they first sign in with Cognito using the same verified email.

## Runtime database access

Configure the connection with `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`. AWS runtime uses a dedicated least-privilege database role and TLS certificate verification; do not use the RDS master credentials for the application.