import { api } from 'encore.dev/api';

interface PayloadData {
  id: string;
  videoUrl: string;
}

interface Response {
  testResult: string;
}

export const convert = api(
  { expose: true, method: 'POST', path: '/videos/convert' },
  async (payload: PayloadData): Promise<Response> => {
    console.log(`id`, payload.id);
    console.log(`videoUrl`, payload.videoUrl);
    return { testResult: 'kakaka' };
  }
);
