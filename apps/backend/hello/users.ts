import { prisma } from 'database';
import { api } from 'encore.dev/api';
import log from 'encore.dev/log';

interface Response {
  message: string;
}

export const getUsers = api(
  { expose: true, method: 'GET', path: '/hello/users' },
  async (): Promise<Response> => {
    const users = await prisma.users.findMany();

    log.info(`users`, users);

    return { message: 'ok' };
  }
);
