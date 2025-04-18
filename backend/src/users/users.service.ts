import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FindOne } from './dto/findOne.dto';
import { CreateUser } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne({ email }: FindOne): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async createUser(data: CreateUser): Promise<User> {
    try {
      const user = await this.prisma.user.create({ data });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        } else if (error.code === 'P2002') {
          throw new BadRequestException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
