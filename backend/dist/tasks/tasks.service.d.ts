import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto';
import { UpdateTaskDto } from './dto';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    private usersRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>, usersRepository: Repository<User>);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, status: TaskStatus): Promise<Task>;
    findByProject(projectId: number): Promise<Task[]>;
    findByAssignee(userId: number): Promise<Task[]>;
}
