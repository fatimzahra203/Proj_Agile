import { Controller, Get, Post, Patch, Delete, Query, Param, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findByRole(@Query('role') role: string) {
    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException(`Invalid or missing role: ${role || 'not provided'}`);
    }
    return this.usersService.findByRole(role as UserRole);
  }

  @Post()
  async create(@Body() createUserDto: { username: string; email: string; password: string; role: UserRole }) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: { username: string; email: string; role: UserRole }) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid user id: ${id}`);
    }
    return this.usersService.update(numId, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException(`Invalid user id: ${id}`);
    }
    return this.usersService.remove(numId);
  }
}