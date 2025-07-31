import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoreEngine } from '../core-engine.js';
import { MarkdownParser } from '../markdown-parser.js';
import { PluginManager } from '../plugin-manager.js';
import { SectionProcessor } from '../plugin.types.js';

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

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks();

    // Create mock instances
    mockMarkdownParser = {
      toAst: vi.fn(),
    };

    mockPluginManager = {
      loadPlugins: vi.fn(),
      getProcessor: vi.fn(),
      getAllProcessors: vi.fn(),
    };

    // Mock the constructors
    vi.mocked(MarkdownParser).mockImplementation(() => mockMarkdownParser);
    vi.mocked(PluginManager).mockImplementation(() => mockPluginManager);

    // Get the mocked fs module
    mockFs = (await import('fs')).promises;

    coreEngine = new CoreEngine(mockPluginManager);
  });

  describe('parse', () => {
    const mockFileContent = `
# Test Task

## 1.2 Status
- **Current State:** 💡 Not Started
- **Priority:** 🟥 High

## 2.1 Overview
This is a test task.
    `;

    const mockAst = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 1,
          children: [{ type: 'text', value: 'Test Task' }],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: '1.2 Status' }],
        },
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [{ type: 'text', value: '**Current State:** 💡 Not Started' }],
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: '2.1 Overview' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'This is a test task.' }],
        },
      ],
    };

    const mockProcessor: any = {
      sectionId: '1.2',
      lint: vi.fn(),
      extract: vi.fn(),
      getTargetPath: vi.fn().mockReturnValue('meta.status'),
    };

    beforeEach(() => {
      // Mock the AST parsing
      mockMarkdownParser.toAst.mockReturnValue(mockAst);

      // Mock plugin manager to return our test processor
      mockPluginManager.getProcessor.mockReturnValue(mockProcessor);

      // Setup mock return values
      mockProcessor.lint.mockReturnValue([]);
      mockProcessor.extract.mockReturnValue({
        currentState: '💡 Not Started',
        priority: '🟥 High',
      });
      mockProcessor.getTargetPath.mockReturnValue('meta.status');
    });

    it('should read file content and parse it to AST', async () => {
      // Mock file system read
      mockFs.readFile.mockResolvedValue(mockFileContent);

      const result = await coreEngine.parse('test-file.task.md');

      expect(mockFs.readFile).toHaveBeenCalledWith('test-file.task.md', 'utf-8');
      expect(mockMarkdownParser.toAst).toHaveBeenCalledWith(mockFileContent);
      expect(result).toBeDefined();
    });

    it('should find and process sections with available processors', async () => {
      // Mock file system read
      mockFs.readFile.mockResolvedValue(mockFileContent);

      const result = await coreEngine.parse('test-file.task.md');

      expect(mockPluginManager.getProcessor).toHaveBeenCalledWith('1.2');
      expect(mockProcessor.lint).toHaveBeenCalled();
      expect(mockProcessor.extract).toHaveBeenCalled();
    });

    it('should skip sections without available processors', async () => {
      // Mock file system read
      mockFs.readFile.mockResolvedValue(mockFileContent);

      // Mock plugin manager to return undefined for some sections
      mockPluginManager.getProcessor
        .mockReturnValueOnce(mockProcessor) // For '1.2'
        .mockReturnValueOnce(undefined); // For '2.1'

      const result = await coreEngine.parse('test-file.task.md');

      expect(mockPluginManager.getProcessor).toHaveBeenCalledWith('1.2');
      expect(mockPluginManager.getProcessor).toHaveBeenCalledWith('2.1');
      expect(mockProcessor.lint).toHaveBeenCalledTimes(1); // Only called once for '1.2'
    });

    it('should return structured data from processors', async () => {
      // Mock file system read
      mockFs.readFile.mockResolvedValue(mockFileContent);

      const result = await coreEngine.parse('test-file.task.md');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('errors');
      expect(result.errors).toEqual([]);
    });

    it('should handle linting errors from processors', async () => {
      // Mock file system read
      mockFs.readFile.mockResolvedValue(mockFileContent);

      const mockErrors = [{ section: '1.2', message: 'Missing required field: Priority' }];

      // Reset all mocks to ensure clean state
      vi.clearAllMocks();

      // Re-setup the mocks for this specific test
      mockFs.readFile.mockResolvedValue(mockFileContent);
      mockMarkdownParser.toAst.mockReturnValue(mockAst);
      mockPluginManager.getProcessor.mockReturnValue(mockProcessor);
      mockProcessor.lint.mockReturnValue(mockErrors);
      mockProcessor.extract.mockReturnValue({
        currentState: '💡 Not Started',
        priority: '🟥 High',
      });
      mockProcessor.getTargetPath.mockReturnValue('meta.status');

      const result = await coreEngine.parse('test-file.task.md');

      // Since the mock returns the same errors each time it's called,
      // and the processor might be called multiple times for different sections,
      // we should check that the errors array contains our expected errors
      expect(result.errors).toContainEqual(mockErrors[0]);
      expect(result.errors.length).toBeGreaterThanOrEqual(mockErrors.length);
    });

    it('should throw error for invalid file path', async () => {
      // Mock fs to throw error
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(coreEngine.parse('non-existent-file.task.md')).rejects.toThrow(
        'Cannot read file at non-existent-file.task.md.'
      );
    });

    it('should handle runtime errors within a plugin gracefully', async () => {
      // Mock file system read
      mockFs.readFile.mockResolvedValue(mockFileContent);

      // Mock a processor that throws an error
      const errorProcessor = {
        sectionId: '1.2',
        lint: vi.fn().mockImplementation(() => {
          throw new Error('Plugin runtime error');
        }),
        extract: vi.fn(),
        getTargetPath: vi.fn().mockReturnValue('meta.status'),
      };

      mockPluginManager.getProcessor.mockReturnValue(errorProcessor);

      const result = await coreEngine.parse('test-file.task.md');

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('Plugin runtime error');
    });
  });

  describe('loadPlugins', () => {
    it('should delegate plugin loading to PluginManager', () => {
      coreEngine.loadPlugins('test-plugins-directory');

      expect(mockPluginManager.loadPlugins).toHaveBeenCalledWith('test-plugins-directory');
    });
  });
});
