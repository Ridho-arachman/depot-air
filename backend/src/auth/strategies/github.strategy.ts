import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { GithubProfile } from '../interfaces/interface.github-strategy';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GITHUB_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new UnauthorizedException(
        'GitHub OAuth credentials not configured',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user:email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
    done: (error: any, user?: any) => void,
  ): any {
    console.log(profile);

    const user = {
      username: profile.username,
      email: profile.emails[0].value,
      avatar: profile._json.avatar_url,
      provider: profile.provider,
      id: profile.id,
    };
    if (!user.email) {
      throw new UnauthorizedException('Email not found');
    }
    done(null, user);
  }
}
