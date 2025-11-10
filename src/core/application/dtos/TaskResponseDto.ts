import {Priority, Task, TaskStatus} from '@core/domain';

export class TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
  daysUntilDue: number;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.getTitleValue();
    this.description = task.getDescriptionValue();
    this.priority = task.priority;
    this.status = task.status;
    this.dueDate = task.getDueDateValue();
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.isOverdue = task.isOverdue();
    this.daysUntilDue = task.daysUntilDue();
  }

  static fromTask(task: Task): TaskResponseDto {
    return new TaskResponseDto(task);
  }

  static fromTasks(tasks: Task[]): TaskResponseDto[] {
    return tasks.map((task) => new TaskResponseDto(task));
  }
}
