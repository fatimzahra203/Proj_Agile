import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        message: string;
        user: {
            id: any;
            email: string;
            username: string;
            role: import("../../users/user.entity").UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        message: string;
        user: {
            id: any;
            email: string;
            username: any;
            role: any;
        };
    }>;
}
