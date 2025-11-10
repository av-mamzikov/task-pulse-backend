import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a task's description changes
 */
export class TaskDescriptionChanged implements DomainEvent {
  readonly eventName = 'TaskDescriptionChanged';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly oldDescription: string | null,
    public readonly newDescription: string | null
  ) {
  }
}
