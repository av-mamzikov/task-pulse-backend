import {CompositeSpecification} from '../base/Specification';
import {Priority} from '../../enums/Priority';

/**
 * Interface representing the minimum Task properties needed for this specification
 */
export interface ITaskForSpecification {
  priority: Priority;
}

/**
 * Specification for high priority tasks
 */
export class HighPriorityTasksSpecification extends CompositeSpecification<ITaskForSpecification> {
  isSatisfiedBy(task: ITaskForSpecification): boolean {
    return task.priority === Priority.High;
  }
}
