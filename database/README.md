# Database Configuration

This directory contains the database schema and seed data for the **Book Fair System**.

## 📊 Database Details
- **System**: PostgreSQL
- **Default Database Name**: `bookfair_db`
- **Default Port**: `5432`

## 📁 Files

- **`schema.sql`**: Contains the Data Definition Language (DDL) statements to create the necessary database tables. This includes:
  - `users`
  - `floors`
  - `stall_types`
  - `stalls`
  - `genres`
  - `user_genres`
  - `reservations`
  - `reservation_stalls`
  - `payments`
  - `admin_actions`
  
- **`seed.sql`**: Contains initial sample data (Data Manipulation Language - DML) to populate the database for testing and development. It inserts:
  - Floor definitions (A, B, C, D, E, F, G, MainBuilding)
  - Stall types (SMALL, MEDIUM, LARGE) with corresponding pricing
  - Dozens of stalls mapped to their respective floors and types
  - Pre-defined book genres

## ⚙️ Setup Instructions

1. Ensure PostgreSQL is installed and running on your system.
2. Open your preferred PostgreSQL client (like `psql` or pgAdmin) and create a new database:
   ```sql
   CREATE DATABASE bookfair_db;
   ```
3. Run the `schema.sql` script to create the tables. Using the command line:
   ```bash
   psql -U postgres -d bookfair_db -f schema.sql
   ```
4. Run the `seed.sql` script to populate the database with initial data:
   ```bash
   psql -U postgres -d bookfair_db -f seed.sql
   ```
5. **Important**: Verify that your database credentials (username and password) match the configuration defined in the backend's `application.properties` file:
   ```properties
   # backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/bookfair_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password_here
   ```
