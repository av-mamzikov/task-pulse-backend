import {IEventHandler} from '@core/domain/events';
import {TaskPriorityChanged} from '@core/domain/events/task';
import {logger} from '../../logger';

/**
 * Handler for TaskPriorityChanged events
 * Performs side effects when a task priority changes
 */
export class TaskPriorityChangedHandler implements IEventHandler<TaskPriorityChanged> {
  async handle(event: TaskPriorityChanged): Promise<void> {
    logger.info(
      `Task ${event.aggregateId} priority changed: ${event.oldPriority} → ${event.newPriority}`
    );

    // Future enhancements:
    // - Send priority change notifications
    // - Re-sort task lists
    // - Update priority-based metrics
  }
}
