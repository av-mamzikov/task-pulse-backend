import {DomainException} from './DomainException';

/**
 * Exception thrown when attempting to set an invalid due date
 */
export class InvalidDueDateException extends DomainException {
  constructor(public readonly dueDate: Date) {
    super(`Cannot set due date to ${dueDate.toISOString()}. Due date cannot be in the past.`);
    this.name = 'InvalidDueDateException';
    Object.setPrototypeOf(this, InvalidDueDateException.prototype);
  }
}
