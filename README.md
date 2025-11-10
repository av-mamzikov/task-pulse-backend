# TaskPulse Backend

Backend API for TaskPulse - Task Management System built with Clean Architecture principles.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL 14+
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI
- **Logging:** Winston

## Project Structure

```
backend/
├── src/
│   ├── core/                    # Core Layer (Domain + Application)
│   │   ├── domain/              # Domain entities, enums, value objects
│   │   │   ├── entities/
│   │   │   ├── enums/
│   │   │   └── value-objects/
│   │   └── application/         # Application logic
│   │       ├── interfaces/      # Repository interfaces
│   │       ├── dtos/            # Data Transfer Objects
│   │       ├── use-cases/       # Business use cases
│   │       └── validators/      # Validation logic
│   ├── infrastructure/          # Infrastructure Layer
│   │   ├── database/            # Database configuration
│   │   ├── repositories/        # Repository implementations
│   │   └── config/              # Configuration files
│   └── web/                     # Web/API Layer
│       ├── controllers/         # HTTP controllers
│       ├── middleware/          # Express middleware
│       ├── routes/              # API routes
│       └── swagger/             # API documentation
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Docker & Docker Compose (optional, for containerized development)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

**Option A: Using Docker Compose (Recommended)**

From the project root:

```bash
docker-compose up postgres -d
```

**Option B: Local PostgreSQL**

Ensure PostgreSQL is running and create the database:

```sql
CREATE DATABASE taskpulse_db;
CREATE USER taskpulse WITH PASSWORD 'taskpulse_password';
GRANT ALL PRIVILEGES ON DATABASE taskpulse_db TO taskpulse;
```

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run lint:fix` - Lint and fix code

## Docker

### Build Image

```bash
docker build -t taskpulse-backend .
```

### Run with Docker Compose

From the project root:

```bash
docker-compose up
```

This will start both PostgreSQL and the backend API.

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 3000 |
| HOST | Server host | 0.0.0.0 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USERNAME | Database username | taskpulse |
| DB_PASSWORD | Database password | taskpulse_password |
| DB_DATABASE | Database name | taskpulse_db |
| LOG_LEVEL | Logging level | info |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## Architecture

This project follows Clean Architecture principles:

- **Core Layer:** Contains domain entities and application logic. No dependencies on external frameworks.
- **Infrastructure Layer:** Implements interfaces defined in Core. Handles database, external services.
- **Web Layer:** HTTP controllers, routes, middleware. Depends on Core interfaces.

Dependencies flow inward: Web → Infrastructure → Core

## License

ISC
