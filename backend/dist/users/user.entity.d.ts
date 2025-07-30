import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
export declare enum UserRole {
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    projects: Project[];
    tasks: Task[];
    hashPassword(): Promise<void>;
}
