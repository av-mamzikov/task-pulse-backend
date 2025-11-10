import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a task is deleted
 */
export class TaskDeleted implements DomainEvent {
  readonly eventName = 'TaskDeleted';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly deletedAt: Date
  ) {
  }
}
