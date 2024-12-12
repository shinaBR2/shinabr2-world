import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { verifySignature, validateIP, validatePayload } from './validator';

describe('verifySignature', () => {
  const mockWebhookSecret = 'test-secret';

  beforeEach(() => {
    process.env.NOCODB_WEBHOOK_SIGNATURE = mockWebhookSecret;
  });

  afterEach(() => {
    delete process.env.NOCODB_WEBHOOK_SIGNATURE;
  });

  it('should return true when signature matches webhook secret', () => {
    const mockRequest = {
      headers: {
        'x-webhook-signature': mockWebhookSecret,
      },
    };

    expect(verifySignature(mockRequest as unknown as Request)).toBe(true);
  });

  it('should return false when signature does not match webhook secret', () => {
    const mockRequest = {
      headers: {
        'x-webhook-signature': 'wrong-secret',
      },
    };

    expect(verifySignature(mockRequest as unknown as Request)).toBe(false);
  });

  it('should return false when signature is missing', () => {
    const mockRequest = {
      headers: {},
    };

    expect(verifySignature(mockRequest as Request)).toBe(false);
  });
});

describe('validateIP', () => {
  const mockNocodbIP = '192.168.1.1';

  beforeEach(() => {
    process.env.NOCODB_IP = mockNocodbIP;
  });

  afterEach(() => {
    delete process.env.NOCODB_IP;
  });

  it('should return true when IP is in allowed list', () => {
    const mockRequest = {
      headers: {
        'x-forwarded-for': mockNocodbIP,
      },
    };

    expect(validateIP(mockRequest)).toBe(true);
  });

  it('should return false when IP is not in allowed list', () => {
    const mockRequest = {
      headers: {
        'x-forwarded-for': '192.168.1.2',
      },
    };

    expect(validateIP(mockRequest)).toBe(false);
  });

  it('should return false when IP header is missing', () => {
    const mockRequest = {
      headers: {},
    };

    expect(validateIP(mockRequest)).toBe(false);
  });
});

describe('validatePayload', () => {
  it('should return true for valid payload', () => {
    const mockPayload = {
      data: {
        rows: [
          {
            id: 1,
            video_url: 'https://example.com/video.mp4',
          },
        ],
      },
    };

    expect(validatePayload(mockPayload)).toBe(true);
  });

  it('should return false when id is missing', () => {
    const mockPayload = {
      data: {
        rows: [
          {
            video_url: 'https://example.com/video.mp4',
          },
        ],
      },
    };

    expect(validatePayload(mockPayload)).toBe(false);
  });

  it('should return false when video_url is missing', () => {
    const mockPayload = {
      data: {
        rows: [
          {
            id: 1,
          },
        ],
      },
    };

    expect(validatePayload(mockPayload)).toBe(false);
  });

  it('should return false when video_url is empty', () => {
    const mockPayload = {
      data: {
        rows: [
          {
            id: 1,
            video_url: '',
          },
        ],
      },
    };

    expect(validatePayload(mockPayload)).toBe(false);
  });

  it('should return false when rows array is empty', () => {
    const mockPayload = {
      data: {
        rows: [],
      },
    };

    expect(validatePayload(mockPayload)).toBe(false);
  });

  it('should return false for malformed payload', () => {
    const mockPayload = {
      data: {},
    };

    expect(validatePayload(mockPayload)).toBe(false);
  });

  it('should return false for null payload', () => {
    expect(validatePayload(null)).toBe(false);
  });
});
