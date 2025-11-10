import {IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength,} from 'class-validator';
import {Priority} from '@core/domain';

export class CreateTaskValidator {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @IsEnum(Priority, { message: 'Priority must be Low, Medium, or High' })
  @IsNotEmpty({ message: 'Priority is required' })
  priority!: Priority;

  @IsDateString({}, { message: 'Due date must be a valid date' })
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate!: string;
}
