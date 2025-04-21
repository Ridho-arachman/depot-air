/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // CREDENTIALS
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  login(@Body() body: SignInDto, @Req() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() body: SignUpDto) {
    return this.authService.register(body);
  }

  // GOOGLE
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/redirect')
  @HttpCode(200)
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req) {
    return this.authService.oauthLogin(req.user);
  }

  //GITHUB
  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {}

  @Get('github/redirect')
  @HttpCode(200)
  @UseGuards(GithubAuthGuard)
  githubRedirect(@Req() req) {
    console.log(req.user);
    return this.authService.oauthLogin(req.user);
  }
}
