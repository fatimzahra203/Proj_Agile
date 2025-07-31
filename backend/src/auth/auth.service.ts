// auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      console.log('Register DTO:', registerDto); // Debug log
      const { username, email, password, role } = registerDto;
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      const user = this.userRepository.create({ username, email, password, role });
      await this.userRepository.save(user); // Password hashed by @BeforeInsert
      return { success: true, message: 'User registered', user: { id: user.id, email, username, role } };
    } catch (error) {
      console.error('Registration error:', error);
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid credentials');
      }
      return { success: true, message: 'Login successful', user: { id: user.id, email, username: user.username, role: user.role } };
    } catch (error) {
      console.error('Login error:', error);
      throw new BadRequestException(error.message || 'Login failed');
    }
  }
}