import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Prisma.UserCreateInput) {
    return await this.userService.createUser(userData);
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
