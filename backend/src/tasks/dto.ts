import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { TaskStatus } from './task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  dueDate?: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsNumber()
  assigneeId?: number | null;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsNumber()
  assigneeId?: number | null;
}

export class AssignTaskDto {
  @IsInt()
  userId: number;
}