import path from 'path';
import { FileManager } from './file-manager';
import { ConfigManager } from './config-manager';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export class NamingValidator {
  private fileManager: FileManager;
  private configManager: ConfigManager;
  private static readonly NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
  private static readonly DDD_FILE_PATTERN = /^(?:([a-z0-9-]+)-)?([pt])(\d+)-.*/;

  constructor() {
    this.fileManager = new FileManager();
    this.configManager = new ConfigManager();
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
    await this.configManager.loadConfig();
    const nextId = await this.getNextAvailableId(type, parent);
    const prefix = parent ? `${parent}-` : '';
    const typePrefix = type === 'plan' ? 'p' : 't';
    const suffix = `.${type}.md`;

    return `${prefix}${typePrefix}${nextId}-${name}${suffix}`;
  }

  private async getNextAvailableId(type: 'plan' | 'task', parent?: string): Promise<number> {
    const searchDirectory = this.configManager.getRequirementsPath();
    const typePrefix = type === 'plan' ? 'p' : 't';

    try {
      const files = await this.fileManager.getAllFiles(searchDirectory);
      const ids = files
        .map((file) => {
          const fileName = path.basename(file);
          const match = fileName.match(NamingValidator.DDD_FILE_PATTERN);

          if (!match) return null;

          const [, parentName, fileType, fileIdStr] = match;
          const fileId = parseInt(fileIdStr, 10);

          // If a parent is specified, we only match direct children
          if (parent) {
            if (parentName === parent && fileType === typePrefix) {
              return fileId;
            }
          } else {
            // If no parent, match only top-level files (where parentName is undefined)
            if (!parentName && fileType === typePrefix) {
              return fileId;
            }
          }
          return null;
        })
        .filter((id): id is number => id !== null);

      if (ids.length === 0) {
        return 1;
      }

      return Math.max(...ids) + 1;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.warn(`Warning: Could not process directory ${searchDirectory}, defaulting to ID 1. Error: ${message}`);
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
