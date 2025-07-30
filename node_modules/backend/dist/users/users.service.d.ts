import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepo;
    constructor(usersRepo: Repository<User>);
    findAll(): Promise<User[]>;
}
