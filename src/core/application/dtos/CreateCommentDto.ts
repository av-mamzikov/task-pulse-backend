export class CreateCommentDto {
  taskId: string;
  text: string;

  constructor(taskId: string, text: string) {
    this.taskId = taskId;
    this.text = text;
  }
}
