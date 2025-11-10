import {Priority, Task, TaskStatus} from '@core/domain';

export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: Priority;
}

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: TaskFilterOptions): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
}
