import {IsEnum, IsNotEmpty} from 'class-validator';
import {TaskStatus} from '@core/domain';

export class UpdateTaskStatusValidator {
  @IsEnum(TaskStatus, {
    message: 'Status must be New, InProgress, or Done',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status!: TaskStatus;
}
