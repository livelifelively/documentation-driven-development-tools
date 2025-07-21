import { FileManager } from '../../../cli/services/file-manager';
import { promises as fs } from 'fs';
import path from 'path';

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
  },
}));

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('FileManager', () => {
  let fileManager: FileManager;

  beforeEach(() => {
    jest.resetAllMocks();
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
    it('should call fs.mkdir with recursive true', async () => {
      const dirPath = '/some/path';
      await fileManager.ensureDirectoryExists(dirPath);
      expect(mockedFs.mkdir).toHaveBeenCalledWith(dirPath, { recursive: true });
    });

    it('should not throw if directory already exists', async () => {
      mockedFs.mkdir.mockRejectedValue({ code: 'EEXIST' });
      await expect(fileManager.ensureDirectoryExists('/some/path')).resolves.not.toThrow();
    });

    it('should throw other errors from fs.mkdir', async () => {
      const error = new Error('Some other error');
      mockedFs.mkdir.mockRejectedValue(error);
      await expect(fileManager.ensureDirectoryExists('/some/path')).rejects.toThrow('Some other error');
    });
  });

  describe('writeTemplate', () => {
    it('should ensure directory exists and write the file', async () => {
      const filePath = '/some/path/file.md';
      const content = 'hello world';
      await fileManager.writeTemplate(filePath, content);
      expect(mockedFs.mkdir).toHaveBeenCalledWith('/some/path', { recursive: true });
      expect(mockedFs.writeFile).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });
  });

  describe('checkFileExists', () => {
    it('should return true if file exists', async () => {
      mockedFs.access.mockResolvedValue(undefined);
      const exists = await fileManager.checkFileExists('/some/path/file.md');
      expect(exists).toBe(true);
    });

    it('should return false if file does not exist', async () => {
      mockedFs.access.mockRejectedValue(new Error('File not found'));
      const exists = await fileManager.checkFileExists('/some/path/file.md');
      expect(exists).toBe(false);
    });
  });
});
