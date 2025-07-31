import { main } from '../../../cli/index.js';
import { DocsInitializer } from '../../../cli/services/docs-initializer.js';
import { vol } from 'memfs';
import * as path from 'path';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('fs/promises');

describe('CLI init command', () => {
  let initializeSpy: any;

  beforeEach(() => {
    // Reset the mock before each test
    vol.reset();
    initializeSpy = vi.spyOn(DocsInitializer.prototype, 'initialize');
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
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await main(['init']);

    expect(consoleSpy).toHaveBeenCalledWith("✅ DDD documentation structure initialized in 'docs/'");
    consoleSpy.mockRestore();
  });

  it('should log error message on failed initialization', async () => {
    const errorMessage = 'Initialization failed';
    initializeSpy.mockRejectedValue(new Error(errorMessage));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(main(['init'])).rejects.toThrow(errorMessage);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));

    consoleErrorSpy.mockRestore();
  });
});
