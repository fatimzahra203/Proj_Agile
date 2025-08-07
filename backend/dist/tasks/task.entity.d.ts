import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';
export declare enum TaskStatus {
    TODO = "todo",
    READY = "ready",
    ONGOING = "ongoing",
    ONHOLD = "onhold",
    DONE = "done"
}
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: Date;
    project: Project;
    assignee: User;
}
