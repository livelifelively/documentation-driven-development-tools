import { ConfigManager } from '../../../cli/services/config-manager';
import { vol } from 'memfs';
import { promises as fs } from 'fs';

// Mock the file system
jest.mock('fs', () => require('memfs').fs);

describe('ConfigManager', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should load the default config if ddd.config.json does not exist', async () => {
    const configManager = new ConfigManager();
    await configManager.loadConfig();
    expect(configManager.getRequirementsPath()).toBe('docs/requirements');
  });

  it('should load the path from ddd.config.json if it exists', async () => {
    const config = {
      documentation: {
        requirementsPath: 'my-custom-docs',
      },
    };
    // Use a specific path for the test and ensure the CWD is mocked to match
    const MOCK_CWD = '/app';
    const CONFIG_PATH = `${MOCK_CWD}/ddd.config.json`;
    vol.fromJSON({
      [CONFIG_PATH]: JSON.stringify(config),
    });
    jest.spyOn(process, 'cwd').mockReturnValue(MOCK_CWD);

    const configManager = new ConfigManager();
    await configManager.loadConfig();
    expect(configManager.getRequirementsPath()).toBe('my-custom-docs');
  });

  it('should return the default path if ddd.config.json is malformed', async () => {
    vol.fromJSON({
      '/ddd.config.json': 'this is not json',
    });

    const configManager = new ConfigManager();
    await configManager.loadConfig();
    expect(configManager.getRequirementsPath()).toBe('docs/requirements');
  });

  it('should handle an empty ddd.config.json file', async () => {
    vol.fromJSON({
      '/ddd.config.json': '{}',
    });

    const configManager = new ConfigManager();
    await configManager.loadConfig();
    expect(configManager.getRequirementsPath()).toBe('docs/requirements');
  });
});
