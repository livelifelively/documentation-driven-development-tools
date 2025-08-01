import { describe, it, expect, vi, beforeEach } from 'vitest';
import StatusPlugin from '../plugins/status.plugin.js';
import { SchemaValidator } from '../schema/schema-validator.js';
import { Root } from 'mdast';

// Mock the SchemaValidator
vi.mock('../schema/schema-validator.js');

const createMockAst = (lines: string[]): Root => ({
  type: 'root',
  children: [
    {
      type: 'list',
      children: lines.map((line) => ({
        type: 'listItem',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: line }],
          },
        ],
      })),
    },
  ],
});

describe('Status Plugin', () => {
  let mockValidator: any;
  let statusPlugin: StatusPlugin;

  beforeEach(() => {
    // Create a fresh mock for each test
    mockValidator = {
      validateSection: vi.fn(),
    };
    // Instantiate the plugin with the mock validator
    statusPlugin = new StatusPlugin(mockValidator);
    vi.clearAllMocks();
  });

  describe('lint', () => {
    it('should call the schema validator and return its errors', () => {
      // Arrange
      const mockAst = createMockAst(['Current State: 💡 Not Started', 'Priority: 🟥 High']);
      const expectedErrors = [{ section: '1.2 Status', message: 'Mock validation error' }];
      // Configure the mock to return a specific error
      mockValidator.validateSection.mockReturnValue(expectedErrors);

      // Act
      const errors = statusPlugin.lint(mockAst);

      // Assert
      // 1. Check that the validator was actually called
      expect(mockValidator.validateSection).toHaveBeenCalledWith(mockAst, '1.2', 'task');
      // 2. Check that the plugin returned the errors from the validator
      expect(errors).toEqual(expectedErrors);
    });

    it('should return no errors when the validator returns none', () => {
      // Arrange
      const mockAst = createMockAst(['Current State: 💡 Not Started', 'Priority: 🟥 High']);
      // Configure the mock to return an empty array
      mockValidator.validateSection.mockReturnValue([]);

      // Act
      const errors = statusPlugin.lint(mockAst);

      // Assert
      expect(mockValidator.validateSection).toHaveBeenCalledWith(mockAst, '1.2', 'task');
      expect(errors).toHaveLength(0);
    });
  });

  describe('extract', () => {
    it('should extract status data correctly', () => {
      const mockAst = createMockAst(['Current State: 💡 Not Started', 'Priority: 🟥 High', 'Progress: 25']);
      const data = statusPlugin.extract(mockAst);
      expect(data.currentState).toBe('💡 Not Started');
      expect(data.priority).toBe('🟥 High');
      expect(data.progress).toBe(25);
    });

    it('should handle missing fields gracefully', () => {
      const mockAst = createMockAst(['Current State: 💡 Not Started']);
      const data = statusPlugin.extract(mockAst);
      expect(data.currentState).toBe('💡 Not Started');
      expect(data.priority).toBeUndefined();
      expect(data.progress).toBeUndefined();
    });
  });
});
