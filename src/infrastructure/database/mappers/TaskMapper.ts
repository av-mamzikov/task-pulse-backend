import {Task} from '@core/domain/entities/Task';
import {TaskTitle} from '@core/domain/value-objects/TaskTitle';
import {TaskDescription} from '@core/domain/value-objects/TaskDescription';
import {DueDate} from '@core/domain/value-objects/DueDate';
import {TaskEntity} from '../entities/TaskEntity';

/**
 * Mapper class to convert between domain Task and database TaskEntity
 * Following Clean Architecture principles - Infrastructure depends on Domain
 */
export class TaskMapper {
  /**
   * Convert domain Task to database TaskEntity
   */
  static toPersistence(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = task.id;
    entity.title = task.getTitleValue();
    entity.description = task.getDescriptionValue();
    entity.priority = task.priority;
    entity.status = task.status;
    entity.dueDate = task.getDueDateValue();
    entity.createdAt = task.createdAt;
    entity.updatedAt = task.updatedAt;
    return entity;
  }

  /**
   * Convert database TaskEntity to domain Task
   */
  static toDomain(entity: TaskEntity): Task {
    const title = new TaskTitle(entity.title);
    const description = entity.description
      ? new TaskDescription(entity.description)
      : new TaskDescription();
    const dueDate = new DueDate(entity.dueDate);

    return new Task(
      entity.id,
      title,
      entity.priority,
      dueDate,
      description,
      entity.status,
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
