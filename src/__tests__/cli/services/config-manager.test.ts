import { vol } from 'memfs';
import { ConfigManager } from '../../../cli/services/config-manager.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('fs', () => require('memfs').fs);
vi.mock('fs/promises', () => require('memfs').fs.promises);

const TEST_DIR = '/test-dir';

describe('ConfigManager', () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(
      {
        'some-other-file.txt': 'hello',
      },
      TEST_DIR
    );
  });

  it('should return the default requirements path if no config file is found', async () => {
    const configManager = new ConfigManager();
    await configManager.loadConfig(TEST_DIR);
    expect(configManager.getRequirementsPath()).toBe('docs/requirements');
  });

  it('should load the requirements path from ddd.config.json if it exists', async () => {
    const customConfig = {
      documentation: {
        requirementsPath: 'my/custom/docs',
      },
    };
    vol.fromJSON(
      {
        'ddd.config.json': JSON.stringify(customConfig),
      },
      TEST_DIR
    );

    const configManager = new ConfigManager();
    await configManager.loadConfig(TEST_DIR);
    expect(configManager.getRequirementsPath()).toBe('my/custom/docs');
  });

  it('should return the default requirements path if the config file is malformed', async () => {
    vol.fromJSON(
      {
        'ddd.config.json': 'this is not json',
      },
      TEST_DIR
    );

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const configManager = new ConfigManager();
    await configManager.loadConfig(TEST_DIR);

    expect(configManager.getRequirementsPath()).toBe('docs/requirements');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Warning: Could not parse ddd.config.json.'));

    consoleWarnSpy.mockRestore();
  });

  it('should use process.cwd() by default if no directory is provided', async () => {
    const customConfig = {
      documentation: {
        requirementsPath: 'cwd/docs',
      },
    };
    // Set up the file in the mocked process.cwd()
    vol.fromJSON(
      {
        'ddd.config.json': JSON.stringify(customConfig),
      },
      process.cwd()
    );

    const configManager = new ConfigManager();
    await configManager.loadConfig(); // No argument
    expect(configManager.getRequirementsPath()).toBe('cwd/docs');
  });
});
