import { main } from '../../../cli/index.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI End-to-End Tests', () => {
  const cliPath = 'dist/src/cli/index.js';

  it('should show help message with --help flag', async () => {
    const { stdout } = await execAsync(`node ${cliPath} --help`);
    expect(stdout).toContain('Usage: ddd <command> [options]');
    expect(stdout).toContain('Commands:');
    expect(stdout).toContain('Options:');
  });

  it('should show version number with --version flag', async () => {
    const { stdout } = await execAsync(`node ${cliPath} --version`);
    const pkg = require('../../../../package.json');
    expect(stdout.trim()).toBe(pkg.version);
  });

  describe('hello command', () => {
    it('should return default greeting', async () => {
      const { stdout } = await execAsync(`node ${cliPath} hello`);
      expect(stdout.trim()).toBe('Hello, World!');
    });

    it('should return greeting with provided name', async () => {
      const { stdout } = await execAsync(`node ${cliPath} hello Srign`);
      expect(stdout.trim()).toBe('Hello, Srign!');
    });

    it('should return greeting in uppercase with --caps flag', async () => {
      const { stdout } = await execAsync(`node ${cliPath} hello Srign --caps`);
      expect(stdout.trim()).toBe('HELLO, SRIGN!');
    });
  });
});

describe('CLI Integration Tests', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should call hello command with default name', async () => {
    await main(['hello']);
    expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
  });

  it('should call hello command with provided name', async () => {
    await main(['hello', 'Srign']);
    expect(consoleSpy).toHaveBeenCalledWith('Hello, Srign!');
  });

  it('should call hello command with --caps flag', async () => {
    await main(['hello', 'Srign', '--caps']);
    expect(consoleSpy).toHaveBeenCalledWith('HELLO, SRIGN!');
  });
});
