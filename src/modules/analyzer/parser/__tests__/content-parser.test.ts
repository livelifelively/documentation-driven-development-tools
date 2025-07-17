import { join } from 'path';
import { promises as fs } from 'fs';
import { parseDocumentation, OrphanedDocumentError } from '../content-parser';
import { ProjectModel } from '../../models';

describe('ContentParser', () => {
  const fixturesRoot = join(__dirname, 'fixtures');

  describe('AC-1/2/3: Valid hierarchy', () => {
    const validRoot = join(fixturesRoot, 'valid');
    const projectPath = join(validRoot, 'project.md');
    const modulePath = join(validRoot, 'm1-sample', 'm1-sample.module.md');
    const epicPath = join(validRoot, 'm1-sample', 'm1-e1-sample', 'm1-e1-sample.epic.md');
    const taskPath = join(validRoot, 'm1-sample', 'm1-e1-sample', 'm1-e1-t1-sample.task.md');
    const allFiles = [projectPath, modulePath, epicPath, taskPath];

    it('reads rawContent for each document (AC-1)', async () => {
      const model = await parseDocumentation(allFiles);
      // Check project
      const projectContent = await fs.readFile(projectPath, 'utf-8');
      expect(model.rawContent).toBe(projectContent);
      // Check module
      expect(model.modules).toHaveLength(1);
      const moduleContent = await fs.readFile(modulePath, 'utf-8');
      expect(model.modules[0].rawContent).toBe(moduleContent);
      // Check epic
      expect(model.modules[0].epics).toHaveLength(1);
      const epicContent = await fs.readFile(epicPath, 'utf-8');
      expect(model.modules[0].epics[0].rawContent).toBe(epicContent);
      // Check task
      expect(model.modules[0].epics[0].tasks).toHaveLength(1);
      const taskContent = await fs.readFile(taskPath, 'utf-8');
      expect(model.modules[0].epics[0].tasks[0].rawContent).toBe(taskContent);
    });

    it('builds the correct parent-child hierarchy (AC-2)', async () => {
      const model = await parseDocumentation(allFiles);
      expect(model.modules[0].epics[0].tasks[0].rawContent).toBeDefined();
      expect(model.modules[0].epics[0].tasks[0].path).toBe(taskPath);
    });

    it('identifies project.md as the root (AC-3)', async () => {
      const model = await parseDocumentation(allFiles);
      expect(model.path).toBe(projectPath);
      expect(model.modules[0].path).toBe(modulePath);
    });
  });

  describe('AC-4: Orphaned document error', () => {
    // Simulate a task file with no parent epic
    const validRoot = join(fixturesRoot, 'valid');
    const orphanTaskPath = join(validRoot, 'm1-sample', 'm1-e1-sample', 'orphan-task.task.md');
    const projectPath = join(validRoot, 'project.md');
    const modulePath = join(validRoot, 'm1-sample', 'm1-sample.module.md');
    // No epic file for this task
    const allFiles = [projectPath, modulePath, orphanTaskPath];

    beforeAll(async () => {
      // Create an orphan task file for this test
      await fs.writeFile(orphanTaskPath, '# Orphan Task\n\nThis task has no parent epic.');
    });
    afterAll(async () => {
      // Clean up
      await fs.unlink(orphanTaskPath);
    });

    it('throws OrphanedDocumentError for a task with no parent epic (AC-4)', async () => {
      await expect(parseDocumentation(allFiles)).rejects.toThrow(OrphanedDocumentError);
    });
  });
});
