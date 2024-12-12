// @ts-nocheck
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import {
  generateTempDirName,
  downloadFile,
  uploadDirectory,
  getDownloadUrl,
} from './file-helpers';
// @ts-ignore
import * as fs from 'fs-extra';
import * as path from 'path';
import { getStorage } from 'firebase-admin/storage';
import { Storage } from '@google-cloud/storage';
import ffmpeg from 'fluent-ffmpeg';

// Mock external dependencies
jest.mock('fs-extra');
jest.mock('firebase-admin/storage');
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

describe('File Handlers', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTempDirName', () => {
    it('should generate a 32-character hex string', () => {
      const result = generateTempDirName();
      expect(result).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should generate unique values', () => {
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(generateTempDirName());
      }
      expect(results.size).toBe(10);
    });
  });

  describe('downloadFile', () => {
    const mockUrl = 'https://example.com/file.mp4';
    const mockLocalPath = '/tmp/file.mp4';
    let mockWriteStream: any;

    beforeEach(() => {
      jest.clearAllMocks();
      // Mock fs.unlink to return a Promise
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      mockWriteStream = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
      };
      (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);
    });

    it('should successfully download a file', async () => {
      const mockBody = {
        getReader: () => ({
          read: jest
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: Buffer.from('chunk1'),
            })
            .mockResolvedValueOnce({
              done: false,
              value: Buffer.from('chunk2'),
            })
            .mockResolvedValueOnce({ done: true }),
        }),
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-length': '1000' }),
        body: mockBody,
      });

      await downloadFile(mockUrl, mockLocalPath);

      expect(mockWriteStream.write).toHaveBeenCalledTimes(2);
      expect(mockWriteStream.end).toHaveBeenCalled();
    });

    it('should throw error for large files', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-length': '500000000' }), // 500MB
      });

      await expect(downloadFile(mockUrl, mockLocalPath)).rejects.toThrow(
        'File too large for temporary storage'
      );
    });

    it('should handle failed fetch responses', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(downloadFile(mockUrl, mockLocalPath)).rejects.toThrow(
        'Failed to fetch: Not Found'
      );
    });

    it('should handle missing response body', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({}),
        body: null,
      });

      await expect(downloadFile(mockUrl, mockLocalPath)).rejects.toThrow(
        'No response body'
      );

      // Verify that unlink was called
      expect(fs.unlink).toHaveBeenCalledWith(mockLocalPath);
    });

    it('should clean up on write stream errors', async () => {
      const mockError = new Error('Write error');

      // Mock fs.unlink to return a Promise
      (fs.unlink as jest.Mock).mockReturnValue(Promise.resolve());

      // Make write throw error immediately
      mockWriteStream.write.mockImplementation(() => {
        throw mockError;
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({}),
        body: {
          getReader: () => ({
            read: jest.fn().mockResolvedValueOnce({
              done: false,
              value: new Uint8Array([1]),
            }),
          }),
        },
      });

      await expect(downloadFile(mockUrl, mockLocalPath)).rejects.toThrow(
        'Write error'
      );
      expect(fs.unlink).toHaveBeenCalledWith(mockLocalPath);
    });
  });

  describe('uploadDirectory', () => {
    const mockLocalDir = '/tmp/videos';
    const mockStoragePath = 'videos/';
    const mockFiles = ['file1.mp4', 'file2.mp4', 'file3.mp4', 'file4.mp4'];
    let mockBucket: any;

    beforeEach(() => {
      mockBucket = {
        upload: jest.fn().mockResolvedValue([{}]),
      };
      (getStorage as jest.Mock).mockReturnValue({
        bucket: () => mockBucket,
      });
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
    });

    it('should upload all files in batches', async () => {
      await uploadDirectory(mockLocalDir, mockStoragePath);

      expect(mockBucket.upload).toHaveBeenCalledTimes(mockFiles.length);
      expect(fs.readdir).toHaveBeenCalledWith(mockLocalDir);
    });

    it('should handle empty directory', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      await uploadDirectory(mockLocalDir, mockStoragePath);

      expect(mockBucket.upload).not.toHaveBeenCalled();
    });

    it('should use correct paths for uploads', async () => {
      await uploadDirectory(mockLocalDir, mockStoragePath);

      mockFiles.forEach(file => {
        expect(mockBucket.upload).toHaveBeenCalledWith(
          path.join(mockLocalDir, file),
          expect.objectContaining({
            destination: path.join(mockStoragePath, file),
          })
        );
      });
    });

    it('should handle upload errors', async () => {
      const mockError = new Error('Upload failed');
      mockBucket.upload.mockRejectedValue(mockError);

      await expect(
        uploadDirectory(mockLocalDir, mockStoragePath)
      ).rejects.toThrow(mockError);
    });
  });

  describe('getDownloadUrl', () => {
    // Set up our test environment before each test
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();

      // Create a mock bucket with a predefined name
      const mockBucket = {
        name: 'test-bucket-name',
      };

      // Set up our storage mock to return our mock bucket
      getStorage.mockReturnValue({
        bucket: () => mockBucket,
      });
    });

    it('should generate the correct download URL format', () => {
      // Test with a simple output path
      const outputPath = 'videos/123';
      const expectedUrl =
        'https://storage.googleapis.com/test-bucket-name/videos/123/playlist.m3u8';

      const result = getDownloadUrl(outputPath);

      expect(result).toBe(expectedUrl);
    });

    it('should verify that getStorage is called exactly once', () => {
      const outputPath = 'videos/123';

      getDownloadUrl(outputPath);

      expect(getStorage).toHaveBeenCalledTimes(1);
    });

    it('should verify that bucket() is called after getStorage', () => {
      const outputPath = 'videos/123';
      const mockBucketFn = jest
        .fn()
        .mockReturnValue({ name: 'test-bucket-name' });

      // Create an array to track the order of function calls
      const calls = [];

      // Set up our mocks to track call order
      getStorage.mockImplementation(() => {
        calls.push('getStorage');
        return {
          bucket: mockBucketFn.mockImplementation(() => {
            calls.push('bucket');
            return { name: 'test-bucket-name' };
          }),
        };
      });

      getDownloadUrl(outputPath);

      // Verify both functions were called
      expect(getStorage).toHaveBeenCalled();
      expect(mockBucketFn).toHaveBeenCalled();

      // Verify the order of calls
      expect(calls).toEqual(['getStorage', 'bucket']);
    });
  });
});
