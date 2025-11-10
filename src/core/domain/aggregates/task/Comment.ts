import {randomUUID} from 'crypto';
import {CommentText} from '../../value-objects/CommentText';

/**
 * Comment entity within the Task aggregate
 * Comments are not aggregate roots - they can only be accessed and modified through a Task
 */
export class Comment {
  private constructor(
    private readonly _id: string,
    private readonly _taskId: string,
    private readonly _text: CommentText,
    private readonly _createdAt: Date
  ) {
  }

  // Getters - read-only access to internal state
  get id(): string {
    return this._id;
  }

  get taskId(): string {
    return this._taskId;
  }

  get text(): string {
    return this._text.getValue();
  }

  get textObject(): CommentText {
    return this._text;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Internal factory method for creating a comment within a task
   * This should only be called by the Task aggregate root
   * @param taskId The ID of the task this comment belongs to
   * @param text The comment text
   * @returns A new Comment instance
   */
  static createForTask(taskId: string, text: CommentText): Comment {
    return new Comment(randomUUID(), taskId, text, new Date());
  }

  /**
   * Reconstructs a Comment from persistence
   * Used by the repository layer when loading from database
   */
  static reconstitute(
    id: string,
    taskId: string,
    text: CommentText,
    createdAt: Date
  ): Comment {
    return new Comment(id, taskId, text, createdAt);
  }

  /**
   * Gets the length of the comment text
   */
  getTextLength(): number {
    return this._text.getLength();
  }
}
