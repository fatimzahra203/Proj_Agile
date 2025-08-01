import { UsersService } from './users.service';
import { UserRole } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findByRole(role: UserRole): Promise<import("./user.entity").User[]>;
}
