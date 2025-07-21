import { NamingValidator } from '../../../cli/services/naming-validator';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('NamingValidator', () => {
  let validator: NamingValidator;
  let tempDir: string;

  beforeEach(async () => {
    validator = new NamingValidator();
    // Create a temporary directory for real file system tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ddd-test-'));
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
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

    it('should return invalid for names starting with a number', () => {
      const result = validator.validateName('1-my-plan');
      expect(result.isValid).toBe(false);
    });
  });

  describe('generateFileName', () => {
    beforeEach(() => {
      // Mock process.cwd to return our temp directory
      jest.spyOn(process, 'cwd').mockReturnValue(tempDir);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should generate a correct plan file name', async () => {
      const fileName = await validator.generateFileName('plan', 'my-plan');
      expect(fileName).toBe('p1-my-plan.plan.md');
    });

    it('should generate a correct task file name', async () => {
      const fileName = await validator.generateFileName('task', 'my-task');
      expect(fileName).toBe('t1-my-task.task.md');
    });

    it('should generate a correct file name with a parent', async () => {
      const fileName = await validator.generateFileName('task', 'my-task', 'p1-parent');
      expect(fileName).toBe('p1-parent-t1-my-task.task.md');
    });

    describe('Incremental ID Generation', () => {
      it('should generate sequential plan IDs when files exist', async () => {
        // Create existing plan files
        await fs.writeFile(path.join(tempDir, 'p1-existing.plan.md'), 'content');
        await fs.writeFile(path.join(tempDir, 'p2-existing.plan.md'), 'content');

        const fileName = await validator.generateFileName('plan', 'new-plan');
        expect(fileName).toBe('p3-new-plan.plan.md');
      });

      it('should generate sequential task IDs when files exist', async () => {
        // Create existing task files
        await fs.writeFile(path.join(tempDir, 't1-existing.task.md'), 'content');
        await fs.writeFile(path.join(tempDir, 't2-existing.task.md'), 'content');

        const fileName = await validator.generateFileName('task', 'new-task');
        expect(fileName).toBe('t3-new-task.task.md');
      });

      it('should handle mixed plan and task files correctly', async () => {
        // Create mixed files - plans and tasks should have separate ID sequences
        await fs.writeFile(path.join(tempDir, 'p1-plan.plan.md'), 'content');
        await fs.writeFile(path.join(tempDir, 't1-task.task.md'), 'content');
        await fs.writeFile(path.join(tempDir, 'p2-plan.plan.md'), 'content');

        const planFileName = await validator.generateFileName('plan', 'new-plan');
        const taskFileName = await validator.generateFileName('task', 'new-task');

        expect(planFileName).toBe('p3-new-plan.plan.md');
        expect(taskFileName).toBe('t2-new-task.task.md');
      });

      it('should generate sequential IDs for hierarchical files', async () => {
        // Create existing hierarchical files
        await fs.writeFile(path.join(tempDir, 'p1-backend-t1-api.task.md'), 'content');
        await fs.writeFile(path.join(tempDir, 'p1-backend-t2-db.task.md'), 'content');

        const fileName = await validator.generateFileName('task', 'auth', 'p1-backend');
        expect(fileName).toBe('p1-backend-t3-auth.task.md');
      });

      it('should handle complex deep hierarchies', async () => {
        // Test deep hierarchy: p1-p2-p3-t1-name.task.md
        await fs.writeFile(path.join(tempDir, 'p1-backend-p2-api-t1-users.task.md'), 'content');

        const fileName = await validator.generateFileName('task', 'products', 'p1-backend-p2-api');
        expect(fileName).toBe('p1-backend-p2-api-t2-products.task.md');
      });

      it('should handle gaps in numbering correctly', async () => {
        // Create files with gaps (e.g., p1, p3, p5)
        await fs.writeFile(path.join(tempDir, 'p1-first.plan.md'), 'content');
        await fs.writeFile(path.join(tempDir, 'p3-third.plan.md'), 'content');
        await fs.writeFile(path.join(tempDir, 'p5-fifth.plan.md'), 'content');

        const fileName = await validator.generateFileName('plan', 'new-plan');
        expect(fileName).toBe('p6-new-plan.plan.md'); // Should take next after highest
      });

      it('should ignore non-DDD files when scanning', async () => {
        // Create non-DDD files that should be ignored
        await fs.writeFile(path.join(tempDir, 'README.md'), 'content');
        await fs.writeFile(path.join(tempDir, 'package.json'), 'content');
        await fs.writeFile(path.join(tempDir, 'random-file.txt'), 'content');

        const fileName = await validator.generateFileName('plan', 'my-plan');
        expect(fileName).toBe('p1-my-plan.plan.md'); // Should start from 1, ignoring non-DDD files
      });

      it('should handle directory read errors gracefully', async () => {
        // Mock a directory that doesn't exist
        jest.spyOn(process, 'cwd').mockReturnValue('/nonexistent/directory');

        const fileName = await validator.generateFileName('plan', 'my-plan');
        expect(fileName).toBe('p1-my-plan.plan.md'); // Should default to 1
      });
    });
  });

  describe('checkNameConflicts', () => {
    it('should return valid when no conflict exists', async () => {
      const result = await validator.checkNameConflicts('new-file.md', tempDir);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when a conflict exists', async () => {
      const fileName = 'existing-file.md';
      await fs.writeFile(path.join(tempDir, fileName), 'content');

      const result = await validator.checkNameConflicts(fileName, tempDir);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('already exists');
    });
  });
});
