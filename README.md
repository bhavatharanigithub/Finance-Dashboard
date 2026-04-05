<<<<<<< HEAD
# Finance Flow - Production-Quality Finance Dashboard

A secure, full-stack finance dashboard built with Spring Boot and React, featuring Role-Based Access Control (RBAC), JWT authentication, and comprehensive financial analytics.

## Tech Stack
- **Backend**: Java 21, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, PostgreSQL, Lombok, Jakarta Validation.
- **Frontend**: React.js (Vite), Axios, Lucide Icons, Vanilla CSS (Premium Styling).

## Key Features
- **Secure Authentication**: JWT-based login with role-based access.
- **Role-Based Permissions**: 
  - `VIEWER`: View dashboard summary/stats only.
  - `ANALYST`: View dashboard stats + read all financial records.
  - `ADMIN`: Full CRUD access to user roles/status and financial records.
- **Real-time Analytics**: Summary cards for income, expenses, and net balance with recent transaction tracking.
- **Advanced Record Management**: Pagination, filtering by category/type, and search functionality.
- **Data Integrity**: Soft-delete functionality for financial records.

## Project Structure
```text
backend/
├── src/main/java/com/finance/dashboard/
│   ├── controller/    # API endpoints
│   ├── service/       # Business logic
│   ├── repository/    # DB access
│   ├── entity/        # Database models (JPA)
│   ├── dto/           # Request/Response models
│   ├── security/      # JWT & Spring Security config
│   ├── exception/     # Global error handling
│   └── FinanceDashboardApplication.java
└── src/main/resources/application.yml

frontend/
├── src/
│   ├── api/           # API config (Axios)
│   ├── context/       # Auth state management
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   └── index.css      # Vanilla CSS styling
└── vite.config.js     # Proxy configuration
```

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running on port `5432` with the following credentials:
- **Database**: `finance_dashboard`
- **Username**: `postgres`
- **Password**: `4321`

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Build the project: `./mvnw clean install` (or use your local Maven).
3. Run the application: `./mvnw spring-boot:run`.
4. The API will be available at `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.
4. The dashboard will be available at `http://localhost:5173`.

## API Endpoints & RBAC

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Authenticate & get JWT | Public |
| POST | `/auth/register`| Register new account | Public |
| GET | `/summary` | Dashboard stats | VIEWER+ |
| GET | `/records` | List finance records | ANALYST+ |
| POST | `/records` | Create new record | ADMIN |
| DELETE | `/records/{id}`| Soft delete record | ADMIN |
| PUT | `/users/{id}/role`| Update user role | ADMIN |

## Future Improvements
- Multi-currency support with real-time conversion.
- Automated recurring transaction scheduling.
- Export to PDF/CSV for financial reports.
- Advanced visualization with Recharts.
=======
"# Finance-Dashboard" 
>>>>>>> 23c88f787d35ddc67a12f5fba1fbfda59aca22c1
