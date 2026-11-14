# Colombo International Book Fair (CIBF) Platform

A full-stack web application built for managing stall reservations and event operations at the Colombo International Book Fair (BMICH). The platform enables book publishers to browse live hall availability and reserve stalls, gate staff to validate attendee passes using camera QR scanning, and administrators to oversee reservations, stall inventory, and staff duties.

---

## 🏛️ System Architecture

The application is built as a **modular monolith** with a Spring Boot 3 REST API backend and a React 19 single-page frontend.

```mermaid
flowchart TD
    subgraph Clients ["Clients"]
        Vendor["Publisher / Vendor"]
        Staff["Gate Staff"]
        Admin["Administrator"]
    end

    subgraph Frontend ["Frontend (React 19 + Vite + Tailwind CSS)"]
        UI["Interactive Hall Map, Dashboards & QR Scanner"]
        Axios["Axios API Client"]
    end

    subgraph Backend ["Backend (Spring Boot 3 REST API)"]
        Security["Spring Security + OAuth2 BFF"]
        Controllers["Stall, Reservation & Duty Controllers"]
        Services["Business Logic & Pessimistic Lock Engine"]
    end

    subgraph Database ["Persistence"]
        Postgres[("PostgreSQL 16")]
    end

    subgraph CloudServices ["AWS Services (ap-southeast-2)"]
        SES["Amazon SES (Email Tickets)"]
        Cognito["Amazon Cognito (Identity Provider)"]
    end

    Vendor & Staff & Admin --> UI
    UI --> Axios
    Axios -->|"Session Cookie / REST API"| Security
    Security --> Controllers
    Security -.-|"OAuth2 Code Flow"| Cognito
    Controllers --> Services
    Services -->|Pessimistic Locking / SQL| Postgres
    Services -->|SMTP / TLS| SES
```

---

## ☁️ Cloud Architecture (Selected Region: `ap-southeast-2`)

Deployed in AWS Sydney (`ap-southeast-2`) within a custom VPC separating public web tiers from private persistence subnets.

```mermaid
flowchart LR
    Client["User Browser"] -->|HTTPS| ALB["Application Load Balancer\n(bookfair-alb)"]

    subgraph PublicSubnets ["Public Subnets (ap-southeast-2a / 2b)"]
        ALB -->|"Round-Robin :80"| EC2_1["EC2 Node 1\nNginx + Spring Boot (Docker)"]
        ALB -->|"Round-Robin :80"| EC2_2["EC2 Node 2\nNginx + Spring Boot (Docker)"]
    end

    subgraph PrivateSubnet ["Private Subnet (ap-southeast-2a)"]
        EC2_1 & EC2_2 -->|Port 5432| RDS[("Amazon RDS\nPostgreSQL")]
    end

    subgraph ManagedServices ["AWS Managed Services (ap-southeast-2)"]
        EC2_1 & EC2_2 -.-|"OAuth2 Code Flow"| Cognito["Amazon Cognito"]
        EC2_1 & EC2_2 -->|"SMTP :587"| SES["Amazon SES\n(QR Tickets)"]
    end
```

---

## ✨ Key Features

- **Interactive Floor Map:** Visual SVG floor plan of BMICH halls (A–G and Main Building) with live stall availability.
- **Real-Time Stall Booking:** Reserve up to 3 stalls with database pessimistic locking (`SELECT ... FOR UPDATE`) to eliminate double-booking race conditions.
- **Digital Tickets & QR Verification:** Automated confirmation emails with embedded QR passes via Amazon SES, verifiable in real time using the built-in camera scanner.
- **Role-Based Access Control:** Dedicated interfaces and permissions for Publishers (`ROLE_VENDOR`), Gate Security (`ROLE_EMPLOYEE`), and Administrators (`ROLE_ADMIN`).
- **Event Operations Management:** Admin tools to toggle stall availability, adjust pricing, schedule staff duty shifts, and audit reservations.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, HTML5-QRCode, Heroicons |
| **Backend** | Java 25, Spring Boot 4.x, Spring Security 7, Spring Data JPA, ZXing (QR) |
| **Database** | PostgreSQL 16 |
| **Cloud (AWS `ap-southeast-2`)** | EC2 (Ubuntu), Amazon RDS PostgreSQL, Amazon SES, Amazon Cognito |
| **DevOps** | Docker, Docker Compose, Nginx, GitHub Actions |

---

## 🗄️ Database Schema

```mermaid
erDiagram
    users ||--o{ user_genres : "selects"
    genres ||--o{ user_genres : "assigned to"
    users ||--o{ reservations : "places"
    users ||--o{ duties : "assigned"
    floors ||--o{ stalls : "contains"
    stall_types ||--o{ stalls : "classifies"
    reservations ||--|{ reservation_stalls : "reserves"
    stalls ||--o{ reservation_stalls : "booked in"
    reservations ||--o| payments : "settled by"

    users {
        SERIAL id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR cognito_sub UK
        VARCHAR contact_number
        VARCHAR business_name
        VARCHAR role "VENDOR, EMPLOYEE, or ADMIN"
        BOOLEAN enabled
        TIMESTAMP created_at
    }

    floors {
        SERIAL id PK
        VARCHAR floor_name UK "A-G, MainBuilding"
    }

    stall_types {
        SERIAL id PK
        VARCHAR size UK "SMALL, MEDIUM, LARGE"
        NUMERIC price
    }

    stalls {
        SERIAL id PK
        INT floor_id FK
        VARCHAR stall_code
        INT stall_type_id FK
        BOOLEAN reserved
        BOOLEAN disabled
    }

    reservations {
        SERIAL id PK
        INT user_id FK
        TIMESTAMP reservation_date
        VARCHAR qr_code_token UK
        VARCHAR status "PENDING, CONFIRMED, CANCELLED"
    }

    payments {
        SERIAL id PK
        INT reservation_id FK, UK
        NUMERIC amount
        VARCHAR payment_method
        VARCHAR payment_status "PENDING, PAID, FAILED"
        TIMESTAMP payment_date
    }

    duties {
        SERIAL id PK
        VARCHAR description
        TIMESTAMP start_time
        TIMESTAMP end_time
        VARCHAR status "ASSIGNED, COMPLETED, CANCELLED"
        INT assigned_to_id FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/) (recommended)
- *Or manual:* Java 25+, Node.js 18+, PostgreSQL 15+

### Quickstart with Docker Compose

1. **Clone the repository and copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Generate a JWT secret:**
   ```bash
   openssl rand -base64 32
   ```
   Paste the generated string into `JWT_SECRET` in `.env`.

3. **Start all services:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - **Frontend:** `http://localhost:3000` (or `http://localhost:5173` if running Vite dev server)
   - **Backend API:** `http://localhost:8080/api`
   - **Database:** `localhost:5432`

---

### Manual Setup (Without Docker)

#### 1. Database Setup
```bash
createdb -U postgres bookfair_db
psql -U postgres -d bookfair_db -f database/schema.sql
psql -U postgres -d bookfair_db -f database/seed.sql
```

#### 2. Backend Setup

Copy `.env.example` to `.env` in the project root and fill in the Cognito pool ID, client ID, client secret, and hosted domain. For an IntelliJ run, Spring Boot reads this file automatically. Start PostgreSQL locally and set `SPRING_DATASOURCE_PASSWORD` in `.env` to the same password configured for the local database.

```bash
cd backend
./mvnw spring-boot:run
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `POSTGRES_DB` | Database name | `bookfair_db` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | *(Set a strong password)* |
| `JWT_SECRET` | 256-bit Base64 HMAC secret key | `openssl rand -base64 32` |
| `SPRING_MAIL_HOST` | Amazon SES SMTP Host (selected Region) | `email-smtp.ap-southeast-2.amazonaws.com` |
| `SPRING_MAIL_PORT` | Amazon SES SMTP Port | `465` (SMTPS) or `587` (STARTTLS) |
| `SPRING_MAIL_USERNAME`| Amazon SES SMTP Username | *(From AWS SES credentials)* |
| `SPRING_MAIL_PASSWORD`| Amazon SES SMTP Password | *(From AWS SES credentials)* |
| `APP_MAIL_FROM` | Verified sender email address | `tickets@yourdomain.com` |
| `CORS_ALLOWED_ORIGINS`| Whitelisted CORS origin URLs | `http://localhost:3000,http://localhost:5173` |
