import { describe, it, expect, vi, beforeEach } from 'vitest';
import StatusPlugin from '../plugins/status.plugin.js';
import { SchemaValidator } from '../schema/schema-validator.js';
import { Root } from 'mdast';

// Mock the SchemaValidator
vi.mock('../schema/schema-validator.js');

const createMockDocumentAst = (lines: string[]): Root => ({
  type: 'root',
  children: [
    { type: 'heading', depth: 1, children: [{ type: 'text', value: 'Some Other Section' }] },
    { type: 'paragraph', children: [{ type: 'text', value: 'Some other content.' }] },
    { type: 'heading', depth: 2, children: [{ type: 'text', value: '1.2 Status' }] },
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
    { type: 'heading', depth: 2, children: [{ type: 'text', value: '1.3 Another Section' }] },
  ],
});

describe('StatusPlugin', () => {
  let mockValidator: any;
  let statusPlugin: StatusPlugin;

  beforeEach(() => {
    mockValidator = {
      validate: vi.fn(),
    };
    statusPlugin = new StatusPlugin(mockValidator);
    vi.clearAllMocks();
  });

  describe('process', () => {
    it('should extract data, call the validator with it, and return the results', () => {
      // Arrange
      const mockAst = createMockDocumentAst(['Current State: In Progress', 'Priority: High']);
      const expectedData = {
        currentState: 'In Progress',
        priority: 'High',
      };
      const expectedErrors = [{ section: '1.2', message: 'A mock error' }];
      mockValidator.validate.mockReturnValue(expectedErrors);

      // Act
      const { data, errors } = statusPlugin.process(mockAst);

      // Assert
      expect(data).toEqual(expectedData);
      expect(errors).toEqual(expectedErrors);
      expect(mockValidator.validate).toHaveBeenCalledWith(expectedData, '1.2', 'task');
    });

    it('should return extracted data and no errors when validation passes', () => {
      // Arrange
      const mockAst = createMockDocumentAst(['Current State: Done']);
      const expectedData = {
        currentState: 'Done',
      };
      mockValidator.validate.mockReturnValue([]);

      // Act
      const { data, errors } = statusPlugin.process(mockAst);

      // Assert
      expect(data).toEqual(expectedData);
      expect(errors).toHaveLength(0);
      expect(mockValidator.validate).toHaveBeenCalledWith(expectedData, '1.2', 'task');
    });

    it('should return null data and errors if the section is not found but is required', () => {
      // Arrange
      const emptyAst: Root = { type: 'root', children: [] };
      const expectedErrors = [{ section: '1.2', message: 'Required section missing' }];
      mockValidator.validate.mockReturnValue(expectedErrors);

      // Act
      const { data, errors } = statusPlugin.process(emptyAst);

      // Assert
      expect(data).toBeNull();
      expect(errors).toEqual(expectedErrors);
      // It should call validate with an empty object if the section is missing
      expect(mockValidator.validate).toHaveBeenCalledWith({}, '1.2', 'task');
    });

    it('should correctly parse and convert numeric values', () => {
      // Arrange
      const mockAst = createMockDocumentAst(['Progress: 50', 'Planning Estimate: 8']);
      const expectedData = {
        progress: 50,
        planningEstimate: 8,
      };
      mockValidator.validate.mockReturnValue([]);

      // Act
      const { data, errors } = statusPlugin.process(mockAst);

      // Assert
      expect(data).toEqual(expectedData);
      expect(errors).toHaveLength(0);
      expect(mockValidator.validate).toHaveBeenCalledWith(expectedData, '1.2', 'task');
    });
  });

  describe('getTargetPath', () => {
    it('should return the correct target path', () => {
      expect(statusPlugin.getTargetPath()).toBe('meta.status');
    });
  });
});
