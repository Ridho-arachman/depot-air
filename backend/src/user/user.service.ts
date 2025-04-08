import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { ApiResponse } from './interfaces/userInterface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<ApiResponse<User>> {
    try {
      const result = await this.prisma.user.create({
        data,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: 'Email already exists',
              error: 'Duplicate Entry',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const users = await this.prisma.user.findMany();
      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to get users',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
