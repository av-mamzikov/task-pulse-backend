import {Priority} from '@core/domain';

export class CreateTaskDto {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: Date;

  constructor(
    title: string,
    priority: Priority,
    dueDate: Date,
    description?: string
  ) {
    this.title = title;
    this.priority = priority;
    this.dueDate = dueDate;
    this.description = description;
  }
}
