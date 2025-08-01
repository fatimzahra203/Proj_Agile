import { IsString, IsDateString, IsInt, Min, IsArray, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description?: string; 

  @IsDateString()
  startDate: string;

  @IsInt()
  @Min(1)
  wipLimit: number;

  @IsArray()
  @IsOptional()
  team?: number[];
  
}