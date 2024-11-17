// @ts-nocheck
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const API_DIR = resolve(__dirname, '..');
const DIST_DIR = join(API_DIR, 'dist');
const ROOT_DIR = resolve(API_DIR, '../..');
const PACKAGES_DIR = resolve(ROOT_DIR, 'packages');

// Set to track processed packages to avoid circular dependencies
const processedPackages = new Set<string>();

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

function getWorkspaceDependencies(pkgJson: PackageJson): string[] {
  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies,
  };

  return Object.entries(allDeps || {})
    .filter(([_, version]) => version === 'workspace:*')
    .map(([name]) => name);
}

function processPackage(packageName: string, destDir: string) {
  if (processedPackages.has(packageName)) {
    return;
  }
  processedPackages.add(packageName);

  // Get package directory name (remove scope if present)
  const pkgDirName = packageName.replace(/^@[^/]+\//, '');
  const pkgSrcDir = resolve(PACKAGES_DIR, pkgDirName);
  const pkgDestDir = join(destDir, 'packages', pkgDirName);

  // Read package.json
  const pkgJson = JSON.parse(
    readFileSync(join(pkgSrcDir, 'package.json'), 'utf8')
  );

  // Process dependencies recursively
  const workspaceDeps = getWorkspaceDependencies(pkgJson);

  // Create destination directory
  if (!existsSync(pkgDestDir)) {
    mkdirSync(pkgDestDir, { recursive: true });
  }

  // Build the package if it has a build script
  try {
    execSync(`pnpm --filter ${packageName} build`, { stdio: 'inherit' });
  } catch (error) {
    console.log(`No build script found for ${packageName}, skipping build`);
  }

  // Copy package files
  cpSync(pkgSrcDir, pkgDestDir, {
    recursive: true,
    filter: src => {
      return (
        !src.includes('node_modules') &&
        !src.includes('.turbo') &&
        !src.includes('dist') &&
        !src.includes('.next')
      );
    },
  });

  // Copy dist directory if it exists
  const srcDistDir = join(pkgSrcDir, 'dist');
  if (existsSync(srcDistDir)) {
    cpSync(srcDistDir, join(pkgDestDir, 'dist'), { recursive: true });
  }

  // Modify package.json to use file: references
  const deployPkgJson = {
    ...pkgJson,
    dependencies: {
      ...pkgJson.dependencies,
    },
    devDependencies: {
      ...pkgJson.devDependencies,
    },
  };

  // Update workspace dependencies to use file: references
  workspaceDeps.forEach(dep => {
    const depDirName = dep.replace(/^@[^/]+\//, '');
    if (deployPkgJson.dependencies?.[dep] === 'workspace:*') {
      deployPkgJson.dependencies[dep] = `file:../packages/${depDirName}`;
    }
    if (deployPkgJson.devDependencies?.[dep] === 'workspace:*') {
      delete deployPkgJson.devDependencies[dep]; // Remove dev dependencies for deployment
    }
    // Process the dependency package
    processPackage(dep, destDir);
  });

  // Write modified package.json
  writeFileSync(
    join(pkgDestDir, 'package.json'),
    JSON.stringify(deployPkgJson, null, 2)
  );
}

// Start the deployment preparation
console.log('Preparing deployment...');

// Ensure dist directory exists
if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

// Read API package.json
const apiPkgJson = JSON.parse(
  readFileSync(join(API_DIR, 'package.json'), 'utf8')
);

// Create modified package.json for API
const deployApiPkgJson = {
  ...apiPkgJson,
  dependencies: {
    ...apiPkgJson.dependencies,
  },
};

// Process all workspace dependencies
const apiWorkspaceDeps = getWorkspaceDependencies(apiPkgJson);
apiWorkspaceDeps.forEach(dep => {
  const depDirName = dep.replace(/^@[^/]+\//, '');
  if (deployApiPkgJson.dependencies?.[dep] === 'workspace:*') {
    deployApiPkgJson.dependencies[dep] = `file:./packages/${depDirName}`;
  }
  processPackage(dep, DIST_DIR);
});

// Write modified API package.json
writeFileSync(
  join(DIST_DIR, 'package.json'),
  JSON.stringify(deployApiPkgJson, null, 2)
);

// Copy API source files
cpSync(join(API_DIR, 'src'), join(DIST_DIR, 'src'), { recursive: true });

console.log('Deployment preparation completed!');
