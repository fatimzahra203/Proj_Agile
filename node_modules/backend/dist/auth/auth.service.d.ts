import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './dto';
import { User } from '../users/user.entity';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
}
