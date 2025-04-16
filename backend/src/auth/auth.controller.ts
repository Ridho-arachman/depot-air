import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInRes } from './interfaces/interface.signInRes';
import { SignUpDto } from './dto/signUp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Body() signInDto: SignInDto): Promise<SignInRes> {
    return this.authService.signIn(signInDto);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
