import {Task} from '../aggregates/task/Task';
import {Priority} from '../enums/Priority';

/**
 * Domain Service for task priority management
 * Contains business logic that doesn't naturally fit within a single entity
 */
export class TaskPriorityService {
  /**
   * Automatically escalates priority for tasks that are overdue
   * This is a domain service because it operates on multiple tasks
   * @param tasks The tasks to check
   * @returns Array of tasks that had their priority escalated
   */
  escalatePriorityForOverdueTasks(tasks: Task[]): Task[] {
    const escalatedTasks: Task[] = [];

    for (const task of tasks) {
      if (task.isOverdue() && task.priority !== Priority.High) {
        // Escalate priority
        const newPriority =
          task.priority === Priority.Low ? Priority.Medium : Priority.High;
        task.changePriority(newPriority);
        escalatedTasks.push(task);
      }
    }

    return escalatedTasks;
  }

  /**
   * Calculates dynamic priority based on due date and current workload
   * @param task The task to calculate priority for
   * @param allTasks All tasks in the system
   * @returns Suggested priority
   */
  calculateDynamicPriority(task: Task, allTasks: Task[]): Priority {
    const daysUntilDue = task.daysUntilDue();
    const activeTasks = allTasks.filter((t) => t.status !== 'Done');
    const highPriorityCount = activeTasks.filter(
      (t) => t.priority === Priority.High
    ).length;

    // If due in less than 2 days, suggest High priority
    if (daysUntilDue <= 2) {
      return Priority.High;
    }

    // If due in less than 7 days and not too many high priority tasks, suggest High
    if (daysUntilDue <= 7 && highPriorityCount < 5) {
      return Priority.High;
    }

    // If due in less than 14 days, suggest Medium
    if (daysUntilDue <= 14) {
      return Priority.Medium;
    }

    // Otherwise, Low priority
    return Priority.Low;
  }

  /**
   * Rebalances priorities across all tasks based on due dates
   * @param tasks All tasks to rebalance
   * @returns Tasks that had their priority changed
   */
  rebalancePriorities(tasks: Task[]): Task[] {
    const changedTasks: Task[] = [];
    const activeTasks = tasks.filter((t) => t.status !== 'Done');

    for (const task of activeTasks) {
      const suggestedPriority = this.calculateDynamicPriority(task, activeTasks);
      if (task.priority !== suggestedPriority) {
        task.changePriority(suggestedPriority);
        changedTasks.push(task);
      }
    }

    return changedTasks;
  }
}
