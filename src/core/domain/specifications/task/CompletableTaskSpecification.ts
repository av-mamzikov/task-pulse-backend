import {CompositeSpecification} from '../base/Specification';
import {TaskStatus} from '../../enums/TaskStatus';
import {ITaskForSpecification} from './ITaskForSpecification';

/**
 * Specification for tasks that can be completed
 * A task can be completed if it's currently in progress
 * Future: Can be extended to check for open subtasks
 */
export class CompletableTaskSpecification extends CompositeSpecification<ITaskForSpecification> {
  isSatisfiedBy(task: ITaskForSpecification): boolean {
    return task.status === TaskStatus.InProgress;
  }
}
