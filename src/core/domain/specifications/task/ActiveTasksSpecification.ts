import {CompositeSpecification} from '../base/Specification';
import {TaskStatus} from '../../enums/TaskStatus';
import {ITaskForSpecification} from './ITaskForSpecification';

/**
 * Specification for active (not completed) tasks
 */
export class ActiveTasksSpecification extends CompositeSpecification<ITaskForSpecification> {
  isSatisfiedBy(task: ITaskForSpecification): boolean {
    return task.status !== TaskStatus.Done;
  }
}
