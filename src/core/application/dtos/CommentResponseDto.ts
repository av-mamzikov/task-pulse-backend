import {Comment} from '@core/domain';

export class CommentResponseDto {
  id: string;
  taskId: string;
  text: string;
  textLength: number;
  createdAt: Date;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.taskId = comment.taskId;
    this.text = comment.getTextValue();
    this.textLength = comment.getTextLength();
    this.createdAt = comment.createdAt;
  }

  static fromComment(comment: Comment): CommentResponseDto {
    return new CommentResponseDto(comment);
  }

  static fromComments(comments: Comment[]): CommentResponseDto[] {
    return comments.map((comment) => new CommentResponseDto(comment));
  }
}
