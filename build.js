import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Run TypeScript compiler
console.log('Building TypeScript...');
execSync('npx tsc', { stdio: 'inherit' });

// Create dist directory if it doesn't exist
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Build complete!');
