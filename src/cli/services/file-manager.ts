import { promises as fs, statSync } from 'fs';
import path from 'path';

export class FileManager {
  public resolveOutputPath(directory?: string): string {
    return directory ? path.resolve(process.cwd(), directory) : process.cwd();
  }

  public async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (e) {
      const error = e as any;
      // Ignore error if directory already exists
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  public async writeTemplate(filePath: string, content: string): Promise<void> {
    await this.ensureDirectoryExists(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  }

  public async checkFileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public checkDirectoryExists(dirPath: string): boolean {
    try {
      // Use synchronous stat to check for directory existence
      const stats = statSync(dirPath);
      return stats.isDirectory();
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      // If the error is that the file/directory doesn't exist, return false
      if (nodeError.code === 'ENOENT') {
        return false;
      }
      // For any other errors, re-throw the exception
      throw error;
    }
  }

  public async copyFile(source: string, destination: string): Promise<void> {
    await fs.copyFile(source, destination);
  }

  public async deleteDirectory(dirPath: string): Promise<void> {
    await fs.rm(dirPath, { recursive: true, force: true });
  }

  public async getAllFiles(dirPath: string): Promise<string[]> {
    const allFiles: string[] = [];
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          allFiles.push(...(await this.getAllFiles(fullPath)));
        } else {
          allFiles.push(fullPath);
        }
      }
    } catch (error: unknown) {
      // If the directory doesn't exist, return an empty array.
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }
    return allFiles;
  }
}
