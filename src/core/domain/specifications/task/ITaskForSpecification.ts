import {TaskStatus} from '../../enums/TaskStatus';
import {Priority} from '../../enums/Priority';

/**
 * Interface representing the minimum Task properties needed for specifications
 * This allows specifications to work with any object that has these properties
 */
export interface ITaskForSpecification {
  dueDate: Date;
  status: TaskStatus;
  priority: Priority;
}
