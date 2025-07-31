import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseTask } from '../index.js';
import { CoreEngine } from '../core-engine.js';

// Mock the CoreEngine
vi.mock('../core-engine.js');

describe('API', () => {
  let mockCoreEngine: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock CoreEngine instance
    mockCoreEngine = {
      parse: vi.fn(),
      loadPlugins: vi.fn(),
    };

    // Mock the CoreEngine constructor
    vi.mocked(CoreEngine).mockImplementation(() => mockCoreEngine);
  });

  describe('parseTask', () => {
    const mockParseResult = {
      data: {
        meta: {
          status: {
            currentState: '💡 Not Started',
            priority: '🟥 High',
            progress: 0,
          },
        },
      },
      errors: [],
    };

    beforeEach(() => {
      mockCoreEngine.parse.mockResolvedValue(mockParseResult);
    });

    it('should call CoreEngine.parse with the provided file path', async () => {
      const filePath = 'test-file.task.md';

      await parseTask(filePath);

      expect(mockCoreEngine.parse).toHaveBeenCalledWith(filePath);
    });

    it('should return the result from CoreEngine.parse', async () => {
      const result = await parseTask('test-file.task.md');

      expect(result).toEqual(mockParseResult);
    });

    it('should handle errors from CoreEngine.parse', async () => {
      const mockError = new Error('File not found');
      mockCoreEngine.parse.mockRejectedValue(mockError);

      await expect(parseTask('non-existent-file.task.md')).rejects.toThrow('File not found');
    });

    it('should return structured data with errors when parsing fails', async () => {
      const mockResultWithErrors = {
        data: null,
        errors: [{ section: '1.2', message: 'Missing required field: Priority' }],
      };

      mockCoreEngine.parse.mockResolvedValue(mockResultWithErrors);

      const result = await parseTask('invalid-file.task.md');

      expect(result).toEqual(mockResultWithErrors);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle different file paths correctly', async () => {
      const filePaths = [
        'docs/requirements/test.task.md',
        './relative/path/file.task.md',
        '/absolute/path/file.task.md',
      ];

      for (const filePath of filePaths) {
        await parseTask(filePath);
        expect(mockCoreEngine.parse).toHaveBeenCalledWith(filePath);
      }
    });
  });
});
