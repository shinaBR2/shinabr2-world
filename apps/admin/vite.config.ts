import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'admin.local.shinabr2.com',
    port: 3001,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../certs/cert.pem')),
    },
  },
});
