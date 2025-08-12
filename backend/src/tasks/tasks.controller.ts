import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto, UpdateTaskDto, AssignTaskDto } from './dto';

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
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid task id: ${id}`);
    }
    return this.tasksService.findOne(numId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid task id: ${id}`);
    }
    return this.tasksService.update(numId, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid task id: ${id}`);
    }
    return this.tasksService.remove(numId);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus
  ): Promise<Task> {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid task id: ${id}`);
    }
    return this.tasksService.updateStatus(numId, status);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string): Promise<Task[]> {
    const numProjectId = Number(projectId);
    if (isNaN(numProjectId)) {
      throw new BadRequestException(`Invalid project id: ${projectId}`);
    }
    return this.tasksService.findByProject(numProjectId);
  }

  @Get('assignee/:userId')
  async findByAssignee(@Param('userId') userId: string): Promise<Task[]> {
    const numUserId = Number(userId);
    if (isNaN(numUserId)) {
      throw new BadRequestException(`Invalid user id: ${userId}`);
    }
    return this.tasksService.findByAssignee(numUserId);
  }

  @Get('test')
  getTest() {
    return { ok: true };
  }

  @Get('unassigned')
async findUnassigned() {
  try {
    const tasks = await this.tasksService.findUnassigned(); 
    if (!Array.isArray(tasks)) {
      return [];
    }
    return tasks;
  } catch (error) {
    console.error('Error in /tasks/unassigned:', error);
    throw new BadRequestException('Failed to fetch unassigned tasks');
  }
}

  @Post(':id/assign')
  async assignTask(@Param('id') id: string, @Body() body: AssignTaskDto) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid task id: ${id}`);
    }
    return this.tasksService.assignTask(numId, body.userId);
  }

  @Post(':id/unassign')
  async unassignTask(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid task id: ${id}`);
    }
    return this.tasksService.unassignTask(numId);
  }
}