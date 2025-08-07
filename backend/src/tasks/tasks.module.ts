import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, User]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
