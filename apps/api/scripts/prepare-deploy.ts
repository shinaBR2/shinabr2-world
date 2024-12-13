// @ts-ignore
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'fs';
// @ts-ignore
import { resolve, join } from 'path';
// @ts-ignore
import { execSync } from 'child_process';

// @ts-ignore
const API_DIR = resolve(__dirname, '..');
const DIST_DIR = join(API_DIR, 'dist');
const ROOT_DIR = resolve(API_DIR, '../..');

// First, let's generate the Prisma client in our database package
// console.log('Generating Prisma client in database package...');
// execSync('pnpm --filter database db:generate', {
//   stdio: 'inherit',
//   cwd: ROOT_DIR,
// });

// Now proceed with the rest of your build process
console.log('Building core package...');
execSync('pnpm --filter core build', { stdio: 'inherit' });

console.log('Building database package...');
execSync('pnpm --filter database build', { stdio: 'inherit' });

// Create necessary directories
if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

const CORE_DIST = resolve(ROOT_DIR, 'packages/core/dist');
const CORE_DEST = join(DIST_DIR, 'core');

const DATABASE_DIST = resolve(ROOT_DIR, 'packages/database');
const DATABASE_DEST = join(DIST_DIR, 'database');

[CORE_DEST, DATABASE_DEST].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Copy the built files
console.log('Copying core package...');
cpSync(CORE_DIST, CORE_DEST, { recursive: true });

console.log('Copying database package...');
// Copy the compiled code
cpSync(join(DATABASE_DIST, 'dist'), DATABASE_DEST, {
  recursive: true,
});

// Copy Prisma files and generated client
// console.log('Copying Prisma files...');
// cpSync(join(DATABASE_DIST, 'prisma'), join(DATABASE_DEST, 'prisma'), {
//   recursive: true,
// });

// // Before copying the Prisma client, let's find where it's actually generated
// console.log('Copying Prisma client...');
// // Prisma generates its client in the workspace's node_modules/.prisma/client
// const PRISMA_CLIENT_SRC = join(
//   ROOT_DIR,
//   'node_modules/.pnpm/@prisma+client@6.0.1_prisma@6.0.1/node_modules/@prisma/client'
// );
// const PRISMA_CLIENT_DEST = join(DATABASE_DEST, 'node_modules/.prisma/client');

// // Create the destination directory structure
// mkdirSync(join(DATABASE_DEST, 'node_modules/.prisma'), { recursive: true });

// Add some debugging information
// console.log('Prisma client source path:', PRISMA_CLIENT_SRC);
// console.log('Prisma client destination path:', PRISMA_CLIENT_DEST);

// // First check if the source exists to provide better error handling
// if (!existsSync(PRISMA_CLIENT_SRC)) {
//   console.error('Could not find Prisma client at:', PRISMA_CLIENT_SRC);
//   console.error('Make sure Prisma client was generated successfully');
//   throw new Error('Prisma client source not found');
// }

// // Copy the Prisma client
// try {
//   cpSync(PRISMA_CLIENT_SRC, PRISMA_CLIENT_DEST, { recursive: true });
// } catch (error) {
//   console.error('Error copying Prisma client:', error);
//   throw error;
// }

// Prepare package.json files
const pkgJson = JSON.parse(readFileSync(join(API_DIR, 'package.json'), 'utf8'));
const modifiedPkgJson = {
  ...pkgJson,
  main: 'index.js',
  dependencies: {
    ...pkgJson.dependencies,
    core: 'file:./core',
    database: 'file:./database',
  },
};
delete modifiedPkgJson.devDependencies;
delete modifiedPkgJson.scripts;

// Write API package.json
writeFileSync(
  join(DIST_DIR, 'package.json'),
  JSON.stringify(modifiedPkgJson, null, 2)
);

// Prepare core package.json
const corePkgJson = JSON.parse(
  readFileSync(resolve(ROOT_DIR, 'packages/core/package.json'), 'utf8')
);
delete corePkgJson.devDependencies;
delete corePkgJson.scripts;
writeFileSync(
  join(CORE_DEST, 'package.json'),
  JSON.stringify(corePkgJson, null, 2)
);

// Prepare database package.json
const dbPkgJson = JSON.parse(
  readFileSync(join(DATABASE_DIST, 'package.json'), 'utf8')
);
const deployedDbPkgJson = {
  ...dbPkgJson,
  main: 'index.js',
  module: 'index.mjs',
  types: 'index.d.ts',
};
delete deployedDbPkgJson.devDependencies;
delete deployedDbPkgJson.scripts;
delete deployedDbPkgJson.exports;
writeFileSync(
  join(DATABASE_DEST, 'package.json'),
  JSON.stringify(deployedDbPkgJson, null, 2)
);

// Copy firebase configuration
console.log('Copying firebase.json...');
cpSync(
  resolve(API_DIR, 'firebase-for-deploy.json'),
  join(DIST_DIR, 'firebase.json')
);

console.log('Deployment preparation completed!');
