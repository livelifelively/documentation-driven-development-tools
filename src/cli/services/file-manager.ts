import { promises as fs } from 'fs';
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
}
