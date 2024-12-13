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

import { onRequestWithCors } from '../singleton';
import { handleConvertVideo } from './ffmpeg-helpers';
import { validateIP, validatePayload, verifySignature } from './validator';
import { prisma } from 'database';

const extractVideoData = (payload: any) => {
  const { id, video_url: videoUrl } = payload.data.rows[0];
  return { id, videoUrl };
};

const postConvert = async (data: { id: string; videoUrl: string }) => {
  const { id, videoUrl } = data;
  const video = await prisma.videos.update({
    where: { id },
    data: {
      source: videoUrl,
      status: 'ready',
    },
  });

  console.log(`updated video`, video);
  return video;
};

export const convertVideo = onRequestWithCors(
  async (request: any, response: any) => {
    if (!verifySignature(request)) {
      response.status(401).send('Invalid signature');
      return;
    }

    if (!validateIP(request)) {
      response.status(401).send('Unallow IP');
      return;
    }

    const payload = request.body;

    if (!validatePayload(payload)) {
      response.status(400).send('Invalid payload');
      return;
    }

    // Async operations that might fail
    const inputData = extractVideoData(payload);
    let videoUrl;
    try {
      videoUrl = await handleConvertVideo(inputData);
    } catch (error) {
      console.error('Video conversion failed:', error);
      response.status(500).send('Video conversion failed');
      return;
    }

    let video;
    try {
      video = await postConvert({
        ...inputData,
        videoUrl,
      });
    } catch (error) {
      console.error('Database update failed:', error);
      response.status(500).send('Failed to update video status');
      return;
    }

    response.status(200).json({ video });
  }
);
