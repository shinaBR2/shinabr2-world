import { api } from 'encore.dev/api';

//

export const get = api({ expose: true, method: 'GET', path: '/' }, async () => {
  return { status: 'ok' };
});
