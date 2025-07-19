import { glob } from 'glob';
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import { Logger } from '../logger';

/**
 * Recursively scans a directory to find all valid DDD documentation files.
 * @param rootDir The absolute path to the directory to scan.
 * @returns A promise that resolves to an alphabetically sorted array of absolute file paths.
 * @throws If the rootDir does not exist or is not a directory.
 */
export async function findDocumentationFiles(rootDir: string): Promise<string[]> {
  const logger = new Logger();

  try {
    // Check if rootDir exists and is a directory
    const stats = await fs.stat(rootDir);
    if (!stats.isDirectory()) {
      const error = new Error(`Root directory not found at ${rootDir}.`);
      (error as any).details = {
        path: rootDir,
        type: 'not_directory',
        expected: 'directory',
        actual: 'file',
      };
      logger.error(error.message);
      throw error;
    }
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      const notFoundError = new Error(`Root directory not found at ${rootDir}.`);
      (notFoundError as any).details = {
        path: rootDir,
        type: 'not_found',
        code: 'ENOENT',
      };
      logger.error(notFoundError.message);
      throw notFoundError;
    }
    logger.error((error as Error).message);
    throw error;
  }

  // Define DDD file patterns
  const dddPatterns = ['project.md', '**/*.module.md', '**/*.epic.md', '**/*.task.md'];

  // Run glob searches in parallel
  const globPromises = dddPatterns.map(async (pattern) => {
    const patternPath = join(rootDir, pattern);
    try {
      const files = await glob(patternPath, {
        absolute: true,
        nodir: true,
        ignore: ['**/node_modules/**', '**/.git/**'],
      });

      files.forEach((file) => logger.debug(`Found potential document: ${file}`));
      return files;
    } catch (error) {
      logger.warn(`Error scanning pattern ${pattern}: ${error}`);
      return [] as string[];
    }
  });

  // Flatten results and de-duplicate
  const allFiles = (await Promise.all(globPromises)).flat();
  const uniqueFiles = Array.from(new Set(allFiles));

  // Filter out any non-DDD files that might have been included
  const dddFiles = uniqueFiles.filter((file) => {
    const fileName = basename(file);
    const isValidDddFile =
      fileName === 'project.md' ||
      fileName.endsWith('.module.md') ||
      fileName.endsWith('.epic.md') ||
      fileName.endsWith('.task.md');

    if (!isValidDddFile) {
      logger.warn(`Skipping non-standard markdown file: ${file}`);
      return false;
    }

    return true;
  });

  // Sort alphabetically
  const sortedFiles = dddFiles.sort();

  logger.info(`File scan complete. Found ${sortedFiles.length} documents.`);

  return sortedFiles;
}
