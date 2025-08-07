import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(@Query('projectId') projectId?: number): Promise<Task[]> {
    if (projectId) {
      return this.tasksService.findByProject(projectId);
    }
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(+id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus
  ): Promise<Task> {
    return this.tasksService.updateStatus(+id, status);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string): Promise<Task[]> {
    return this.tasksService.findByProject(+projectId);
  }

  @Get('assignee/:userId')
  async findByAssignee(@Param('userId') userId: string): Promise<Task[]> {
    return this.tasksService.findByAssignee(+userId);
  }

  @Get('test')
  getTest() {
    return { ok: true };
  }
}
