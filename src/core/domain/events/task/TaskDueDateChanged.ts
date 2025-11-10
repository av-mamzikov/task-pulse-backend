import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a task's due date changes
 */
export class TaskDueDateChanged implements DomainEvent {
  readonly eventName = 'TaskDueDateChanged';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly oldDueDate: Date,
    public readonly newDueDate: Date
  ) {
  }
}
