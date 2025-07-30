import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto';
import { LoginDto } from './dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt'; // Ajoute cette ligne

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, role } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }
    const user = this.userRepository.create({ username, email, password, role });
    await this.userRepository.save(user);
    return { success: true, message: 'User registered', user: { id: user.id, email, username, role } };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: 'Invalid credentials' };
    }
    return { success: true, message: 'Login successful', user: { id: user.id, email, username: user.username, role: user.role } };
  }
}