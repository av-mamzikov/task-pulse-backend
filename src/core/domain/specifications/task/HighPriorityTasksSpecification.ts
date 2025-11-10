import {CompositeSpecification} from '../base/Specification';
import {Priority} from '../../enums/Priority';
import {ITaskForSpecification} from './ITaskForSpecification';

/**
 * Specification for high priority tasks
 */
export class HighPriorityTasksSpecification extends CompositeSpecification<ITaskForSpecification> {
  isSatisfiedBy(task: ITaskForSpecification): boolean {
    return task.priority === Priority.High;
  }
}
