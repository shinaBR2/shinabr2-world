import { prisma } from 'database';
import { api } from 'encore.dev/api';

interface Response {
  message: string;
}

export const getUsers = api(
  { expose: true, method: 'GET', path: '/hello/users' },
  async (): Promise<Response> => {
    const users = await prisma.users.findMany();

    console.log(`users`, users);

    return { message: 'ok' };
  }
);
