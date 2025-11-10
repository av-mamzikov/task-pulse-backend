import {DomainException} from './DomainException';
import {TaskStatus} from '../enums/TaskStatus';

/**
 * Exception thrown when attempting an invalid task status transition
 */
export class InvalidStatusTransitionException extends DomainException {
  constructor(
    public readonly currentStatus: TaskStatus,
    public readonly targetStatus: TaskStatus
  ) {
    super(
      `Cannot transition from ${currentStatus} to ${targetStatus}. Invalid status transition.`
    );
    this.name = 'InvalidStatusTransitionException';
    Object.setPrototypeOf(this, InvalidStatusTransitionException.prototype);
  }
}
