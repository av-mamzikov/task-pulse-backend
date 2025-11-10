import {IEventHandler} from '@core/domain/events';
import {TaskStatusChanged} from '@core/domain/events/task';
import {logger} from '../../logger';

/**
 * Handler for TaskStatusChanged events
 * Performs side effects when a task status changes
 */
export class TaskStatusChangedHandler implements IEventHandler<TaskStatusChanged> {
  async handle(event: TaskStatusChanged): Promise<void> {
    logger.info(
      `Task ${event.aggregateId} status changed: ${event.oldStatus} → ${event.newStatus}${
        event.changedBy ? ` by ${event.changedBy}` : ''
      }`
    );

    // Future enhancements:
    // - Send status change notifications
    // - Update project statistics
    // - Trigger workflow automations
    // - Update time tracking
  }
}
