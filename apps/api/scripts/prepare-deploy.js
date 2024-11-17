"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
// @ts-nocheck
var fs_1 = require("fs");
var path_1 = require("path");
var child_process_1 = require("child_process");
var API_DIR = (0, path_1.resolve)(__dirname, '..');
var DIST_DIR = (0, path_1.join)(API_DIR, 'dist');
var ROOT_DIR = (0, path_1.resolve)(API_DIR, '../..');
var PACKAGES_DIR = (0, path_1.resolve)(ROOT_DIR, 'packages');
// Set to track processed packages to avoid circular dependencies
var processedPackages = new Set();
function getWorkspaceDependencies(pkgJson) {
    var allDeps = __assign(__assign(__assign({}, pkgJson.dependencies), pkgJson.devDependencies), pkgJson.peerDependencies);
    return Object.entries(allDeps || {})
        .filter(function (_a) {
        var _ = _a[0], version = _a[1];
        return version === 'workspace:*';
    })
        .map(function (_a) {
        var name = _a[0];
        return name;
    });
}
function processPackage(packageName, destDir) {
    if (processedPackages.has(packageName)) {
        return;
    }
    processedPackages.add(packageName);
    // Get package directory name (remove scope if present)
    var pkgDirName = packageName.replace(/^@[^/]+\//, '');
    var pkgSrcDir = (0, path_1.resolve)(PACKAGES_DIR, pkgDirName);
    var pkgDestDir = (0, path_1.join)(destDir, 'packages', pkgDirName);
    // Read package.json
    var pkgJson = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(pkgSrcDir, 'package.json'), 'utf8'));
    // Process dependencies recursively
    var workspaceDeps = getWorkspaceDependencies(pkgJson);
    // Create destination directory
    if (!(0, fs_1.existsSync)(pkgDestDir)) {
        (0, fs_1.mkdirSync)(pkgDestDir, { recursive: true });
    }
    // Build the package if it has a build script
    try {
        (0, child_process_1.execSync)("pnpm --filter ".concat(packageName, " build"), { stdio: 'inherit' });
    }
    catch (error) {
        console.log("No build script found for ".concat(packageName, ", skipping build"));
    }
    // Copy package files
    (0, fs_1.cpSync)(pkgSrcDir, pkgDestDir, {
        recursive: true,
        filter: function (src) {
            return (!src.includes('node_modules') &&
                !src.includes('.turbo') &&
                !src.includes('dist') &&
                !src.includes('.next'));
        }
    });
    // Copy dist directory if it exists
    var srcDistDir = (0, path_1.join)(pkgSrcDir, 'dist');
    if ((0, fs_1.existsSync)(srcDistDir)) {
        (0, fs_1.cpSync)(srcDistDir, (0, path_1.join)(pkgDestDir, 'dist'), { recursive: true });
    }
    // Modify package.json to use file: references
    var deployPkgJson = __assign(__assign({}, pkgJson), { dependencies: __assign({}, pkgJson.dependencies), devDependencies: __assign({}, pkgJson.devDependencies) });
    // Update workspace dependencies to use file: references
    workspaceDeps.forEach(function (dep) {
        var _a, _b;
        var depDirName = dep.replace(/^@[^/]+\//, '');
        if (((_a = deployPkgJson.dependencies) === null || _a === void 0 ? void 0 : _a[dep]) === 'workspace:*') {
            deployPkgJson.dependencies[dep] = "file:../packages/".concat(depDirName);
        }
        if (((_b = deployPkgJson.devDependencies) === null || _b === void 0 ? void 0 : _b[dep]) === 'workspace:*') {
            delete deployPkgJson.devDependencies[dep]; // Remove dev dependencies for deployment
        }
        // Process the dependency package
        processPackage(dep, destDir);
    });
    // Write modified package.json
    (0, fs_1.writeFileSync)((0, path_1.join)(pkgDestDir, 'package.json'), JSON.stringify(deployPkgJson, null, 2));
}
// Start the deployment preparation
console.log('Preparing deployment...');
// Ensure dist directory exists
if (!(0, fs_1.existsSync)(DIST_DIR)) {
    (0, fs_1.mkdirSync)(DIST_DIR, { recursive: true });
}
// Read API package.json
var apiPkgJson = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(API_DIR, 'package.json'), 'utf8'));
// Create modified package.json for API
var deployApiPkgJson = __assign(__assign({}, apiPkgJson), { dependencies: __assign({}, apiPkgJson.dependencies) });
// Process all workspace dependencies
var apiWorkspaceDeps = getWorkspaceDependencies(apiPkgJson);
apiWorkspaceDeps.forEach(function (dep) {
    var _a;
    var depDirName = dep.replace(/^@[^/]+\//, '');
    if (((_a = deployApiPkgJson.dependencies) === null || _a === void 0 ? void 0 : _a[dep]) === 'workspace:*') {
        deployApiPkgJson.dependencies[dep] = "file:./packages/".concat(depDirName);
    }
    processPackage(dep, DIST_DIR);
});
// Write modified API package.json
(0, fs_1.writeFileSync)((0, path_1.join)(DIST_DIR, 'package.json'), JSON.stringify(deployApiPkgJson, null, 2));
// Copy API source files
(0, fs_1.cpSync)((0, path_1.join)(API_DIR, 'src'), (0, path_1.join)(DIST_DIR, 'src'), { recursive: true });
console.log('Deployment preparation completed!');
