// packages/database/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Disable dts generation since Prisma generates its own types
  external: ['./generated/client'],
});
