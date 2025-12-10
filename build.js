import { execSync } from 'child_process';
import fs from 'fs';

const distDir = './dist';

// Remove previous build output to avoid stale artifacts
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

console.log('Building TypeScript...');
execSync('npx tsc', { stdio: 'inherit' });

console.log('Build complete!');
