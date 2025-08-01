import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
export declare class Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    wipLimit: number;
    team: User[];
    tasks: Task[];
}
