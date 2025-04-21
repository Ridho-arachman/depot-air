import { Provider } from '@prisma/client';

export interface GithubProfile {
  emails: Array<{ value: string }>;
  username: string;
  _json: {
    avatar_url: string;
  };
  provider: Provider;
  id: string;
}

export interface GoogleProfile {
  emails: Array<{ value: string }>;
  displayName: string;
  photos: Array<{ value: string }>;
  provider: Provider;
  id: string;
}
