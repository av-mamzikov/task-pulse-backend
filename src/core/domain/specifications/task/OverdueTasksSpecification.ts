import {CompositeSpecification} from '../base/Specification';
import {TaskStatus} from '../../enums/TaskStatus';
import {ITaskForSpecification} from './ITaskForSpecification';

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
