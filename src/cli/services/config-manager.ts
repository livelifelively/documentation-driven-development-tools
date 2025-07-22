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

  private config: DddConfig = ConfigManager.DEFAULT_CONFIG;

  public async loadConfig(rootDir: string = process.cwd()): Promise<void> {
    const configPath = path.join(rootDir, 'ddd.config.json');
    try {
      const fileContent = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(fileContent);
    } catch (error: unknown) {
      const isError = error instanceof Error;
      if (isError && 'code' in error && error.code === 'ENOENT') {
        // This is an expected case (no config file), so we just use defaults.
        this.config = ConfigManager.DEFAULT_CONFIG;
      } else {
        const message = isError ? error.message : 'An unknown error occurred';
        console.warn(`Warning: Could not parse ddd.config.json. Using default settings. Error: ${message}`);
        this.config = ConfigManager.DEFAULT_CONFIG;
      }
    }
  }

  public getRequirementsPath(): string {
    return this.config.documentation.requirementsPath;
  }
}
