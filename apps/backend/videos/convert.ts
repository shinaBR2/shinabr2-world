
import { api, APIError, ErrCode, Header } from 'encore.dev/api';
import log from 'encore.dev/log';
import { IncomingMessage } from 'node:http';
import { VideoDataInput } from './helpers/interfaces';
import { verifySignature } from './helpers/validator';
import { convertVideo } from './helpers/request-handler';

// initializeApp();
interface Response {
  testResult: string;
}

interface RecordData {
  rows: VideoDataInput[];
}

interface Request {
  // Required path parameter. Parsed from the request URL.
  data: RecordData;

  // Optional query parameter. Parsed from the request URL.
  // limit?: Query<number>;

  // Custom header that must be set. Parsed from the HTTP headers.
  contentTypeHeader: Header<'Content-type'>;
  signatureHeader: Header<'x-webhook-signature'>;
  // iPHeader: Header<'x-forwarded-for'>;

  // Required enum. Parsed from the request body.
  // type: 'sprocket' | 'widget';
}

function getBody(req: IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    const bodyParts: any[] = [];
    req
      .on('data', chunk => {
        bodyParts.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(bodyParts).toString());
      });
  });
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

// export const convert = api.raw(
//   { expose: true, method: 'POST', path: '/videos/convert' },
//   async request => {
//     const clientIP = request.headers['x-forwarded-for'];
//     const signature = request.headers['x-webhook-signature'];
//     const body = await getBody(request);
//     // const rawbody = request.rawbody;

//     console.log(`raw body`, JSON.parse(body));
//     // const { id, video_url: videoUrl } = body?.data?.rows?.[0] ?? {};

//     console.log(`clientIP`, clientIP);
//     console.log(`signature`, signature);
//     console.log(`body`, body);
//     // console.log(`rawbody`, rawbody);
//     // console.log(`id`, id);
//     // console.log(`videoUrl`, videoUrl);

//     return { testResult: 'kakaka' };
//   }
// );
