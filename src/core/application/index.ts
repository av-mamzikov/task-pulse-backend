// Common patterns
export * from './common';

// Interfaces
export { ITaskRepository, TaskFilterOptions } from './interfaces/ITaskRepository';

// DTOs
export * from './dtos/CreateTaskDto';
export * from './dtos/UpdateTaskDto';
export * from './dtos/UpdateTaskStatusDto';
export * from './dtos/TaskResponseDto';
export * from './dtos/CreateCommentDto';
export * from './dtos/CommentResponseDto';

// Validators
export * from './validators/CreateTaskValidator';
export * from './validators/UpdateTaskValidator';
export * from './validators/UpdateTaskStatusValidator';
export * from './validators/CreateCommentValidator';

// Use Cases
// export * from './use-cases'; // Uncomment when use cases are implemented
