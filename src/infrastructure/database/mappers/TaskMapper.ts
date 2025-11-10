import {Task} from '@core/domain/aggregates/task/Task';
import {Comment} from '@core/domain/aggregates/task/Comment';
import {TaskTitle} from '@core/domain/value-objects/TaskTitle';
import {TaskDescription} from '@core/domain/value-objects/TaskDescription';
import {DueDate} from '@core/domain/value-objects/DueDate';
import {TaskEntity} from '../entities/TaskEntity';
import {CommentEntity} from '../entities/CommentEntity';
import {CommentMapper} from './CommentMapper';

/**
 * Mapper class to convert between domain Task aggregate and database TaskEntity
 * Following DDD principles - Infrastructure depends on Domain
 * Handles mapping of the entire aggregate including comments
 */
export class TaskMapper {
  /**
   * Convert domain Task aggregate to database TaskEntity
   * Note: Comments are saved separately through the repository
   */
  static toPersistence(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = task.id;
    entity.title = task.title;
    entity.description = task.description;
    entity.priority = task.priority;
    entity.status = task.status;
    entity.dueDate = task.dueDate;
    entity.createdAt = task.createdAt;
    entity.updatedAt = task.updatedAt;
    return entity;
  }

  /**
   * Convert database TaskEntity to domain Task aggregate
   * Uses reconstitute to rebuild the aggregate from persistence
   * @param entity The task entity
   * @param commentEntities Optional comment entities to include in the aggregate
   */
  static toDomain(entity: TaskEntity, commentEntities: CommentEntity[] = []): Task {
    const title = new TaskTitle(entity.title);
    const description = entity.description
      ? new TaskDescription(entity.description)
      : new TaskDescription();
    const dueDate = new DueDate(entity.dueDate);

    // Map comments
    const comments: Comment[] = CommentMapper.toDomainList(commentEntities);

    return Task.reconstitute(
      entity.id,
      title,
      description,
      entity.priority,
      entity.status,
      dueDate,
      comments,
      entity.createdAt,
      entity.updatedAt
    );
  }

  /**
   * Convert array of TaskEntity to array of Task
   */
  static toDomainList(entities: TaskEntity[]): Task[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
