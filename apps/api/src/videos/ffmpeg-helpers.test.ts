import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterAll,
  afterEach,
} from '@jest/globals';
import * as os from 'os';
import * as path from 'path';
// @ts-ignore
import * as fs from 'fs-extra';
// @ts-ignore
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import { handleConvertVideo } from './ffmpeg-helpers';
import * as videoHelpers from './file-helpers';

type JestSpyType = ReturnType<typeof jest.spyOn>;

// Mock all external dependencies
jest.mock('fluent-ffmpeg');
jest.mock('fs-extra');
jest.mock('@google-cloud/storage');
jest.mock('../singleton/request', () => ({
  AppError: jest.fn(message => new Error(message as string)),
}));

// Mock the helper functions
jest.mock('./file-helpers', () => ({
  downloadFile: jest.fn(),
  uploadDirectory: jest.fn(),
  generateTempDirName: jest.fn(),
  getDownloadUrl: jest.fn(),
}));

describe('handleConvertVideo', () => {
  // Define mock paths that match the actual implementation
  const mockUniqueDir = 'mock-dir';
  const mockWorkingDir = path.join(os.tmpdir(), mockUniqueDir);
  const mockOutputDir = path.join(mockWorkingDir, 'output');
  const mockInputPath = path.join(mockWorkingDir, 'input.mp4');

  // Test data
  const mockData = {
    id: 'test-video-123',
    videoUrl: 'https://example.com/test.mp4',
  };

  // Set up typed mocks
  const mockDownloadFile = videoHelpers.downloadFile as jest.MockedFunction<
    typeof videoHelpers.downloadFile
  >;
  const mockUploadDirectory =
    videoHelpers.uploadDirectory as jest.MockedFunction<
      typeof videoHelpers.uploadDirectory
    >;
  const mockGenerateTempDirName =
    videoHelpers.generateTempDirName as jest.MockedFunction<
      typeof videoHelpers.generateTempDirName
    >;
  const mockGetDownloadUrl = videoHelpers.getDownloadUrl as jest.MockedFunction<
    typeof videoHelpers.getDownloadUrl
  >;
  const mockEnsureDir = fs.ensureDir as jest.MockedFunction<
    typeof fs.ensureDir
  >;
  const mockStat = fs.stat as jest.MockedFunction<typeof fs.stat>;
  const mockRemove = fs.remove as jest.MockedFunction<typeof fs.remove>;

  // Store original console.error
  const originalConsoleError = console.error;
  let consoleErrorSpy: JestSpyType;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    console.error = jest.fn();

    // Mock ffmpeg with a chainable API that matches the actual implementation
    const mockFfmpeg = {
      outputOptions: jest.fn().mockReturnThis(),
      output: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      run: jest.fn().mockImplementation(function (this: any) {
        // Find and trigger the 'end' handler to simulate successful completion
        const endHandler = this.on.mock.calls.find(
          (call: any[]) => call[0] === 'end'
        )[1];
        endHandler();
      }),
    };
    (ffmpeg as jest.Mock).mockReturnValue(mockFfmpeg);

    // Set up default successful responses for all mocks
    mockGenerateTempDirName.mockReturnValue(mockUniqueDir);
    mockDownloadFile.mockResolvedValue(undefined);
    mockUploadDirectory.mockResolvedValue(undefined);
    mockGetDownloadUrl.mockReturnValue(
      'https://storage.googleapis.com/test-bucket/videos/test-video-123/playlist.m3u8'
    );
    mockEnsureDir.mockResolvedValue(undefined);
    mockStat.mockResolvedValue({ size: 100 * 1024 * 1024 }); // 100MB by default
    mockRemove.mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('successfully converts video with correct workflow', async () => {
    const result = await handleConvertVideo(mockData);

    // Verify directory creation
    expect(mockEnsureDir).toHaveBeenCalledWith(mockWorkingDir);
    expect(mockEnsureDir).toHaveBeenCalledWith(mockOutputDir);

    // Verify file download
    expect(mockDownloadFile).toHaveBeenCalledWith(
      mockData.videoUrl,
      mockInputPath
    );

    // Verify file size check
    expect(mockStat).toHaveBeenCalledWith(mockInputPath);

    // Verify directory upload
    expect(mockUploadDirectory).toHaveBeenCalledWith(
      mockOutputDir,
      `videos/${mockData.id}`
    );

    // Verify cleanup
    expect(mockRemove).toHaveBeenCalledWith(mockWorkingDir);

    // Verify final URL generation
    expect(mockGetDownloadUrl).toHaveBeenCalledWith(`videos/${mockData.id}`);
    expect(result).toBe(
      'https://storage.googleapis.com/test-bucket/videos/test-video-123/playlist.m3u8'
    );
  });

  it('handles file size exceeding limit', async () => {
    // Mock file size to be over limit (400MB)
    mockStat.mockResolvedValueOnce({ size: 500 * 1024 * 1024 });

    await expect(handleConvertVideo(mockData)).rejects.toThrow(
      'Downloaded file too large for processing'
    );

    // Verify cleanup was attempted
    expect(mockRemove).toHaveBeenCalledWith(mockWorkingDir);
    // Verify upload was never attempted
    expect(mockUploadDirectory).not.toHaveBeenCalled();
  });

  it('handles download failure', async () => {
    mockDownloadFile.mockRejectedValueOnce(new Error('Download failed'));

    await expect(handleConvertVideo(mockData)).rejects.toThrow(
      'Download failed'
    );

    expect(mockRemove).toHaveBeenCalledWith(mockWorkingDir);
    expect(mockUploadDirectory).not.toHaveBeenCalled();
  });

  it('handles ffmpeg conversion failure', async () => {
    // Mock ffmpeg to simulate failure
    const mockFfmpeg = {
      outputOptions: jest.fn().mockReturnThis(),
      output: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      run: jest.fn().mockImplementation(function (this: any) {
        // Find and trigger the 'error' handler
        const errorHandler = this.on.mock.calls.find(
          (call: any[]) => call[0] === 'error'
        )[1];
        errorHandler(new Error('Conversion failed'));
      }),
    };
    (ffmpeg as jest.Mock).mockReturnValue(mockFfmpeg);

    await expect(handleConvertVideo(mockData)).rejects.toThrow(
      'Conversion failed'
    );

    expect(mockRemove).toHaveBeenCalledWith(mockWorkingDir);
    expect(mockUploadDirectory).not.toHaveBeenCalled();
  });

  it('handles upload failure', async () => {
    mockUploadDirectory.mockRejectedValueOnce(new Error('Upload failed'));

    await expect(handleConvertVideo(mockData)).rejects.toThrow('Upload failed');

    expect(mockRemove).toHaveBeenCalledWith(mockWorkingDir);
  });
});
