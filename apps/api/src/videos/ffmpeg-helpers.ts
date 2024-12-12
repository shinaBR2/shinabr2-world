import * as os from 'os';
// @ts-ignore
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import * as fs from 'fs-extra';
import path from 'path';
import { AppError } from '../singleton/request';
import {
  generateTempDirName,
  downloadFile,
  uploadDirectory,
  getDownloadUrl,
} from './file-helpers';

interface ConversionRequest {
  id: string;
  videoUrl: string;
}

const cleanupWorkingDirectory = async (workingDir: string) => {
  try {
    await fs.remove(workingDir);
  } catch (error) {
    // Log the error but don't throw it - cleanup failures shouldn't break the main flow
    console.error('Cleanup failed:', error);
  }
};

const handleConvertVideo = async (data: ConversionRequest) => {
  const { id, videoUrl } = data;

  // Generate unique working directory name
  const uniqueDir = generateTempDirName();
  const workingDir = path.join(os.tmpdir(), uniqueDir);
  const outputDir = path.join(workingDir, 'output');

  try {
    await fs.ensureDir(workingDir);
    await fs.ensureDir(outputDir);

    const inputPath = path.join(workingDir, 'input.mp4');
    await downloadFile(videoUrl, inputPath);

    // Check file size after download
    const stats = await fs.stat(inputPath);
    if (stats.size > 400 * 1024 * 1024) {
      // 400MB
      throw new Error('Downloaded file too large for processing');
    }

    // Generate a clean storage path
    const outputPath = `videos/${id}`;
    const cleanOutputPath = path
      .normalize(outputPath)
      .replace(/^\/+|\/+$/g, '');

    // Convert to HLS
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-codec copy',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(path.join(outputDir, 'playlist.m3u8'))
        .on('end', () => resolve())
        .on('error', (err: any) => reject(err))
        .run();
    });

    await uploadDirectory(outputDir, cleanOutputPath);

    await cleanupWorkingDirectory(workingDir);

    const playlistUrl = getDownloadUrl(cleanOutputPath);

    return playlistUrl;
  } catch (error) {
    await cleanupWorkingDirectory(workingDir);

    if (error instanceof Error) {
      console.error('Video conversion error:', error);
      throw AppError(error.message);
    } else {
      console.error('Unknown error during video conversion:', error);
      throw AppError('Unknown error during video conversion');
    }
  }
};

export { handleConvertVideo };
