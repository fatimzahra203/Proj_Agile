import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto, UpdateTaskDto, AssignTaskDto } from './dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(projectId?: number): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: TaskStatus): Promise<Task>;
    findByProject(projectId: string): Promise<Task[]>;
    findByAssignee(userId: string): Promise<Task[]>;
    getTest(): {
        ok: boolean;
    };
    findUnassigned(): Promise<Task[]>;
    assignTask(id: string, body: AssignTaskDto): Promise<Task>;
    unassignTask(id: string): Promise<Task>;
}
