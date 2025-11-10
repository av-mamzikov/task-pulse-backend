import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a comment is added to a task
 */
export class CommentAdded implements DomainEvent {
  readonly eventName = 'CommentAdded';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string, // taskId
    public readonly commentId: string,
    public readonly text: string
  ) {
  }
}
