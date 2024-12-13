import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterAll,
  afterEach,
} from '@jest/globals';
import { Request as ExpressRequest } from 'express';
import { convertVideo } from './convert';
import { prisma } from 'database';

// Module type definitions
interface ValidatorModule {
  validateIP: jest.Mock<() => boolean>;
  validatePayload: jest.Mock<() => boolean>;
  verifySignature: jest.Mock<() => boolean>;
}

interface FfmpegHelpersModule {
  handleConvertVideo: jest.Mock<() => Promise<string>>;
}

interface Request extends ExpressRequest {
  rawBody: string;
  body: any;
  method: string;
  url: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[]>;
  params: Record<string, string>;
}

interface VideoPayload {
  data: {
    rows: Array<{
      id: string;
      video_url: string;
    }>;
  };
}

interface VideoData {
  id: string;
  videoUrl: string;
  source?: string;
  status?: string;
}

interface PrismaUpdateParams {
  where: { id: string };
  data: Partial<VideoData>;
}

type MockResponse = {
  status: jest.Mock;
  send: jest.Mock;
  json: jest.Mock;
  on: jest.Mock;
  end: jest.Mock;
  write: jest.Mock;
  writeHead: jest.Mock;
  setHeader: jest.Mock;
  getHeader: jest.Mock;
  removeHeader: jest.Mock;
  headersSent: boolean;
  headers: Record<string, string>;
};

type PrismaUpdateReturn = Promise<VideoData>;
type PrismaUpdateFunction = (params: PrismaUpdateParams) => PrismaUpdateReturn;

jest.mock('./ffmpeg-helpers');
jest.mock('./validator');
jest.mock('../singleton/postgres', () => ({
  __esModule: true,
  default: {
    videos: {
      update: jest.fn(),
    },
  },
}));

type JestSpyType = ReturnType<typeof jest.spyOn>;

describe('convertVideo endpoint', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: MockResponse;
  let validatorMock: ValidatorModule;
  let ffmpegHelpersMock: FfmpegHelpersModule;

  // Store original console.error
  const originalConsoleError = console.error;
  let consoleErrorSpy: JestSpyType;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    console.error = jest.fn();

    // Initialize our typed mocks
    validatorMock = jest.requireMock('./validator') as ValidatorModule;
    ffmpegHelpersMock = jest.requireMock(
      './ffmpeg-helpers'
    ) as FfmpegHelpersModule;

    const requestPayload = {
      data: {
        rows: [
          {
            id: 'test-video-id',
            video_url: 'https://example.com/test-video.mp4',
          },
        ],
      },
    } as VideoPayload;

    mockRequest = {
      body: requestPayload,
      rawBody: JSON.stringify(requestPayload),
      method: 'POST',
      url: '/convertVideo',
      headers: {},
      query: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      on: jest.fn(),
      end: jest.fn().mockReturnThis(),
      write: jest.fn().mockReturnThis(),
      writeHead: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      getHeader: jest.fn(),
      removeHeader: jest.fn(),
      headersSent: false,
      headers: {},
    } as MockResponse;

    // Set up mocks with proper typing
    validatorMock.validateIP.mockReturnValue(true);
    validatorMock.validatePayload.mockReturnValue(true);
    validatorMock.verifySignature.mockReturnValue(true);

    ffmpegHelpersMock.handleConvertVideo.mockResolvedValue(
      'https://example.com/converted-video.m3u8'
    );

    (
      prisma.videos.update as unknown as jest.MockedFunction<
        (params: PrismaUpdateParams) => PrismaUpdateReturn
      >
    ).mockResolvedValue({
      id: 'test-video-id',
      source: 'https://example.com/converted-video.m3u8',
      status: 'ready',
      videoUrl: 'converted-video-url',
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  test('should successfully convert video when all validations pass', async () => {
    await convertVideo(mockRequest as any, mockResponse as any);

    expect(validatorMock.verifySignature).toHaveBeenCalledWith(mockRequest);
    expect(validatorMock.validateIP).toHaveBeenCalledWith(mockRequest);
    expect(validatorMock.validatePayload).toHaveBeenCalledWith(
      mockRequest.body
    );

    expect(ffmpegHelpersMock.handleConvertVideo).toHaveBeenCalledWith({
      id: 'test-video-id',
      videoUrl: 'https://example.com/test-video.mp4',
    } as VideoData);

    expect(prisma.videos.update).toHaveBeenCalledWith({
      where: { id: 'test-video-id' },
      data: {
        source: 'https://example.com/converted-video.m3u8',
        status: 'ready',
      },
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      video: {
        id: 'test-video-id',
        source: 'https://example.com/converted-video.m3u8',
        status: 'ready',
        videoUrl: 'converted-video-url',
      },
    });
  });

  test('should return 401 when signature verification fails', async () => {
    validatorMock.verifySignature.mockReturnValue(false);
    await convertVideo(mockRequest as any, mockResponse as any);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid signature');
  });

  test('should return 401 when IP validation fails', async () => {
    validatorMock.validateIP.mockReturnValue(false);
    await convertVideo(mockRequest as any, mockResponse as any);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Unallow IP');
  });

  test('should return 400 when payload validation fails', async () => {
    validatorMock.validatePayload.mockReturnValue(false);
    await convertVideo(mockRequest as any, mockResponse as any);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid payload');
  });

  test('should handle video conversion failure', async () => {
    // Set up our mock to simulate a conversion failure
    ffmpegHelpersMock.handleConvertVideo.mockRejectedValueOnce({
      code: 'CONVERSION_ERROR',
      message: 'Video conversion failed',
    });

    // Wrap the function call in a try-catch to handle the error gracefully
    try {
      await convertVideo(mockRequest as any, mockResponse as any);
    } catch (error) {
      // If we reach this catch block, something went wrong with our error handling
      throw new Error('Error should have been handled by the function');
    }

    // If we reach here, the function handled the error as expected
    // Now we can verify the error response was sent correctly
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Video conversion failed');
  });

  test('should handle database update failure', async () => {
    type PrismaUpdateFunction = (
      params: PrismaUpdateParams
    ) => PrismaUpdateReturn;

    // Set up our database mock to simulate a failure
    (
      prisma.videos
        .update as unknown as jest.MockedFunction<PrismaUpdateFunction>
    ).mockRejectedValueOnce({
      code: 'DATABASE_ERROR',
      message: 'Database operation failed',
    });

    try {
      await convertVideo(mockRequest as any, mockResponse as any);
    } catch (error) {
      throw new Error('Error should have been handled by the function');
    }

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(
      'Failed to update video status'
    );
  });
});
