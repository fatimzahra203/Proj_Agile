import { UsersService } from './users.service';
import { UserRole } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findByRole(role: string): Promise<import("./user.entity").User[]>;
    create(createUserDto: {
        username: string;
        email: string;
        password: string;
        role: UserRole;
    }): Promise<import("./user.entity").User>;
    update(id: string, updateUserDto: {
        username: string;
        email: string;
        role: UserRole;
    }): Promise<import("./user.entity").User>;
    remove(id: string): Promise<void>;
}
