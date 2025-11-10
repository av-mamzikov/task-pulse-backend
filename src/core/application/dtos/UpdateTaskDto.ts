import {Priority} from '@core/domain';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;

  constructor(
    title?: string,
    description?: string,
    priority?: Priority,
    dueDate?: Date
  ) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
  }
}
