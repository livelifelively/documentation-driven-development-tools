import path from 'path';
import { promises as fs } from 'fs';

interface DddConfig {
  documentation: {
    requirementsPath: string;
  };
}

export class ConfigManager {
  private static readonly DEFAULT_CONFIG: DddConfig = {
    documentation: {
      requirementsPath: 'docs/requirements',
    },
  };

  private config: DddConfig | null = null;

  public async loadConfig(): Promise<void> {
    const configPath = path.join(process.cwd(), 'ddd.config.json');
    try {
      const fileContent = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(fileContent);
    } catch (error: unknown) {
      const isError = error instanceof Error;
      if (isError && 'code' in error && error.code === 'ENOENT') {
        console.warn('Warning: ddd.config.json not found. Using default settings.');
      } else {
        const message = isError ? error.message : 'An unknown error occurred';
        console.warn(`Warning: Could not parse ddd.config.json. Using default settings. Error: ${message}`);
      }
      this.config = null;
    }
  }

  public getRequirementsPath(): string {
    const path =
      this.config?.documentation?.requirementsPath ?? ConfigManager.DEFAULT_CONFIG.documentation.requirementsPath;
    return path;
  }
}
