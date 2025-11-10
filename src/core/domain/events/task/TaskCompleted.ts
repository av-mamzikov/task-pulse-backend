import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a task is completed
 */
export class TaskCompleted implements DomainEvent {
  readonly eventName = 'TaskCompleted';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly completedAt: Date
  ) {
  }
}
