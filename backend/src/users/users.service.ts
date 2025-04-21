import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Credentials, Prisma, Users } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, findUserByEmail } from './interfaces/user-interface';

type UserWithCredential = Users & { credential: Credentials | null };
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail({
    email,
  }: findUserByEmail): Promise<UserWithCredential | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { email },
        include: { credential: true },
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError; // type assertion
      if (prismaError.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async createUser(data: CreateUser): Promise<Users> {
    try {
      return await this.prisma.users.create({
        data: {
          username: data.username,
          email: data.email,
          provider: data.provider,
          path_image: data.avatar,
          user_oauth: {
            create: {
              oauthId: data.id,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Email sudah digunakan');
        }
      }
      throw new InternalServerErrorException('Gagal membuat user');
    }
  }
}
