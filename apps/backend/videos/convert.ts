import { api, APIError, ErrCode, Header } from 'encore.dev/api';
import { VideoDataInput } from './helpers/interfaces';
import { verifySignature } from './helpers/validator';
import { convertVideo } from './helpers/request-handler';

interface Response {
  testResult: string;
}

interface RecordData {
  rows: VideoDataInput[];
}

interface Request {
  data: RecordData;

  contentTypeHeader: Header<'Content-type'>;
  signatureHeader: Header<'x-webhook-signature'>;
}

const extractVideoData = (request: Request) => {
  const { id, video_url: videoUrl } = request.data.rows[0];
  return { id, videoUrl };
};

export const convert = api<Request, Response>(
  { expose: true, method: 'POST', path: '/videos/convert' },
  async request => {
    console.log(`'env`, process.env.NOCODB_WEBHOOK_SIGNATURE);
    console.log(`encore parsed`, request);

    const { signatureHeader } = request;
    if (!verifySignature(signatureHeader)) {
      throw new APIError(ErrCode.OK, 'Invalid signature');
    }

    try {
      const video = await convertVideo(extractVideoData(request));
      console.log(`updated video`, video);
    } catch (error) {
      throw new APIError(ErrCode.OK, 'Failed to convert');
    }

    return { testResult: 'ok' };
  }
);
