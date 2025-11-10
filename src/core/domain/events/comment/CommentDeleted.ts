import {DomainEvent} from '../base/DomainEvent';

/**
 * Event raised when a comment is deleted from a task
 */
export class CommentDeleted implements DomainEvent {
  readonly eventName = 'CommentDeleted';
  readonly occurredOn: Date = new Date();

  constructor(
    public readonly aggregateId: string, // taskId
    public readonly commentId: string
  ) {
  }
}
