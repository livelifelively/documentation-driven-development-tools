import { vol } from 'memfs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Arguments } from 'yargs';
import { handler as templateHandler } from '../../../cli/commands/template.js';

// Mock the file system
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const TEMP_DIR = '/temp-test-dir';

// Helper function to create a mocked argv object
const mockArgv = (args: { [key: string]: any }): Arguments<any> => {
  return {
    _: [],
    $0: '',
    ...args,
  } as Arguments<any>;
};

describe('CLI Template Command (Handler Test)', () => {
  beforeEach(() => {
    vol.reset();
    jest.spyOn(process, 'cwd').mockReturnValue(TEMP_DIR);

    const config = {
      documentation: {
        requirementsPath: 'docs/requirements',
      },
    };
    // Create the directory and the config file within it
    vol.fromJSON(
      {
        [path.join(TEMP_DIR, 'ddd.config.json')]: JSON.stringify(config),
      },
      TEMP_DIR
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate a plan template', async () => {
    const argv = mockArgv({ type: 'plan', name: 'my-plan' });
    await templateHandler(argv);
    const expectedFile = path.join(TEMP_DIR, 'docs/requirements/p1-my-plan.plan.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should throw an error if parent is missing for a task', async () => {
    const argv = mockArgv({ type: 'task', name: 'my-task' });
    await expect(templateHandler(argv)).rejects.toThrow('Failed to generate template: Tasks must have a parent plan.');
  });

  it('should generate a task template with parent', async () => {
    // First, create the parent plan
    await templateHandler(mockArgv({ type: 'plan', name: 'my-plan' }));
    // Now create the task
    const argv = mockArgv({ type: 'task', name: 'my-child-task', parent: 'p1-my-plan.plan.md' });
    await templateHandler(argv);
    const expectedFile = path.join(TEMP_DIR, 'docs/requirements/p1.t1-my-child-task.task.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should generate a task template with multi-level parent', async () => {
    await templateHandler(mockArgv({ type: 'plan', name: 'parent1' }));
    await templateHandler(mockArgv({ type: 'plan', name: 'foo', parent: 'p1-parent1.plan.md' }));
    await templateHandler(mockArgv({ type: 'task', name: 'bar', parent: 'p1.p2-foo.plan.md' }));
    const expectedFile = path.join(TEMP_DIR, 'docs/requirements/p1-p2.t1-bar.task.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should generate the next sequential file if one exists', async () => {
    await templateHandler(mockArgv({ type: 'plan', name: 'my-plan' }));
    await templateHandler(mockArgv({ type: 'plan', name: 'my-plan' }));
    const expectedFile = path.join(TEMP_DIR, 'docs/requirements/p2-my-plan.plan.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });

  it('should show an error for invalid names', async () => {
    const argv = mockArgv({ type: 'plan', name: 'InvalidName' });
    await expect(templateHandler(argv)).rejects.toThrow(
      "Invalid name format. Expected: [a-z-]+ (e.g., 'user-management'), but got 'InvalidName'."
    );
  });

  it('should perform a dry run correctly', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const argv = mockArgv({ type: 'plan', name: 'my-dry-run-plan', 'dry-run': true });
    await templateHandler(argv);

    let foundDryRunWarning = false;
    for (const call of logSpy.mock.calls) {
      if (typeof call[0] === 'string' && call[0].includes('Dry run mode')) {
        foundDryRunWarning = true;
        break;
      }
    }
    expect(foundDryRunWarning).toBe(true);

    const expectedFile = path.join(TEMP_DIR, 'docs/requirements/p1-my-dry-run-plan.plan.md');
    await expect(fs.stat(expectedFile)).rejects.toThrow();
    logSpy.mockRestore();
  });
});
