import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoreEngine } from '../core-engine.js';
import { MarkdownParser } from '../markdown-parser.js';
import { PluginManager } from '../plugin-manager.js';

// Mock the dependencies
vi.mock('../markdown-parser.js');
vi.mock('../plugin-manager.js');
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
  },
}));

describe('CoreEngine', () => {
  let coreEngine: CoreEngine;
  let mockMarkdownParser: any;
  let mockPluginManager: any;
  let mockFs: any;

  const mockAst = { type: 'root', children: [] };
  const mockFileContent = '# Mock Content';

  beforeEach(async () => {
    vi.clearAllMocks();

    mockMarkdownParser = {
      toAst: vi.fn().mockReturnValue(mockAst),
    };

    mockPluginManager = {
      loadPlugins: vi.fn(),
      getAllProcessors: vi.fn().mockReturnValue([]), // Default to empty array
    };

    vi.mocked(MarkdownParser).mockImplementation(() => mockMarkdownParser);
    vi.mocked(PluginManager).mockImplementation(() => mockPluginManager);

    mockFs = (await import('fs')).promises;
    mockFs.readFile.mockResolvedValue(mockFileContent);

    coreEngine = new CoreEngine(mockPluginManager);
  });

  describe('parse', () => {
    it('should read file, parse to AST, and process with plugins', async () => {
      await coreEngine.parse('test.md');
      expect(mockFs.readFile).toHaveBeenCalledWith('test.md', 'utf-8');
      expect(mockMarkdownParser.toAst).toHaveBeenCalledWith(mockFileContent);
      expect(mockPluginManager.getAllProcessors).toHaveBeenCalled();
    });

    it('should call the process method on each loaded plugin', async () => {
      const mockProcessor1 = {
        sectionId: '1.2',
        process: vi.fn().mockReturnValue({ data: null, errors: [] }),
        getTargetPath: vi.fn(),
      };
      const mockProcessor2 = {
        sectionId: '2.1',
        process: vi.fn().mockReturnValue({ data: null, errors: [] }),
        getTargetPath: vi.fn(),
      };
      mockPluginManager.getAllProcessors.mockReturnValue([mockProcessor1, mockProcessor2]);

      await coreEngine.parse('test.md');

      expect(mockProcessor1.process).toHaveBeenCalledWith(mockAst);
      expect(mockProcessor2.process).toHaveBeenCalledWith(mockAst);
    });

    it('should aggregate data from multiple plugins correctly', async () => {
      const mockProcessor1 = {
        sectionId: '1.2',
        process: vi.fn().mockReturnValue({ data: { status: 'done' }, errors: [] }),
        getTargetPath: vi.fn().mockReturnValue('meta.status'),
      };
      const mockProcessor2 = {
        sectionId: '2.1',
        process: vi.fn().mockReturnValue({ data: { overview: 'text' }, errors: [] }),
        getTargetPath: vi.fn().mockReturnValue('business.overview'),
      };
      mockPluginManager.getAllProcessors.mockReturnValue([mockProcessor1, mockProcessor2]);

      const result = await coreEngine.parse('test.md');

      expect(result.data).toEqual({
        meta: { status: { status: 'done' } },
        business: { overview: { overview: 'text' } },
      });
      expect(result.errors).toHaveLength(0);
    });

    it('should aggregate errors from multiple plugins', async () => {
      const error1 = { section: '1.2', message: 'Error 1' };
      const error2 = { section: '2.1', message: 'Error 2' };
      const mockProcessor1 = {
        sectionId: '1.2',
        process: vi.fn().mockReturnValue({ data: null, errors: [error1] }),
        getTargetPath: vi.fn(),
      };
      const mockProcessor2 = {
        sectionId: '2.1',
        process: vi.fn().mockReturnValue({ data: null, errors: [error2] }),
        getTargetPath: vi.fn(),
      };
      mockPluginManager.getAllProcessors.mockReturnValue([mockProcessor1, mockProcessor2]);

      const result = await coreEngine.parse('test.md');

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContainEqual(error1);
      expect(result.errors).toContainEqual(error2);
    });

    it('should handle plugins that throw runtime errors gracefully', async () => {
      const error = new Error('Plugin failed!');
      const mockProcessor1 = {
        sectionId: '1.2',
        process: vi.fn().mockImplementation(() => {
          throw error;
        }),
        getTargetPath: vi.fn(),
      };
      mockPluginManager.getAllProcessors.mockReturnValue([mockProcessor1]);

      const result = await coreEngine.parse('test.md');

      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        section: '1.2',
        message: `Plugin runtime error: ${error.message}`,
      });
    });

    it('should throw an error if the file cannot be read', async () => {
      const readError = new Error('File not found');
      mockFs.readFile.mockRejectedValue(readError);

      await expect(coreEngine.parse('nonexistent.md')).rejects.toThrow('Cannot read file at nonexistent.md.');
    });
  });

  describe('loadPlugins', () => {
    it('should delegate plugin loading to PluginManager', async () => {
      await coreEngine.loadPlugins('some/dir');
      expect(mockPluginManager.loadPlugins).toHaveBeenCalledWith('some/dir');
    });
  });
});
