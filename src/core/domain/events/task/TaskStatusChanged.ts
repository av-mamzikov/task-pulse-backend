import {DomainEvent} from '../base/DomainEvent';
import {TaskStatus} from '../../enums/TaskStatus';

/**
 * Event raised when a task's status changes
 */
export class TaskStatusChanged implements DomainEvent {
  readonly eventName = 'TaskStatusChanged';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly oldStatus: TaskStatus,
    public readonly newStatus: TaskStatus,
    public readonly changedBy?: string
  ) {
  }
}
