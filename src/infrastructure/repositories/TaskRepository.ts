import {Repository} from 'typeorm';
import {ITaskRepository, TaskFilterOptions} from '@core/application/interfaces/ITaskRepository';
import {IEventDispatcher, Specification, Task} from '@core/domain';
import {TaskEntity} from '../database/entities/TaskEntity';
import {CommentEntity} from '../database/entities/CommentEntity';
import {TaskMapper} from '../database/mappers/TaskMapper';
import {CommentMapper} from '../database/mappers/CommentMapper';
import {AppDataSource} from '../database/data-source';
import {logger} from '../logger';

/**
 * TypeORM implementation of ITaskRepository following DDD principles
 * Manages the Task aggregate including its comments
 * Dispatches domain events after successful persistence
 */
export class TaskRepository implements ITaskRepository {
  private taskRepository: Repository<TaskEntity>;
  private commentRepository: Repository<CommentEntity>;

  constructor(private eventDispatcher: IEventDispatcher) {
    this.taskRepository = AppDataSource.getRepository(TaskEntity);
    this.commentRepository = AppDataSource.getRepository(CommentEntity);
  }

  /**
   * Create a new task in the database
   * Saves the entire aggregate (task + comments) and dispatches domain events
   */
  async create(task: Task): Promise<Task> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save task entity
      const taskEntity = TaskMapper.toPersistence(task);
      const savedTaskEntity = await queryRunner.manager.save(TaskEntity, taskEntity);

      // Save comment entities
      const commentEntities = task.comments.map((comment) =>
        CommentMapper.toPersistence(comment)
      );
      const savedCommentEntities = await queryRunner.manager.save(
        CommentEntity,
        commentEntities
      );

      await queryRunner.commitTransaction();

      // Dispatch domain events after successful commit
      await this.dispatchEvents(task);

      // Return reconstituted aggregate
      return TaskMapper.toDomain(savedTaskEntity, savedCommentEntities);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating task:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find a task by its ID (without comments)
   */
  async findById(id: string): Promise<Task | null> {
    const entity = await this.taskRepository.findOne({
      where: {id},
    });

    if (!entity) {
      return null;
    }

    return TaskMapper.toDomain(entity);
  }

  /**
   * Find a task by ID with all comments loaded (full aggregate)
   */
  async findByIdWithComments(id: string): Promise<Task | null> {
    const taskEntity = await this.taskRepository.findOne({
      where: {id},
    });

    if (!taskEntity) {
      return null;
    }

    const commentEntities = await this.commentRepository.find({
      where: {taskId: id},
      order: {createdAt: 'ASC'},
    });

    return TaskMapper.toDomain(taskEntity, commentEntities);
  }

  /**
   * Find all tasks with optional filters
   */
  async findAll(filters?: TaskFilterOptions): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

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
   * Find tasks matching a specification
   * Loads all tasks and filters them using the specification
   */
  async findBySpecification(spec: Specification<Task>): Promise<Task[]> {
    const allTasks = await this.findAll();
    return allTasks.filter((task) => spec.isSatisfiedBy(task));
  }

  /**
   * Update an existing task
   * Updates the entire aggregate and dispatches domain events
   */
  async update(task: Task): Promise<Task> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Ensure the task exists
      const existingEntity = await this.taskRepository.findOne({
        where: {id: task.id},
      });

      if (!existingEntity) {
        throw new Error(`Task with id ${task.id} not found`);
      }

      // Update task entity
      const taskEntity = TaskMapper.toPersistence(task);
      const updatedTaskEntity = await queryRunner.manager.save(TaskEntity, taskEntity);

      // Delete existing comments and save new ones
      await queryRunner.manager.delete(CommentEntity, {taskId: task.id});
      const commentEntities = task.comments.map((comment) =>
        CommentMapper.toPersistence(comment)
      );
      const savedCommentEntities = await queryRunner.manager.save(
        CommentEntity,
        commentEntities
      );

      await queryRunner.commitTransaction();

      // Dispatch domain events after successful commit
      await this.dispatchEvents(task);

      // Return reconstituted aggregate
      return TaskMapper.toDomain(updatedTaskEntity, savedCommentEntities);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error updating task:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Delete a task by its ID
   * Also deletes all associated comments (cascade)
   */
  async delete(id: string): Promise<boolean> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete comments first
      await queryRunner.manager.delete(CommentEntity, {taskId: id});

      // Delete task
      const result = await queryRunner.manager.delete(TaskEntity, id);

      await queryRunner.commitTransaction();

      return result.affected !== null && result.affected > 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error deleting task:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Dispatches all domain events from the aggregate
   * @param task The task aggregate with events
   */
  private async dispatchEvents(task: Task): Promise<void> {
    const events = task.getDomainEvents();

    for (const event of events) {
      try {
        await this.eventDispatcher.dispatch(event);
      } catch (error) {
        logger.error(`Error dispatching event ${event.eventName}:`, error);
        // Don't throw - event dispatch failures shouldn't fail the transaction
      }
    }

    task.clearDomainEvents();
  }
}
