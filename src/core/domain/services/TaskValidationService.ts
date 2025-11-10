import {Task} from '../aggregates/task/Task';
import {TaskStatus} from '../enums/TaskStatus';
import {Result} from '../../application/common/Result';

/**
 * Domain Service for task validation
 * Encapsulates complex validation rules that span multiple entities or require domain knowledge
 */
export class TaskValidationService {
  /**
   * Validates if a task's status can be changed
   * @param task The task to validate
   * @param newStatus The desired new status
   * @returns Result indicating if the change is valid
   */
  canChangeStatus(task: Task, newStatus: TaskStatus): Result<boolean, string> {
    // Check if already in that status
    if (task.status === newStatus) {
      return Result.fail('Task is already in that status');
    }

    // Validate transition rules
    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.New]: [TaskStatus.InProgress],
      [TaskStatus.InProgress]: [TaskStatus.Done],
      [TaskStatus.Done]: [TaskStatus.InProgress], // Allow reopening
    };

    const allowedStatuses = validTransitions[task.status];
    if (!allowedStatuses.includes(newStatus)) {
      return Result.fail(
        `Cannot transition from ${task.status} to ${newStatus}. Valid transitions: ${allowedStatuses.join(', ')}`
      );
    }

    // Future: Check for open subtasks before marking as Done
    // if (newStatus === TaskStatus.Done && task.hasOpenSubtasks()) {
    //   return Result.fail('Cannot complete task with open subtasks');
    // }

    return Result.ok(true);
  }

  /**
   * Validates if a task can be deleted
   * @param task The task to validate
   * @returns Result indicating if deletion is allowed
   */
  canDeleteTask(task: Task): Result<boolean, string> {
    // Business rule: Can only delete tasks that are not in progress
    if (task.status === TaskStatus.InProgress) {
      return Result.fail('Cannot delete a task that is in progress');
    }

    // Business rule: Warn if deleting a task with comments
    if (task.commentCount > 0) {
      return Result.fail(
        `Task has ${task.commentCount} comment(s). Consider archiving instead of deleting.`
      );
    }

    return Result.ok(true);
  }

  /**
   * Validates if a task can be completed
   * @param task The task to validate
   * @returns Result indicating if the task can be completed
   */
  canCompleteTask(task: Task): Result<boolean, string> {
    // Must be in progress to complete
    if (task.status !== TaskStatus.InProgress) {
      return Result.fail('Task must be in progress before it can be completed');
    }

    // Future: Check for required fields, subtasks, etc.
    // if (!task.hasRequiredFieldsFilled()) {
    //   return Result.fail('All required fields must be filled before completing');
    // }

    return Result.ok(true);
  }

  /**
   * Validates if a task is in a valid state
   * @param task The task to validate
   * @returns Result with validation errors if any
   */
  validateTaskState(task: Task): Result<boolean, string[]> {
    const errors: string[] = [];

    // Check if overdue
    if (task.isOverdue()) {
      errors.push('Task is overdue');
    }

    // Check if due date is too far in the future (e.g., more than 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (task.dueDate > oneYearFromNow) {
      errors.push('Due date is more than 1 year in the future');
    }

    if (errors.length > 0) {
      return Result.fail(errors);
    }

    return Result.ok(true);
  }
}
