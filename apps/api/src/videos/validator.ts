const verifySignature = (request: Request) => {
  // Get the signature from the request headers
  // @ts-ignore
  const signature = request.headers['x-webhook-signature'];

  const webhookSecret = process.env.NOCODB_WEBHOOK_SIGNATURE;

  return signature == webhookSecret;
};

const validateIP = (request: any) => {
  const nocodbIP = process.env.NOCODB_IP;
  const allowedIPs = [nocodbIP];

  const headers = request.headers;
  const clientIP = headers['x-forwarded-for'];

  return allowedIPs.includes(clientIP);
};

const validatePayload = (payload: any) => {
  const { id, video_url: videoUrl } = payload?.data?.rows?.[0] ?? {};

  return (
    typeof id !== 'undefined' &&
    typeof videoUrl === 'string' &&
    videoUrl.length > 0
  );
};

export { verifySignature, validateIP, validatePayload };
