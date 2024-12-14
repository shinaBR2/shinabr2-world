import { Service } from 'encore.dev/service';
import { initializeApp } from 'firebase-admin/app';

console.log(`apps backend`, process.env.DATABASE_URL);

initializeApp({
  storageBucket: process.env.VITE_STORAGE_BUCKET,
});

export default new Service('video');
