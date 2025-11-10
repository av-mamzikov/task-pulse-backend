# Infrastructure Layer

This layer contains the implementation details for external concerns like database access, external services, and configuration.

## Structure

```
infrastructure/
├── config/
│   ├── environment.ts      # Environment configuration
│   └── container.ts        # Dependency Injection container
├── database/
│   ├── data-source.ts      # TypeORM data source configuration
│   ├── entities/           # TypeORM entities (database models)
│   │   └── TaskEntity.ts
│   ├── mappers/            # Mappers between domain and database entities
│   │   └── TaskMapper.ts
│   └── migrations/         # Database migrations
│       └── 1699000000000-CreateTasksTable.ts
└── repositories/           # Repository implementations
    └── TaskRepository.ts
```

## Key Components

### Configuration

- **environment.ts**: Loads and validates environment variables
- **container.ts**: Simple DI container for managing dependencies

### Database

- **data-source.ts**: TypeORM DataSource configuration and initialization
- **entities/**: TypeORM entities that map to database tables
- **mappers/**: Convert between domain entities and database entities
- **migrations/**: Database schema migrations

### Repositories

- **TaskRepository.ts**: Implementation of `ITaskRepository` interface using TypeORM

## Database Setup

### Prerequisites

1. PostgreSQL 14.x or higher installed
2. Database created (see `.env.example` for configuration)

### Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate a new migration (after entity changes)
npm run migration:generate -- src/infrastructure/database/migrations/MigrationName
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskpulse
DB_PASSWORD=taskpulse_password
DB_DATABASE=taskpulse_db
```

## Architecture Principles

### Dependency Inversion

The Infrastructure layer depends on the Core layer (Domain + Application), not the other way around:

- Infrastructure implements interfaces defined in Core
- Domain entities are independent of database concerns
- Mappers convert between domain and persistence models

### Repository Pattern

Repositories provide a collection-like interface for accessing domain entities:

- Abstract database operations behind a clean interface
- Enable easy testing with mock implementations
- Isolate domain logic from persistence concerns

## Usage Example

```typescript
import {initializeDatabase, getContainer} from '@infrastructure';

// Initialize database connection
await initializeDatabase();

// Get repository from DI container
const container = getContainer();
const taskRepository = container.getTaskRepository();

// Use repository
const task = await taskRepository.findById('some-id');
```

## Testing

When testing, you can:

1. Use in-memory database for integration tests
2. Mock the repository interface for unit tests
3. Reset the DI container between tests

```typescript
import {Container} from '@infrastructure/config/container';

afterEach(() => {
    Container.reset();
});
```
