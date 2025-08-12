import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByRole(role: UserRole): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(createUserDto: {
        username: string;
        email: string;
        password: string;
        role: UserRole;
    }): Promise<User>;
    update(id: number, updateUserDto: {
        username: string;
        email: string;
        role: UserRole;
    }): Promise<User>;
    remove(id: number): Promise<void>;
}
