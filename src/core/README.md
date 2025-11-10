# Core Layer

This is the **Core Layer** of the TaskPulse backend application, following Clean Architecture principles. The Core Layer contains the domain logic and application use cases, and is independent of external frameworks and infrastructure.

## Structure

### Domain Layer (`domain/`)

Contains the core business entities, value objects, and enums.

#### Entities
- **Task**: Represents a task with Value Objects for title, description, and due date
  - Methods: `updateStatus()`, `update()`, `isOverdue()`, `daysUntilDue()`
- **Comment**: Represents a comment with Value Object for text
  - Methods: `getTextValue()`, `getTextLength()`

#### Enums
- **TaskStatus**: Defines task statuses (New, InProgress, Done)
- **Priority**: Defines task priorities (Low, Medium, High)

#### Value Objects
- **TaskTitle**: Encapsulates task title with validation (1-200 chars, required)
- **TaskDescription**: Encapsulates task description (max 2000 chars, optional)
- **DueDate**: Encapsulates due date with business logic (cannot be in past, isOverdue(), daysUntilDue())
- **CommentText**: Encapsulates comment text with validation (required, non-empty)

### Application Layer (`application/`)

Contains application logic, interfaces, DTOs, and validators.

#### Interfaces
- **ITaskRepository**: Interface for task data persistence operations
- **ICommentRepository**: Interface for comment data persistence operations

#### DTOs (Data Transfer Objects)
- **CreateTaskDto**: Data for creating a new task
- **UpdateTaskDto**: Data for updating an existing task
- **UpdateTaskStatusDto**: Data for updating task status
- **TaskResponseDto**: Response format for task data
- **FilterTasksDto**: Filter criteria for querying tasks
- **CreateCommentDto**: Data for creating a new comment
- **CommentResponseDto**: Response format for comment data

#### Validators
Validators use `class-validator` decorators to ensure data integrity:
- **CreateTaskValidator**: Validates task creation data
  - Title: required, 1-200 characters
  - Description: optional, max 2000 characters
  - Priority: required, must be Low/Medium/High
  - Due date: required, must be valid date
- **UpdateTaskValidator**: Validates task update data
- **UpdateTaskStatusValidator**: Validates status changes
- **CreateCommentValidator**: Validates comment creation
- **FilterTasksValidator**: Validates filter parameters

## Validation Rules

### Task
- **Title**: Required, 1-200 characters
- **Description**: Optional, max 2000 characters
- **Priority**: Required, enum (Low, Medium, High)
- **Status**: Required, enum (New, InProgress, Done), default: New
- **Due Date**: Required, must be a valid date

### Comment
- **Task ID**: Required, must be valid UUID
- **Text**: Required, non-empty string

## Dependency Rules

The Core Layer follows these principles:
- **No external dependencies**: Core does not depend on Infrastructure or Web layers
- **Dependency Inversion**: Other layers depend on Core interfaces
- **Framework independence**: No framework-specific code in Core

## Usage

Import from the core layer:

```typescript
import {
  // Entities
  Task,
  Comment,
  // Enums
  TaskStatus,
  Priority,
  // Value Objects
  TaskTitle,
  TaskDescription,
  DueDate,
  CommentText,
  // Interfaces
  ITaskRepository,
  // DTOs
  CreateTaskDto,
  TaskResponseDto,
  // Validators
  CreateTaskValidator,
} from '@/core';
```

### Creating entities with Value Objects:

```typescript
import { Task, TaskTitle, TaskDescription, DueDate, Priority } from '@/core';

const task = new Task(
  'uuid',
  new TaskTitle('Implement authentication'),
  Priority.High,
  new DueDate(new Date('2025-12-31')),
  new TaskDescription('Add JWT authentication')
);

// Access values
console.log(task.getTitleValue()); // 'Implement authentication'
console.log(task.isOverdue()); // false
console.log(task.daysUntilDue()); // number of days
```

## Next Steps

The Infrastructure Layer will implement the repository interfaces defined here, and the Web Layer will use the DTOs and validators for API endpoints.
