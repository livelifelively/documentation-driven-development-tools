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
  });

  afterEach(async () => {
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  });

  it('should generate a plan template', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} template plan my-plan --output-dir ${TEMP_DIR}`);
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, 'p1-my-plan.plan.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should generate a task template', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} template task my-task --output-dir ${TEMP_DIR}`);
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, 't1-my-task.task.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should handle parent hierarchy', async () => {
    const { stdout } = await execAsync(
      `node ${CLI_PATH} template task my-child-task --parent p1-my-plan --output-dir ${TEMP_DIR}`
    );
    expect(stdout).toContain('Successfully generated');
    const expectedFile = path.join(TEMP_DIR, 'p1-my-plan-t1-my-child-task.task.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should prevent overwriting existing files', async () => {
    const planName = 'my-plan';
    const expectedFile = path.join(TEMP_DIR, `p1-${planName}.plan.md`);
    await fs.writeFile(expectedFile, 'existing content');

    const promise = execAsync(`node ${CLI_PATH} template plan ${planName} --output-dir ${TEMP_DIR}`);

    await expect(promise).rejects.toThrow();
  });

  it('should show an error for invalid names', async () => {
    const promise = execAsync(`node ${CLI_PATH} template plan InvalidName --output-dir ${TEMP_DIR}`);
    await expect(promise).rejects.toThrow();
  });

  it('should perform a dry run correctly', async () => {
    const { stdout } = await execAsync(
      `node ${CLI_PATH} template plan my-dry-run-plan --dry-run --output-dir ${TEMP_DIR}`
    );
    expect(stdout).toContain('Dry run mode');
    const expectedFile = path.join(TEMP_DIR, 'p1-my-dry-run-plan.plan.md');
    await expect(fs.stat(expectedFile)).rejects.toThrow();
  });
});
