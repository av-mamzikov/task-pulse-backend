import {IsEnum, IsOptional} from 'class-validator';
import {Priority, TaskStatus} from '@core/domain';

export class FilterTasksValidator {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be New, InProgress, or Done',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be Low, Medium, or High' })
  priority?: Priority;
}
