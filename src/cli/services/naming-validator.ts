import path from 'path';
import { promises as fs } from 'fs';
import { FileManager } from './file-manager';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export class NamingValidator {
  private fileManager: FileManager;
  private static readonly NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
  private static readonly DDD_FILE_PATTERN = /^(.*)([pt])(\d+)-([^.]+)\.(plan|task)\.md$/;

  constructor() {
    this.fileManager = new FileManager();
  }

  public validateName(name: string): ValidationResult {
    if (!NamingValidator.NAME_PATTERN.test(name)) {
      return {
        isValid: false,
        message: `Invalid name format. Expected: [a-z-]+ (e.g., 'user-management'), but got '${name}'.`,
      };
    }
    return { isValid: true };
  }

  public async generateFileName(type: 'plan' | 'task', name: string, parent?: string): Promise<string> {
    const nextId = await this.getNextAvailableId(type, parent);
    const prefix = parent ? `${parent}-` : '';
    const typePrefix = type === 'plan' ? 'p' : 't';
    const suffix = `.${type}.md`;

    return `${prefix}${typePrefix}${nextId}-${name}${suffix}`;
  }

  private async getNextAvailableId(type: 'plan' | 'task', parent?: string): Promise<number> {
    const directory = process.cwd(); // Default to current directory for now
    const typePrefix = type === 'plan' ? 'p' : 't';
    const expectedPrefix = parent ? `${parent}-${typePrefix}` : typePrefix;

    try {
      const files = await fs.readdir(directory);
      const matchingFiles = files
        .filter((file) => file.includes(expectedPrefix) && file.endsWith(`.${type}.md`))
        .map((file) => {
          const match = file.match(NamingValidator.DDD_FILE_PATTERN);
          if (!match) return null;

          const [, filePrefix, fileType, fileId] = match;
          const fullPrefix = filePrefix + fileType;

          // Check if this file matches our expected prefix pattern
          if (fullPrefix === expectedPrefix) {
            return parseInt(fileId, 10);
          }
          return null;
        })
        .filter((id): id is number => id !== null);

      if (matchingFiles.length === 0) {
        return 1; // First file of this type/parent combination
      }

      // Return the next available ID
      return Math.max(...matchingFiles) + 1;
    } catch (error) {
      // If directory reading fails, default to 1
      console.warn(`Warning: Could not read directory ${directory}, defaulting to ID 1`);
      return 1;
    }
  }

  public async checkNameConflicts(fileName: string, directory: string): Promise<ValidationResult> {
    const fullPath = path.join(directory, fileName);
    const exists = await this.fileManager.checkFileExists(fullPath);
    if (exists) {
      return {
        isValid: false,
        message: `File '${fileName}' already exists in '${directory}'.`,
      };
    }
    return { isValid: true };
  }
}
