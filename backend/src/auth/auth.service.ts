import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { SignInRes } from './interfaces/interface.signInRes';
import { jwtConstants } from './constants';
import { SignUpDto } from './dto/signUp.dto';
// import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<SignInRes> {
    const user = await this.usersService.findOne({ email });

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (isPasswordValid) {
      const payload = { sub: user.id, email: user.email };

      const access_token = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.acces_token_secret,
        expiresIn: '1h',
      });

      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.refresh_token_secret,
        expiresIn: '7d',
      });

      return {
        status: 200,
        message: 'Successfully signed in',
        access_token: access_token,
        refresh_token: refresh_token,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async signUp({ email, name, password }: SignUpDto) {
    try {
      await this.usersService.createUser({ email, name, password });
      return {
        status: 201,
        message: 'Successfully signed up',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
