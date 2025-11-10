import {IEventHandler} from '@core/domain/events';
import {TaskCompleted} from '@core/domain/events/task';
import {logger} from '../../logger';

/**
 * Handler for TaskCompleted events
 * Performs side effects when a task is completed
 */
export class TaskCompletedHandler implements IEventHandler<TaskCompleted> {
  async handle(event: TaskCompleted): Promise<void> {
    logger.info(
      `Task ${event.aggregateId} completed at ${event.completedAt.toISOString()}`
    );

    // Future enhancements:
    // - Send completion notifications
    // - Update completion metrics
    // - Trigger dependent tasks
    // - Calculate completion time
    // - Award achievements/badges
  }
}
