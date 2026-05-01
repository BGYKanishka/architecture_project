# Book Fair System

A comprehensive full-stack application designed to manage book fair stalls, reservations, user interactions, and admin tasks.

## 🏗️ Architecture Overview

The project is structured into three main directories, each handling a specific part of the application:
- **`frontend/`**: A modern single-page web application built with React, Vite, and Tailwind CSS.
- **`backend/`**: A robust REST API built with Java 17 and Spring Boot, handling business logic, authentication, and data access.
- **`database/`**: SQL scripts for PostgreSQL schema creation and initial data seeding.

## ✨ Key Features

- **User Authentication**: Secure user login and registration using JWT (JSON Web Tokens).
- **Role-based Access Control**: Distinct features and dashboards for `ADMIN`, `EMPLOYEE`, and `VENDOR` roles.
- **Stall Reservation System**: Interactive floor plans allowing vendors to view, select, and reserve stalls of various sizes (Small, Medium, Large) across multiple floors.
- **QR Code Integration**: Generation and scanning of QR codes for verifying reservations and managing entry.
- **Admin & Employee Dashboards**: Comprehensive management of users, stalls, reservations, and employee duties.
- **Email Notifications**: Automated email confirmations for users.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Utilities**: HTML5-QRCode, React Toastify, React Icons, JWT-Decode

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot
- **Security**: Spring Security & JWT
- **Data Access**: Spring Data JPA
- **Email**: Spring Boot Starter Mail
- **Utilities**: ZXing (for QR Code operations), Lombok

### Database
- **System**: PostgreSQL

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven](https://maven.apache.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Database Setup
Please refer to the [database/README.md](database/README.md) for detailed instructions on how to initialize the PostgreSQL database using the provided schema and seed scripts.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update the `src/main/resources/application.properties` file with your database credentials and email configuration.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

