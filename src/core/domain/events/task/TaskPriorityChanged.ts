import {DomainEvent} from '../base/DomainEvent';
import {Priority} from '../../enums/Priority';

/**
 * Event raised when a task's priority changes
 */
export class TaskPriorityChanged implements DomainEvent {
  readonly eventName = 'TaskPriorityChanged';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly oldPriority: Priority,
    public readonly newPriority: Priority
  ) {
  }
}
