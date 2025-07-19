import { findDocumentationFiles } from '../scanner';
import * as path from 'path';
import * as fs from 'fs';

describe('findDocumentationFiles', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');

  describe('AC-1: Identifies all valid DDD files', () => {
    it('should find all valid DDD documentation files', async () => {
      const validDir = path.join(fixturesDir, 'valid');
      const files = await findDocumentationFiles(validDir);

      expect(files).toHaveLength(4);
      expect(files).toContain(path.join(validDir, 'project.md'));
      expect(files).toContain(path.join(validDir, 'm1-sample', 'm1-sample.module.md'));
      expect(files).toContain(path.join(validDir, 'm1-sample', 'm1-e1-sample', 'm1-e1-sample.epic.md'));
      expect(files).toContain(path.join(validDir, 'm1-sample', 'm1-e1-sample', 'm1-e1-t1-sample.task.md'));
    });
  });

  describe('AC-2: Recursively searches subdirectories', () => {
    it('should find files in nested directory structures', async () => {
      const validDir = path.join(fixturesDir, 'valid');
      const files = await findDocumentationFiles(validDir);

      // Should find files at multiple levels
      const hasProjectFile = files.some((file) => file.endsWith('project.md'));
      const hasModuleFile = files.some((file) => file.includes('m1-sample') && file.endsWith('.module.md'));
      const hasEpicFile = files.some((file) => file.includes('m1-e1-sample') && file.endsWith('.epic.md'));
      const hasTaskFile = files.some((file) => file.includes('m1-e1-t1-sample') && file.endsWith('.task.md'));

      expect(hasProjectFile).toBe(true);
      expect(hasModuleFile).toBe(true);
      expect(hasEpicFile).toBe(true);
      expect(hasTaskFile).toBe(true);
    });
  });

  describe('AC-3: Ignores non-DDD markdown files', () => {
    it('should not include README.md and CONTRIBUTING.md files', async () => {
      const mixedDir = path.join(fixturesDir, 'mixed');
      const files = await findDocumentationFiles(mixedDir);

      // Should not contain non-DDD files
      expect(files).not.toContain(path.join(mixedDir, 'README.md'));
      expect(files).not.toContain(path.join(mixedDir, 'CONTRIBUTING.md'));

      // Should only contain valid DDD files
      expect(files).toHaveLength(2);
      expect(files).toContain(path.join(mixedDir, 'project.md'));
      expect(files).toContain(path.join(mixedDir, 'm1-sample', 'm1-sample.module.md'));
    });
  });

  describe('AC-4: Returns sorted array of absolute paths', () => {
    it('should return absolute paths sorted alphabetically', async () => {
      const validDir = path.join(fixturesDir, 'valid');
      const files = await findDocumentationFiles(validDir);

      // Check that all paths are absolute
      files.forEach((file) => {
        expect(path.isAbsolute(file)).toBe(true);
      });

      // Check that files are sorted alphabetically
      const sortedFiles = [...files].sort();
      expect(files).toEqual(sortedFiles);
    });
  });

  describe('AC-5: Throws error for non-existent directory', () => {
    it('should throw an error when rootDir does not exist', async () => {
      const nonExistentDir = path.join(fixturesDir, 'non-existent');

      await expect(findDocumentationFiles(nonExistentDir)).rejects.toThrow('Root directory not found at');
    });

    it('should include error details in JSON format', async () => {
      const nonExistentDir = path.join(fixturesDir, 'non-existent');

      try {
        await findDocumentationFiles(nonExistentDir);
        fail('Expected function to throw an error');
      } catch (error) {
        expect((error as any).details).toBeDefined();
        expect((error as any).details.path).toBe(nonExistentDir);
        expect((error as any).details.type).toBe('not_found');
        expect((error as any).details.code).toBe('ENOENT');
      }
    });
  });

  describe('Additional error handling', () => {
    it('should throw an error when rootDir is a file, not a directory', async () => {
      // Create a temporary file
      const tempFile = path.join(fixturesDir, 'temp-file.md');
      fs.writeFileSync(tempFile, '# Temp file for directory test');
      try {
        await findDocumentationFiles(tempFile);
        fail('Expected function to throw an error');
      } catch (error) {
        expect((error as any).message).toContain('Root directory not found at');
        expect((error as any).details).toBeDefined();
        expect((error as any).details.type).toBe('not_directory');
      } finally {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    });
  });
});
