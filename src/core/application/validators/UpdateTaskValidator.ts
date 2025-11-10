import {IsDateString, IsEnum, IsOptional, IsString, Length, MaxLength,} from 'class-validator';
import {Priority} from '@core/domain';

export class UpdateTaskValidator {
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be Low, Medium, or High' })
  priority?: Priority;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date' })
  dueDate?: string;
}
