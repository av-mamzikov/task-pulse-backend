import {CompositeSpecification} from '../base/Specification';
import {TaskStatus} from '../../enums/TaskStatus';

/**
 * Interface representing the minimum Task properties needed for this specification
 */
export interface ITaskForSpecification {
  status: TaskStatus;
}

/**
 * Specification for active (not completed) tasks
 */
export class ActiveTasksSpecification extends CompositeSpecification<ITaskForSpecification> {
  isSatisfiedBy(task: ITaskForSpecification): boolean {
    return task.status !== TaskStatus.Done;
  }
}
