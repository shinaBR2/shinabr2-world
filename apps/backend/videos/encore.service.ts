import 'dotenv/config';
import { Service } from 'encore.dev/service';
import { initializeApp } from 'firebase-admin/app';

initializeApp({
  storageBucket: process.env.VITE_STORAGE_BUCKET,
});

// Encore will consider this directory and all its subdirectories as part of the "video" service.
// https://encore.dev/docs/ts/primitives/services
export default new Service('video');
