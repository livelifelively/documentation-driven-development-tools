import { main } from '../../../cli';
import { DocsInitializer } from '../../../cli/services/docs-initializer';
import { vol } from 'memfs';
import * as path from 'path';

jest.mock('fs/promises');

describe('CLI init command', () => {
  let initializeSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset the mock before each test
    vol.reset();
    initializeSpy = jest.spyOn(DocsInitializer.prototype, 'initialize');
  });

  afterEach(() => {
    initializeSpy.mockRestore();
  });

  it('should call DocsInitializer.initialize with correct options', async () => {
    initializeSpy.mockResolvedValue(undefined);

    await main(['init']);

    expect(initializeSpy).toHaveBeenCalledTimes(1);
    expect(initializeSpy).toHaveBeenCalledWith({
      outputDir: process.cwd(),
      force: false,
    });
  });

  it('should pass --force flag to initializer', async () => {
    initializeSpy.mockResolvedValue(undefined);

    await main(['init', '--force']);

    expect(initializeSpy).toHaveBeenCalledWith({
      outputDir: process.cwd(),
      force: true,
    });
  });

  it('should pass --output-dir to initializer', async () => {
    initializeSpy.mockResolvedValue(undefined);
    const outputDir = '/test/dir';

    await main(['init', '--output-dir', outputDir]);

    expect(initializeSpy).toHaveBeenCalledWith({
      outputDir,
      force: false,
    });
  });

  it('should log success message on successful initialization', async () => {
    initializeSpy.mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await main(['init']);

    expect(consoleSpy).toHaveBeenCalledWith("✅ DDD documentation structure initialized in 'docs/'");
    consoleSpy.mockRestore();
  });

  it('should log error message on failed initialization', async () => {
    const errorMessage = 'Initialization failed';
    initializeSpy.mockRejectedValue(new Error(errorMessage));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(main(['init'])).rejects.toThrow(errorMessage);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));

    consoleErrorSpy.mockRestore();
  });
});
