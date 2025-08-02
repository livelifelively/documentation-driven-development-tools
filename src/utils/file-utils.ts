import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Load a JSON file from a relative path
 */
export function loadJsonFile<T = any>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

/**
 * Load a JSON file from the module's directory
 */
export function loadJsonFromModuleDir<T = any>(importMetaUrl: string, relativePath: string): T {
  const __filename = fileURLToPath(importMetaUrl);
  const moduleDir = dirname(__filename);
  const fullPath = join(moduleDir, relativePath);
  return loadJsonFile<T>(fullPath);
}

/**
 * Load package.json and get version
 */
export function loadPackageJson(importMetaUrl: string): { version: string } {
  try {
    // Try the relative path from dist
    return loadJsonFromModuleDir(importMetaUrl, '../../package.json');
  } catch {
    try {
      // If that fails, try the current working directory
      return loadJsonFile(join(process.cwd(), 'package.json'));
    } catch {
      throw new Error('Could not find package.json to determine CLI version');
    }
  }
}
