import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

const CLI_PATH = path.resolve(__dirname, '../../../../dist/src/cli/index.js');
const TEMP_DIR = path.resolve(__dirname, 'temp');

describe('CLI Template Command', () => {
  beforeEach(async () => {
    await fs.mkdir(TEMP_DIR, { recursive: true });
    const config = {
      documentation: {
        requirementsPath: '.',
      },
    };
    await fs.writeFile(path.join(TEMP_DIR, 'ddd.config.json'), JSON.stringify(config));
  });

  afterEach(async () => {
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  });

  it('should generate a plan template', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} template plan my-plan`, { cwd: TEMP_DIR });
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, 'p1-my-plan.plan.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should generate a task template', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} template task my-task`, { cwd: TEMP_DIR });
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, 't1-my-task.task.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should handle parent hierarchy', async () => {
    // First, create the parent plan
    await execAsync(`node ${CLI_PATH} template plan my-plan`, { cwd: TEMP_DIR });

    const { stdout } = await execAsync(`node ${CLI_PATH} template task my-child-task --parent p1-my-plan`, {
      cwd: TEMP_DIR,
    });
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, 'p1-my-plan-t1-my-child-task.task.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should generate the next sequential file if the first one exists', async () => {
    const planName = 'my-plan';
    // Create the first file
    await execAsync(`node ${CLI_PATH} template plan ${planName}`, { cwd: TEMP_DIR });

    // Run the command again
    const { stdout } = await execAsync(`node ${CLI_PATH} template plan ${planName}`, { cwd: TEMP_DIR });

    // Expect it to succeed by creating the second file
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, `p2-${planName}.plan.md`);
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should show an error for invalid names', async () => {
    const promise = execAsync(`node ${CLI_PATH} template plan InvalidName`, { cwd: TEMP_DIR });
    await expect(promise).rejects.toThrow();
  });

  it('should perform a dry run correctly', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} template plan my-dry-run-plan --dry-run`, {
      cwd: TEMP_DIR,
    });
    expect(stdout).toContain('Dry run mode');
    const expectedFile = path.join(TEMP_DIR, 'p1-my-dry-run-plan.plan.md');
    await expect(fs.stat(expectedFile)).rejects.toThrow();
  });
});
