import {IEventHandler} from '@core/domain/events';
import {CommentAdded} from '@core/domain/events/comment';
import {logger} from '../../logger';

/**
 * Handler for CommentAdded events
 * Performs side effects when a comment is added to a task
 */
export class CommentAddedHandler implements IEventHandler<CommentAdded> {
  async handle(event: CommentAdded): Promise<void> {
    logger.info(
      `Comment ${event.commentId} added to task ${event.aggregateId}: "${event.text.substring(0, 50)}${event.text.length > 50 ? '...' : ''}"`
    );

    // Future enhancements:
    // - Send notifications to task watchers
    // - Update activity feed
    // - Trigger @mentions notifications
    // - Update last activity timestamp
  }
}
