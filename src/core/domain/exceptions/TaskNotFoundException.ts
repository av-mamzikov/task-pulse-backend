import {DomainException} from './DomainException';

/**
 * Exception thrown when a task cannot be found
 */
export class TaskNotFoundException extends DomainException {
  constructor(public readonly taskId: string) {
    super(`Task with ID ${taskId} was not found.`);
    this.name = 'TaskNotFoundException';
    Object.setPrototypeOf(this, TaskNotFoundException.prototype);
  }
}
