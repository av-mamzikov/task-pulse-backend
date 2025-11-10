import {Repository} from 'typeorm';
import {ITaskRepository, TaskFilterOptions} from '@core/application/interfaces/ITaskRepository';
import {Task} from '@core/domain/entities/Task';
import {TaskEntity} from '../database/entities/TaskEntity';
import {TaskMapper} from '../database/mappers/TaskMapper';
import {AppDataSource} from '../database/data-source';

/**
 * TypeORM implementation of ITaskRepository
 * This class is part of the Infrastructure layer and depends on Core layer
 */
export class TaskRepository implements ITaskRepository {
  private repository: Repository<TaskEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(TaskEntity);
  }

  /**
   * Create a new task in the database
   */
  async create(task: Task): Promise<Task> {
    const entity = TaskMapper.toPersistence(task);
    const savedEntity = await this.repository.save(entity);
    return TaskMapper.toDomain(savedEntity);
  }

  /**
   * Find a task by its ID
   */
  async findById(id: string): Promise<Task | null> {
    const entity = await this.repository.findOne({
      where: {id},
    });

    if (!entity) {
      return null;
    }

    return TaskMapper.toDomain(entity);
  }

  /**
   * Find all tasks with optional filters
   */
  async findAll(filters?: TaskFilterOptions): Promise<Task[]> {
    const queryBuilder = this.repository.createQueryBuilder('task');

    // Apply filters if provided
    if (filters?.status) {
      queryBuilder.andWhere('task.status = :status', {status: filters.status});
    }

    if (filters?.priority) {
      queryBuilder.andWhere('task.priority = :priority', {priority: filters.priority});
    }

    // Order by due date (ascending) and created date (descending)
    queryBuilder.orderBy('task.dueDate', 'ASC').addOrderBy('task.createdAt', 'DESC');

    const entities = await queryBuilder.getMany();
    return TaskMapper.toDomainList(entities);
  }

  /**
   * Update an existing task
   */
  async update(task: Task): Promise<Task> {
    const entity = TaskMapper.toPersistence(task);

    // Ensure the task exists before updating
    const existingEntity = await this.repository.findOne({
      where: {id: task.id},
    });

    if (!existingEntity) {
      throw new Error(`Task with id ${task.id} not found`);
    }

    const updatedEntity = await this.repository.save(entity);
    return TaskMapper.toDomain(updatedEntity);
  }

  /**
   * Delete a task by its ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected > 0;
  }
}
