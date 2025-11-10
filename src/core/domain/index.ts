// Aggregates (new DDD structure)
export * from './aggregates';

// Legacy Entities (kept for backward compatibility during migration)
export {Task as TaskLegacy} from './entities/Task';
export {Comment as CommentLegacy} from './entities/Comment';

// Enums
export { TaskStatus } from './enums/TaskStatus';
export { Priority } from './enums/Priority';

// Value Objects
export { TaskTitle } from './value-objects/TaskTitle';
export { TaskDescription } from './value-objects/TaskDescription';
export { DueDate } from './value-objects/DueDate';
export { CommentText } from './value-objects/CommentText';

// Events
export * from './events';

// Exceptions
export * from './exceptions';

// Specifications
export * from './specifications';

// Services
export * from './services';
