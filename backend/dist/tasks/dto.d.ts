import { TaskStatus } from './task.entity';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
    projectId: number;
    assigneeId?: number | null;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
    projectId?: number;
    assigneeId?: number | null;
}
export declare class AssignTaskDto {
    userId: number;
}
