import * as fs from 'fs';
import * as path from 'path';

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created output directory: ${dirPath}`);
  }
}

export function writeToMultipleLocations(content: string, paths: string[], description: string): void {
  paths.forEach((filePath) => {
    ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
  });
  console.log(`✅ ${description} generated at: ${paths.join(' and ')}`);
}
