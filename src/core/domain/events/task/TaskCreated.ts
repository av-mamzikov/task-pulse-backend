import {DomainEvent} from '../base/DomainEvent';
import {Priority} from '../../enums/Priority';

/**
 * Event raised when a new task is created
 */
export class TaskCreated implements DomainEvent {
  readonly eventName = 'TaskCreated';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly title: string,
    public readonly priority: Priority,
    public readonly dueDate: Date
  ) {
  }
}
