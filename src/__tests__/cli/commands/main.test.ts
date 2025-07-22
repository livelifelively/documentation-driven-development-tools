import { vol } from 'memfs';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock both fs and fs/promises to ensure all file system access is virtual
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const TEMP_DIR = '/main-test-dir';

describe('CLI Main Function (Isolated Test)', () => {
  let main: (args: string[]) => Promise<void>;

  beforeEach(() => {
    jest.resetModules();
    vol.reset();

    jest.spyOn(process, 'cwd').mockReturnValue(TEMP_DIR);

    const config = {
      documentation: {
        requirementsPath: '.',
      },
    };
    vol.fromJSON(
      {
        'ddd.config.json': JSON.stringify(config),
      },
      TEMP_DIR
    );

    main = require('../../../cli').main;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate a plan template in an isolated test', async () => {
    await main(['template', 'plan', 'my-isolated-plan']);
    const expectedFile = path.join(TEMP_DIR, 'docs', 'requirements', 'p1-my-isolated-plan.plan.md');
    const stats = await fs.stat(expectedFile);
    expect(stats.isFile()).toBe(true);
  });
});
