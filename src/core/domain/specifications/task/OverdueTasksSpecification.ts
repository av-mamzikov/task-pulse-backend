import {CompositeSpecification} from '../base/Specification';
import {TaskStatus} from '../../enums/TaskStatus';

/**
 * Interface representing the minimum Task properties needed for specifications
 */
export interface ITaskForSpecification {
  dueDate: Date;
  status: TaskStatus;
}

/**
 * Specification for tasks that are overdue
 * A task is overdue if its due date has passed and it's not completed
 */
export class OverdueTasksSpecification extends CompositeSpecification<ITaskForSpecification> {
  isSatisfiedBy(task: ITaskForSpecification): boolean {
    const now = new Date();
    return task.dueDate < now && task.status !== TaskStatus.Done;
  }
}
