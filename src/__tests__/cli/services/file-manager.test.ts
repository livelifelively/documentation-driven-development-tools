import { FileManager } from '../../../cli/services/file-manager.js';
import { vol } from 'memfs';
import path from 'path';

// Mock the entire fs module with memfs
jest.mock('fs', () => require('memfs').fs);

describe('FileManager', () => {
  let fileManager: FileManager;

  beforeEach(() => {
    vol.reset();
    fileManager = new FileManager();
  });

  describe('resolveOutputPath', () => {
    it('should resolve the given directory relative to the current working directory', () => {
      const dir = 'some/dir';
      const expectedPath = path.resolve(process.cwd(), dir);
      expect(fileManager.resolveOutputPath(dir)).toBe(expectedPath);
    });

    it('should return the current working directory if no directory is provided', () => {
      expect(fileManager.resolveOutputPath()).toBe(process.cwd());
    });
  });

  describe('ensureDirectoryExists', () => {
    it('should create a directory if it does not exist', async () => {
      const dirPath = '/some/new/path';
      vol.fromJSON({}); // Ensure empty file system
      await fileManager.ensureDirectoryExists(dirPath);
      expect(vol.existsSync(dirPath)).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      const dirPath = '/some/existing/path';
      vol.fromJSON({ [dirPath]: null }); // Create directory
      await expect(fileManager.ensureDirectoryExists(dirPath)).resolves.not.toThrow();
    });
  });

  describe('writeTemplate', () => {
    it('should create the directory and write the file', async () => {
      const filePath = '/some/path/file.md';
      const content = 'hello world';
      vol.fromJSON({});
      await fileManager.writeTemplate(filePath, content);
      expect(vol.readFileSync(filePath, 'utf-8')).toBe(content);
    });
  });

  describe('checkFileExists', () => {
    it('should return true if file exists', async () => {
      const filePath = '/some/path/file.md';
      vol.fromJSON({ [filePath]: 'content' });
      const exists = await fileManager.checkFileExists(filePath);
      expect(exists).toBe(true);
    });

    it('should return false if file does not exist', async () => {
      vol.fromJSON({});
      const exists = await fileManager.checkFileExists('/non/existent/file.md');
      expect(exists).toBe(false);
    });
  });

  describe('getAllFiles', () => {
    it('should return an empty array for a non-existent directory', async () => {
      const files = await fileManager.getAllFiles('/non/existent');
      expect(files).toEqual([]);
    });

    it('should return all files in a flat directory', async () => {
      const dir = '/docs';
      vol.fromJSON({
        [`${dir}/file1.md`]: '',
        [`${dir}/file2.txt`]: '',
      });
      const files = await fileManager.getAllFiles(dir);
      expect(files).toHaveLength(2);
      expect(files).toContain(path.join(dir, 'file1.md'));
      expect(files).toContain(path.join(dir, 'file2.txt'));
    });

    it('should return all files recursively from nested directories', async () => {
      const dir = '/docs';
      vol.fromJSON({
        [`${dir}/root.md`]: '',
        [`${dir}/nested/file1.md`]: '',
        [`${dir}/nested/deep/file2.md`]: '',
        [`${dir}/another/file3.md`]: '',
      });
      const files = await fileManager.getAllFiles(dir);
      expect(files).toHaveLength(4);
      expect(files).toContain(path.join(dir, 'root.md'));
      expect(files).toContain(path.join(dir, 'nested/file1.md'));
      expect(files).toContain(path.join(dir, 'nested/deep/file2.md'));
      expect(files).toContain(path.join(dir, 'another/file3.md'));
    });
  });
});
