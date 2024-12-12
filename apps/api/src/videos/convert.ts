/**
 * Transcoding is when we convert video from one codec to another (like from H.264 to H.265)
 * or change the video's properties (like bitrate, resolution, or frame rate).
 * This process involves decoding the original video and re-encoding it into a new format,
 * which is computationally intensive but allows for quality and format changes.
 *
 * In this code, we're using -codec copy in the FFmpeg command,
 * which simply copies the video and audio streams without re-encoding them.
 * This process is more like repackaging - we're taking the video content
 * and splitting it into smaller chunks (.ts files)
 * and creating a playlist (.m3u8)
 * that tells the player how to stream these chunks.
 *
 * Think of it like taking a book and dividing it into chapters
 * without changing the actual text.
 */

import * as os from 'os';
import * as path from 'path';
// @ts-ignore
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
// @ts-ignore
import ffmpeg from 'fluent-ffmpeg';

import { getStorage } from 'firebase-admin/storage';
import { onRequestWithCors } from '../singleton';
import { AppError } from '../singleton/request';
import { Readable } from 'stream';

// initializeApp();
const storage = getStorage();
const bucket = storage.bucket();

interface ConversionRequest {
  id: string;
  videoUrl: string;
}

// Helper to generate unique temporary directory names
const generateTempDirName = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Improved file download with stream handling and cleanup
const downloadFile = async (url: string, localPath: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  // Get content length if available
  const contentLength = response.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength);
    // Check if we have enough space (leaving some buffer)
    if (size > 400 * 1024 * 1024) {
      // 400MB limit
      throw new Error('File too large for temporary storage');
    }
  }

  return new Promise<void>((resolve, reject) => {
    const fileStream = fs.createWriteStream(localPath);

    if (!response.body) {
      fs.unlink(localPath).catch(console.error);
      return reject(new Error('No response body'));
    }

    (async () => {
      try {
        const reader = response.body?.getReader();

        while (true) {
          //@ts-ignore
          const { done, value } = await reader?.read();
          if (done) break;

          // Write chunks to file stream
          fileStream.write(value);
        }

        fileStream.end();
        resolve();
      } catch (error) {
        fs.unlink(localPath).catch(console.error);
        reject(error);
      }
    })();

    fileStream.on('error', (error: any) => {
      fs.unlink(localPath).catch(console.error);
      reject(error);
    });
  });
};

// Improved Cloud Storage upload with chunking
const uploadToStorage = async (localPath: string, storagePath: string) => {
  await bucket.upload(localPath, {
    destination: storagePath,
    resumable: true, // Enable resumable uploads for larger files
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
};

// Improved directory upload with concurrency control
const uploadDirectory = async (localDir: string, storagePath: string) => {
  const files = await fs.readdir(localDir);

  // Process files in batches to prevent memory issues
  const BATCH_SIZE = 3;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (file: string) => {
        const localFilePath = path.join(localDir, file);
        const storageFilePath = path.join(storagePath, file);
        await uploadToStorage(localFilePath, storageFilePath);
      })
    );
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

    // Clean up
    await fs.remove(workingDir).catch(console.error);

    const playlistUrl = `https://storage.googleapis.com/${bucket.name}/${cleanOutputPath}/playlist.m3u8`;

    return {
      success: true,
      outputPath: cleanOutputPath,
      playlistUrl,
    };
  } catch (error) {
    // Ensure cleanup happens even on error
    await fs.remove(workingDir).catch(console.error);

    console.error('Video conversion failed:', error);
    throw AppError('Video conversion failed');
  }
};

const verifySignature = (request: Request) => {
  // Get the signature from the request headers
  // @ts-ignore
  const signature = request.headers['x-webhook-signature'];

  // firebase functions:secrets:set WEBHOOK_SECRET
  // Your webhook secret stored securely in environment variables
  // 7a9c2b4e8f3d1a6b5c9d8e7f2a3b4c5d
  // const webhookSecret = process.env.WEBHOOK_SECRET;
  const webhookSecret = '7a9c2b4e8f3d1a6b5c9d8e7f2a3b4c5d';

  return signature == webhookSecret;
};

const validateIP = (request: any) => {
  //@ts-ignore
  // const allowedIPs = process.env.ALLOWED_IPS.split(',');
  const allowedIPs = ['52.15.226.51'];

  const headers = request.headers;
  const clientIP = headers['x-forwarded-for'];

  return allowedIPs.includes(clientIP);
};

const validatePayload = (payload: any) => {
  const { id, video_url: videoUrl } = payload?.data?.rows?.[0] ?? {};

  console.log('validatePayload payload', payload);
  console.log('validatePayload rows', payload?.data?.rows);
  console.log('validatePayload rows[0]', payload?.data?.rows[0]);
  console.log('validatePayload id', id);
  console.log('validatePayload videoUrl', videoUrl);

  return (
    typeof id !== 'undefined' &&
    typeof videoUrl === 'string' &&
    videoUrl.length > 0
  );
};

const extractVideoData = (payload: any) => {
  const { id, video_url: videoUrl } = payload.data.rows[0];
  return { id, videoUrl };
};

export const convertVideo = onRequestWithCors(
  async (request: any, response: any) => {
    const headers = request.headers;

    // Add this at the start of your webhook handler
    console.log('All headers:', request.headers);
    console.log('payload', request.body);

    console.log('forwared-for', headers['x-forwarded-for']);
    console.log('x-real-ip', headers['x-real-ip']);
    console.log('x-webhook-signature', headers['x-webhook-signature']);
    const clientIP = headers['x-forwarded-for'] || headers['x-real-ip'];
    console.log('ip', clientIP);

    const valid = verifySignature(request);

    if (!valid) {
      console.error('Invalid webhook signature');

      //@ts-ignore
      response.status(401).send('Invalid signature');
      return;
    }

    const validIP = validateIP(request);

    if (!validIP) {
      console.error('IP is not allowed');

      //@ts-ignore
      response.status(401).send('Unallow IP');
      return;
    }

    const payload = request.body;
    console.log(`payload`, payload);

    if (!validatePayload(payload)) {
      console.log('invalid payload');
      //@ts-ignore
      response.status(400).send('Invalid payload');
      return;
    }

    const inputData = extractVideoData(payload);

    // const debug = true;
    // if (debug) {
    //   console.log('inputData', inputData);
    //   response.send();
    //   return;
    // }

    const videoUrl = await handleConvertVideo(inputData);

    // TODO
    // Store to Cloud SQL
    //@ts-ignore
    response.status(200).json({ videoUrl });
  }
);
