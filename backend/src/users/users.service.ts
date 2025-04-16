import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FindOne } from './dto/findOne.dto';
import { CreateUser } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name);
  private readonly SLOW_QUERY_THRESHOLD = 100;

  async findOne({ email }: FindOne): Promise<User> {
    const startTime = performance.now();

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      const queryTime = Math.floor(performance.now() - startTime);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (queryTime > this.SLOW_QUERY_THRESHOLD) {
        this.logger.warn({
          message: 'Slow query detected',
          operation: 'findOne',
          duration: queryTime,
          threshold: this.SLOW_QUERY_THRESHOLD,
        });
      }

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw error;
    }
  }

  async createUser(data: CreateUser): Promise<User> {
    const startTime = performance.now();

    try {
      const user = await this.prisma.user.create({ data });

      const queryTime = Math.floor(performance.now() - startTime);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (queryTime > this.SLOW_QUERY_THRESHOLD) {
        this.logger.warn({
          message: 'Slow query detected',
          operation: 'findOne',
          duration: queryTime,
          threshold: this.SLOW_QUERY_THRESHOLD,
        });
      }

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        } else if (error.code === 'P2002') {
          throw new NotFoundException('Email already exists');
        }
      }
      throw error;
    }
  }
}
