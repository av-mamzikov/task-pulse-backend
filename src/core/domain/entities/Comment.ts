import { CommentText } from '../value-objects/CommentText';

export class Comment {
  id: string;
  taskId: string;
  text: CommentText;
  createdAt: Date;

  constructor(
    id: string,
    taskId: string,
    text: CommentText,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.taskId = taskId;
    this.text = text;
    this.createdAt = createdAt;
  }

  // Метод для удобного доступа к значению
  getTextValue(): string {
    return this.text.getValue();
  }

  getTextLength(): number {
    return this.text.getLength();
  }
}
