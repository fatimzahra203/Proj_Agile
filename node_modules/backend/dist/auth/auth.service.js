"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(registerDto) {
        try {
            console.log('Register DTO:', registerDto);
            const { username, email, password, role } = registerDto;
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new common_1.BadRequestException('Email already exists');
            }
            const user = this.userRepository.create({ username, email, password, role });
            await this.userRepository.save(user);
            return { success: true, message: 'User registered', user: { id: user.id, email, username, role } };
        }
        catch (error) {
            console.error('Registration error:', error);
            throw new common_1.BadRequestException(error.message || 'Registration failed');
        }
    }
    async login(loginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            return { success: true, message: 'Login successful', user: { id: user.id, email, username: user.username, role: user.role } };
        }
        catch (error) {
            console.error('Login error:', error);
            throw new common_1.BadRequestException(error.message || 'Login failed');
        }
    }
    async forgotPassword(email) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new common_1.BadRequestException('No user found with this email');
            }
            const newPassword = this.generateRandomPassword();
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.userRepository.update({ email }, { password: hashedPassword });
            console.log(`New password for ${email}: ${newPassword}`);
            return newPassword;
        }
        catch (error) {
            console.error('Forgot password error:', error);
            throw new common_1.BadRequestException(error.message || 'Failed to reset password');
        }
    }
    generateRandomPassword(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map