import {randomUUID} from 'crypto';
import {AggregateRoot} from '../../events/base/AggregateRoot';
import {TaskTitle} from '../../value-objects/TaskTitle';
import {TaskDescription} from '../../value-objects/TaskDescription';
import {DueDate} from '../../value-objects/DueDate';
import {Priority} from '../../enums/Priority';
import {TaskStatus} from '../../enums/TaskStatus';
import {CommentText} from '../../value-objects/CommentText';
import {Comment} from './Comment';
import {
  TaskCompleted,
  TaskCreated,
  TaskDeleted,
  TaskDescriptionChanged,
  TaskDueDateChanged,
  TaskPriorityChanged,
  TaskStatusChanged,
  TaskTitleChanged,
} from '../../events/task';
import {CommentAdded, CommentDeleted} from '../../events/comment';
import {CommentNotFoundException, InvalidDueDateException, InvalidStatusTransitionException,} from '../../exceptions';

/**
 * Task Aggregate Root
 * The Task is the entry point to the Task aggregate, which includes Comments
 * All business logic and invariants are enforced through this aggregate root
 */
export class Task extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _title: TaskTitle,
    private _description: TaskDescription,
    private _priority: Priority,
    private _status: TaskStatus,
    private _dueDate: DueDate,
    private _comments: Comment[],
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    super();
  }

  // Getters - read-only access to internal state
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title.getValue();
  }

  get titleObject(): TaskTitle {
    return this._title;
  }

  get description(): string | null {
    return this._description.getValue();
  }

  get descriptionObject(): TaskDescription {
    return this._description;
  }

  get priority(): Priority {
    return this._priority;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get dueDate(): Date {
    return this._dueDate.getValue();
  }

  get dueDateObject(): DueDate {
    return this._dueDate;
  }

  get comments(): ReadonlyArray<Comment> {
    return this._comments;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Gets the number of comments on this task
   */
  get commentCount(): number {
    return this._comments.length;
  }

  /**
   * Factory method for creating a new Task
   * @param title Task title
   * @param priority Task priority
   * @param dueDate Task due date
   * @param description Optional task description
   * @returns A new Task instance with TaskCreated event
   */
  static create(
    title: TaskTitle,
    priority: Priority,
    dueDate: DueDate,
    description?: TaskDescription
  ): Task {
    const id = randomUUID();
    const now = new Date();
    const task = new Task(
      id,
      title,
      description || new TaskDescription(),
      priority,
      TaskStatus.New,
      dueDate,
      [],
      now,
      now
    );

    // Raise domain event
    task.addDomainEvent(
      new TaskCreated(id, title.getValue(), priority, dueDate.getValue())
    );

    return task;
  }

  /**
   * Reconstructs a Task from persistence
   * Used by the repository layer when loading from database
   */
  static reconstitute(
    id: string,
    title: TaskTitle,
    description: TaskDescription,
    priority: Priority,
    status: TaskStatus,
    dueDate: DueDate,
    comments: Comment[],
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(
      id,
      title,
      description,
      priority,
      status,
      dueDate,
      comments,
      createdAt,
      updatedAt
    );
  }

  /**
   * Changes the task status with business rule validation
   * @param newStatus The new status
   * @throws InvalidStatusTransitionException if the transition is not allowed
   */
  changeStatus(newStatus: TaskStatus): void {
    if (this._status === newStatus) {
      return; // No change needed
    }

    // Validate status transition
    this.validateStatusTransition(newStatus);

    const oldStatus = this._status;
    this._status = newStatus;
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(new TaskStatusChanged(this._id, oldStatus, newStatus));

    // If transitioning to Done, raise TaskCompleted event
    if (newStatus === TaskStatus.Done) {
      this.addDomainEvent(new TaskCompleted(this._id, new Date()));
    }
  }

  /**
   * Changes the task priority
   * @param newPriority The new priority
   */
  changePriority(newPriority: Priority): void {
    if (this._priority === newPriority) {
      return; // No change needed
    }

    const oldPriority = this._priority;
    this._priority = newPriority;
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(new TaskPriorityChanged(this._id, oldPriority, newPriority));
  }

  /**
   * Updates the task title
   * @param newTitle The new title
   */
  updateTitle(newTitle: TaskTitle): void {
    const oldTitle = this._title.getValue();
    const newTitleValue = newTitle.getValue();

    if (oldTitle === newTitleValue) {
      return; // No change needed
    }

    this._title = newTitle;
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(new TaskTitleChanged(this._id, oldTitle, newTitleValue));
  }

  /**
   * Updates the task description
   * @param newDescription The new description
   */
  updateDescription(newDescription: TaskDescription): void {
    const oldDescription = this._description.getValue();
    const newDescriptionValue = newDescription.getValue();

    if (oldDescription === newDescriptionValue) {
      return; // No change needed
    }

    this._description = newDescription;
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(
      new TaskDescriptionChanged(this._id, oldDescription, newDescriptionValue)
    );
  }

  /**
   * Changes the task due date
   * @param newDueDate The new due date
   * @throws InvalidDueDateException if the new due date is in the past
   */
  changeDueDate(newDueDate: DueDate): void {
    const oldDueDateValue = this._dueDate.getValue();
    const newDueDateValue = newDueDate.getValue();

    if (oldDueDateValue.getTime() === newDueDateValue.getTime()) {
      return; // No change needed
    }

    // Business rule: Cannot set due date to the past
    if (newDueDateValue < new Date()) {
      throw new InvalidDueDateException(newDueDateValue);
    }

    this._dueDate = newDueDate;
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(
      new TaskDueDateChanged(this._id, oldDueDateValue, newDueDateValue)
    );
  }

  /**
   * Adds a comment to the task
   * @param text The comment text
   * @returns The created Comment
   */
  addComment(text: CommentText): Comment {
    const comment = Comment.createForTask(this._id, text);
    this._comments.push(comment);
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(new CommentAdded(this._id, comment.id, text.getValue()));

    return comment;
  }

  /**
   * Removes a comment from the task
   * @param commentId The ID of the comment to remove
   * @throws CommentNotFoundException if the comment doesn't exist
   */
  removeComment(commentId: string): void {
    const index = this._comments.findIndex((c) => c.id === commentId);
    if (index === -1) {
      throw new CommentNotFoundException(commentId);
    }

    this._comments.splice(index, 1);
    this._updatedAt = new Date();

    // Raise domain event
    this.addDomainEvent(new CommentDeleted(this._id, commentId));
  }

  /**
   * Completes the task (shorthand for changeStatus(TaskStatus.Done))
   */
  complete(): void {
    this.changeStatus(TaskStatus.Done);
  }

  /**
   * Reopens a completed task (shorthand for changeStatus(TaskStatus.InProgress))
   */
  reopen(): void {
    this.changeStatus(TaskStatus.InProgress);
  }

  /**
   * Marks the task as deleted
   * Note: This doesn't actually delete the task, just marks it for deletion
   */
  markAsDeleted(): void {
    this.addDomainEvent(new TaskDeleted(this._id, new Date()));
  }

  /**
   * Checks if the task is overdue
   */
  isOverdue(): boolean {
    return this._dueDate.isOverdue() && this._status !== TaskStatus.Done;
  }

  /**
   * Gets the number of days until the task is due
   */
  daysUntilDue(): number {
    return this._dueDate.daysUntilDue();
  }

  /**
   * Validates if a status transition is allowed
   * Business rules:
   * - New → InProgress → Done
   * - Done → InProgress (reopen)
   * - Cannot go directly from New → Done
   */
  private validateStatusTransition(newStatus: TaskStatus): void {
    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.New]: [TaskStatus.InProgress],
      [TaskStatus.InProgress]: [TaskStatus.Done],
      [TaskStatus.Done]: [TaskStatus.InProgress], // Allow reopening
    };

    const allowedStatuses = validTransitions[this._status];
    if (!allowedStatuses.includes(newStatus)) {
      throw new InvalidStatusTransitionException(this._status, newStatus);
    }
  }
}
