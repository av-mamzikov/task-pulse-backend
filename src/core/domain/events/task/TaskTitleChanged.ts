import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a task's title changes
 */
export class TaskTitleChanged implements DomainEvent {
  readonly eventName = 'TaskTitleChanged';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly oldTitle: string,
    public readonly newTitle: string
  ) {
  }
}
