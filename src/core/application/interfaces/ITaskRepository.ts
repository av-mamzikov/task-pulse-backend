import {Priority, Specification, Task, TaskStatus} from '@core/domain';

export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: Priority;
}

/**
 * Repository interface for Task aggregate
 * Follows DDD repository pattern - works with aggregates, not individual entities
 */
export interface ITaskRepository {
  /**
   * Creates a new task
   * @param task The task aggregate to create
   * @returns The created task with events dispatched
   */
  create(task: Task): Promise<Task>;

  /**
   * Finds a task by its ID
   * @param id The task ID
   * @returns The task if found, null otherwise
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Finds a task by ID with all comments loaded (full aggregate)
   * @param id The task ID
   * @returns The task with comments if found, null otherwise
   */
  findByIdWithComments(id: string): Promise<Task | null>;

  /**
   * Finds all tasks matching the given filters
   * @param filters Optional filters to apply
   * @returns Array of tasks
   */
  findAll(filters?: TaskFilterOptions): Promise<Task[]>;

  /**
   * Finds tasks matching a specification
   * @param spec The specification to match
   * @returns Array of tasks satisfying the specification
   */
  findBySpecification(spec: Specification<Task>): Promise<Task[]>;

  /**
   * Updates an existing task
   * @param task The task aggregate to update
   * @returns The updated task with events dispatched
   */
  update(task: Task): Promise<Task>;

  /**
   * Deletes a task by its ID
   * @param id The task ID
   * @returns True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;
}
