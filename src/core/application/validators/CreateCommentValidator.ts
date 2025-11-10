import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentValidator {
  @IsUUID('4', { message: 'Task ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Task ID is required' })
  taskId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Comment text is required' })
  text!: string;
}
