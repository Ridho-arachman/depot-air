/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma service
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

type userRegister = {
  username: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail({ email });
    console.log(user);

    if (!user?.credential || !user.credential.password) {
      throw new UnauthorizedException('email dan password salah');
    }
    const isPasswordValid = bcrypt.compareSync(
      password,
      user.credential.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  login(user: any) {
    const acces_token_payload = { email: user?.email, sub: user?.id };
    const refresh_token_payload = { sub: user?.id };
    return {
      message: 'Login Berhasil',
      status: 200,
      access_token: this.jwtService.sign(acces_token_payload, {
        expiresIn: '15m',
        secret: jwtConstants.acces_token_secret,
      }),
      refresh_token: this.jwtService.sign(refresh_token_payload, {
        expiresIn: '7d',
        secret: jwtConstants.refresh_token_secret,
      }),
    };
  }

  async register(user: userRegister): Promise<any> {
    const { password, email, username } = user;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const createUser = await this.prisma.users.create({
      data: {
        email,
        username,
        credential: { create: { password: hashedPassword } },
      },
    });
    if (!createUser) {
      throw new UnauthorizedException('Register Gagal');
    }
    return {
      message: 'Register Berhasil',
      status: 201,
    };
  }

  async oauthLogin(user: any) {
    const userExist = await this.usersService.findUserByEmail({
      email: user.email,
    });

    if (!userExist) {
      await this.usersService.createUser({
        username: user.username,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        id: user.id,
      });
    }

    const acces_token_payload = { email: userExist?.email, sub: userExist?.id };
    const refresh_token_payload = { sub: userExist?.id };

    return {
      message: 'Login Berhasil',
      status: 200,
      access_token: this.jwtService.sign(acces_token_payload, {
        expiresIn: '15m',
        secret: jwtConstants.acces_token_secret,
      }),
      refresh_token: this.jwtService.sign(refresh_token_payload, {
        expiresIn: '7d',
        secret: jwtConstants.refresh_token_secret,
      }),
    };
  }
}
