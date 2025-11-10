import {Comment} from '@core/domain/aggregates/task/Comment';
import {CommentText} from '@core/domain/value-objects/CommentText';
import {CommentEntity} from '../entities/CommentEntity';

/**
 * Mapper class to convert between domain Comment and database CommentEntity
 * Following DDD principles - Infrastructure depends on Domain
 * Comments are part of the Task aggregate
 */
export class CommentMapper {
  /**
   * Convert domain Comment to database CommentEntity
   */
  static toPersistence(comment: Comment): CommentEntity {
    const entity = new CommentEntity();
    entity.id = comment.id;
    entity.taskId = comment.taskId;
    entity.text = comment.text;
    entity.createdAt = comment.createdAt;
    return entity;
  }

  /**
   * Convert database CommentEntity to domain Comment
   * Uses reconstitute to rebuild the comment from persistence
   */
  static toDomain(entity: CommentEntity): Comment {
    const text = new CommentText(entity.text);
    return Comment.reconstitute(entity.id, entity.taskId, text, entity.createdAt);
  }

  /**
   * Convert array of CommentEntity to array of Comment
   */
  static toDomainList(entities: CommentEntity[]): Comment[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
