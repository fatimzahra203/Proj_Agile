import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findByRole(@Query('role') role: UserRole) {
    return this.usersService.findByRole(role); // Implement in users.service.ts
  }
}