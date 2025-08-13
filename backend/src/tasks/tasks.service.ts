import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto';
import { UpdateTaskDto } from './dto';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { projectId, assigneeId, ...taskDetails } = createTaskDto;
    const task = this.tasksRepository.create(taskDetails);
    if (projectId) {
      const project = await this.projectsRepository.findOne({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }
      task.project = project;
    }
    if (assigneeId) {
      const assignee = await this.usersRepository.findOne({
        where: { id: assigneeId },
      });
      if (!assignee) {
        throw new NotFoundException(`User with ID ${assigneeId} not found`);
      }
      task.assignee = assignee;
    }
    return this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['project', 'assignee'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignee'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { projectId, assigneeId, ...taskDetails } = updateTaskDto;
    await this.findOne(id); // Check if task exists
    await this.tasksRepository.update(id, taskDetails);
    if (projectId !== undefined || assigneeId !== undefined) {
      const task = await this.findOne(id);
      if (projectId !== undefined) {
        if (projectId === null) {
          task.project = null;
        } else {
          const project = await this.projectsRepository.findOne({
            where: { id: projectId },
          });
          if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
          }
          task.project = project;
        }
      }
      if (assigneeId !== undefined) {
        if (assigneeId === null) {
          task.assignee = null;
        } else {
          const assignee = await this.usersRepository.findOne({
            where: { id: assigneeId },
          });
          if (!assignee) {
            throw new NotFoundException(`User with ID ${assigneeId} not found`);
          }
          task.assignee = assignee;
        }
      }
      await this.tasksRepository.save(task);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    if (!Object.values(TaskStatus).includes(status)) {
      throw new NotFoundException(`Invalid status value: ${status}`);
    }
    await this.tasksRepository.update(id, { status });
    const updated = await this.findOne(id);
    console.log(`Task ${id} status updated to:`, updated.status);
    return updated;
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { project: { id: projectId } },
      relations: ['assignee', 'project'],
    });
  }

  async findByAssignee(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assignee: { id: userId } },
      relations: ['project'],
    });
  }

  async findUnassigned(): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assignee: null },
      relations: ['project'],
    });
  }

  async assignTask(taskId: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    task.assignee = user;
    return this.tasksRepository.save(task);
  }

  async unassignTask(taskId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    task.assignee = null;
    return this.tasksRepository.save(task);
  }
}