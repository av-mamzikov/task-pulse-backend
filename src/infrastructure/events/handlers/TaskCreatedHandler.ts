import {IEventHandler} from '@core/domain/events';
import {TaskCreated} from '@core/domain/events/task';
import {logger} from '../../logger';

/**
 * Handler for TaskCreated events
 * Performs side effects when a task is created
 */
export class TaskCreatedHandler implements IEventHandler<TaskCreated> {
  async handle(event: TaskCreated): Promise<void> {
    logger.info(
      `Task created: ${event.aggregateId} - "${event.title}" (Priority: ${event.priority}, Due: ${event.dueDate.toISOString()})`
    );

    // Future enhancements:
    // - Send notification to assigned users
    // - Update analytics/metrics
    // - Trigger webhooks
    // - Create audit log entry
  }
}
