import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
export declare class Project {
    id: number;
    name: string;
    owner: User;
    tasks: Task[];
}
