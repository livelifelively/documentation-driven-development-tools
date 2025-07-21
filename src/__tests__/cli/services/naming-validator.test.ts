import { NamingValidator } from '../../../cli/services/naming-validator';
import { ConfigManager } from '../../../cli/services/config-manager';
import { vol } from 'memfs';
import path from 'path';

// Mock the fs module
jest.mock('fs', () => require('memfs').fs);

// Mock the ConfigManager
jest.mock('../../../cli/services/config-manager');

const MockedConfigManager = ConfigManager as jest.MockedClass<typeof ConfigManager>;

describe('NamingValidator', () => {
  let validator: NamingValidator;

  beforeEach(() => {
    vol.reset();
    MockedConfigManager.mockClear();
    // Configure the mock to return the correct path
    const mockGetInstance = MockedConfigManager.prototype;
    mockGetInstance.getRequirementsPath.mockReturnValue('/docs/requirements');
    mockGetInstance.loadConfig.mockResolvedValue();

    validator = new NamingValidator();
  });

  describe('validateName', () => {
    it('should return valid for correct names', () => {
      const result = validator.validateName('my-plan');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for names with uppercase letters', () => {
      const result = validator.validateName('My-Plan');
      expect(result.isValid).toBe(false);
    });
  });

  describe('generateFileName', () => {
    it('should generate a correct plan file name with no parent', async () => {
      vol.fromJSON({ '/docs/requirements/p1-existing.plan.md': '' });
      const fileName = await validator.generateFileName('plan', 'my-plan');
      expect(fileName).toBe('p2-my-plan.plan.md');
    });

    it('should generate a correct task file name with a parent', async () => {
      vol.fromJSON({ '/docs/requirements/p1-parent-t1-existing.task.md': '' });
      const fileName = await validator.generateFileName('task', 'my-task', 'p1-parent');
      expect(fileName).toBe('p1-parent-t2-my-task.task.md');
    });
  });

  describe('getNextAvailableId', () => {
    it('should find the next ID when no parent is specified (recursive)', async () => {
      vol.fromJSON({
        '/docs/requirements/p1-plan.plan.md': '',
        '/docs/requirements/deep/p2-another.plan.md': '',
        '/docs/requirements/very/deep/p5-final.plan.md': '',
        '/docs/requirements/t4-task.task.md': '', // Should be ignored
      });
      const fileName = await validator.generateFileName('plan', 'new-plan');
      expect(fileName).toBe('p6-new-plan.plan.md');
    });

    it('should find the next ID for a specific parent', async () => {
      vol.fromJSON({
        '/docs/requirements/p1-t1-task.task.md': '',
        '/docs/requirements/p1-t3-task.task.md': '',
        '/docs/requirements/p2-t5-task.task.md': '', // Should be ignored
      });
      const fileName = await validator.generateFileName('task', 'new-task', 'p1');
      expect(fileName).toBe('p1-t4-new-task.task.md');
    });

    it('should correctly find the next ID for a deeply nested child', async () => {
      vol.fromJSON({
        '/docs/requirements/p1-top/p1-p2-mid/p1-p2-p3-leaf.plan.md': '',
        '/docs/requirements/p1-top/p1-p2-mid/p1-p2-t1-task.task.md': '',
        '/docs/requirements/p1-top/p1-p2-mid/p1-p2-t2-another.task.md': '',
      });
      const fileName = await validator.generateFileName('task', 'new-leaf-task', 'p1-p2');
      expect(fileName).toBe('p1-p2-t3-new-leaf-task.task.md');
    });

    it('should return 1 if no matching files are found', async () => {
      vol.fromJSON({
        '/docs/requirements/p1-plan.plan.md': '',
      });
      const fileName = await validator.generateFileName('task', 'first-task');
      expect(fileName).toBe('t1-first-task.task.md');
    });

    it('should handle an empty requirements directory', async () => {
      vol.fromJSON({
        '/docs/requirements': null,
      });
      const fileName = await validator.generateFileName('plan', 'first-plan');
      expect(fileName).toBe('p1-first-plan.plan.md');
    });
  });

  describe('checkNameConflicts', () => {
    it('should return valid when no conflict exists', async () => {
      vol.fromJSON({});
      const result = await validator.checkNameConflicts('new-file.md', '/docs');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when a conflict exists', async () => {
      const filePath = '/docs/existing-file.md';
      vol.fromJSON({ [filePath]: '' });
      const result = await validator.checkNameConflicts('existing-file.md', '/docs');
      expect(result.isValid).toBe(false);
    });
  });
});
