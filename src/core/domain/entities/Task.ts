import {DueDate, Priority, TaskDescription, TaskStatus, TaskTitle} from '@core/domain';

export class Task {
  id: string;
  title: TaskTitle;
  description: TaskDescription;
  priority: Priority;
  status: TaskStatus;
  dueDate: DueDate;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: TaskTitle,
    priority: Priority,
    dueDate: DueDate,
    description?: TaskDescription,
    status: TaskStatus = TaskStatus.New,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.title = title;
    this.description = description || new TaskDescription();
    this.priority = priority;
    this.status = status;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updateStatus(newStatus: TaskStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  update(
    title?: TaskTitle,
    description?: TaskDescription,
    priority?: Priority,
    dueDate?: DueDate
  ): void {
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (priority !== undefined) this.priority = priority;
    if (dueDate !== undefined) this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  // Методы для удобного доступа к значениям
  getTitleValue(): string {
    return this.title.getValue();
  }

  getDescriptionValue(): string | null {
    return this.description.getValue();
  }

  getDueDateValue(): Date {
    return this.dueDate.getValue();
  }

  isOverdue(): boolean {
    return this.dueDate.isOverdue();
  }

  daysUntilDue(): number {
    return this.dueDate.daysUntilDue();
  }
}
