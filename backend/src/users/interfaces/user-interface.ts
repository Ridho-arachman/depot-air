import { Provider } from '@prisma/client';

export interface findUserByEmail {
  email: string;
}

export interface CreateUser {
  username: string;
  email: string;
  password?: string;
  provider?: Provider;
  avatar?: string;
  id: string;
}
