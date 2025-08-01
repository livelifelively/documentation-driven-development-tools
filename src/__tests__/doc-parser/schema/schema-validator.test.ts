import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchemaValidator } from '../../../doc-parser/schema/schema-validator.js';
import { SchemaProvider } from '../../../doc-parser/schema/schema-provider.js';
import { LintingError } from '../../../doc-parser/plugin.types.js';
import { Root } from 'mdast';

// Mock SchemaProvider
vi.mock('../../../doc-parser/schema/schema-provider.js', () => ({
  SchemaProvider: vi.fn().mockImplementation(() => ({
    loadSchema: vi.fn(),
  })),
}));

describe('SchemaValidator', () => {
  let schemaValidator: SchemaValidator;
  let mockSchemaProvider: any;

  beforeEach(() => {
    mockSchemaProvider = {
      loadSchema: vi.fn(),
    };
    schemaValidator = new SchemaValidator(mockSchemaProvider);
  });

  describe('validateRequiredFields', () => {
    it('should return no errors when all required fields are present', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Priority',
                type: 'priority_level',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
          },
          {
            type: 'list',
            children: [
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Current State:** 💡 Not Started' }],
              },
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Priority:** 🟥 High' }],
              },
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Progress:** 0%' }],
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateRequiredFields(mockAstNode, '1.2', 'task');

      // Assert
      expect(errors).toEqual([]);
      expect(mockSchemaProvider.loadSchema).toHaveBeenCalledWith('1.2');
    });

    it('should return errors when required fields are missing', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Priority',
                type: 'priority_level',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
          },
          {
            type: 'list',
            children: [
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Current State:** 💡 Not Started' }],
              },
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Priority:** 🟥 High' }],
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateRequiredFields(mockAstNode, '1.2', 'task');

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        section: '1.2 Status',
        message: 'Required field "Progress" is missing',
      });
    });

    it('should return multiple errors when multiple required fields are missing', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Priority',
                type: 'priority_level',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Planning Estimate',
                type: 'number',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
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
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateRequiredFields(mockAstNode, '1-meta', 'task');

      // Assert
      expect(errors).toHaveLength(3);
      expect(errors.map((e) => e.message)).toEqual([
        'Required field "Priority" is missing',
        'Required field "Progress" is missing',
        'Required field "Planning Estimate" is missing',
      ]);
    });

    it('should handle empty AST node content', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Priority',
                type: 'priority_level',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateRequiredFields(mockAstNode, '1-meta', 'task');

      // Assert
      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.message)).toEqual([
        'Required field "Current State" is missing',
        'Required field "Priority" is missing',
      ]);
    });

    it('should handle schema with no required fields', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'omitted' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateRequiredFields(mockAstNode, '1-meta', 'task');

      // Assert
      expect(errors).toEqual([]);
    });
  });

  describe('validateFieldType', () => {
    it('should return no errors when field value matches expected type', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateFieldType('Progress', '50', '1-meta');

      // Assert
      expect(errors).toEqual([]);
    });

    it('should return error when field value does not match expected type', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors1 = schemaValidator.validateFieldType('Progress', '50', '1-meta');
      const errors2 = schemaValidator.validateFieldType('Progress', 'invalid', '1-meta');

      // Assert
      expect(errors1).toEqual([]);
      expect(errors2).toHaveLength(1);
      expect(errors2[0]).toEqual({
        section: '1.2 Status',
        message: 'Field "Progress" must be a percentage, got "invalid"',
      });
    });

    it('should handle boolean field types', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Is Active',
                type: 'boolean',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors1 = schemaValidator.validateFieldType('Is Active', 'true', '1-meta');
      const errors2 = schemaValidator.validateFieldType('Is Active', 'false', '1-meta');
      const errors3 = schemaValidator.validateFieldType('Is Active', 'invalid', '1-meta');

      // Assert
      expect(errors1).toEqual([]);
      expect(errors2).toEqual([]);
      expect(errors3).toHaveLength(1);
      expect(errors3[0].message).toContain('must be a boolean');
    });

    it('should handle unknown field types gracefully', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Custom Field',
                type: 'unknown_type',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateFieldType('Custom Field', 'any value', '1-meta');

      // Assert
      expect(errors).toEqual([]);
    });

    it('should handle fields not defined in schema', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateFieldType('NonExistentField', 'value', '1-meta');

      // Assert
      expect(errors).toEqual([]);
    });
  });

  describe('validateSection', () => {
    it('should validate both required fields and field types', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
          },
          {
            type: 'list',
            children: [
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Current State:** 💡 Not Started' }],
              },
              {
                type: 'listItem',
                children: [{ type: 'text', value: '**Progress:** invalid' }],
              },
            ],
          },
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateSection(mockAstNode, '1-meta', 'task');

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        section: '1.2 Status',
        message: 'Field "Progress" must be a percentage, got "invalid"',
      });
    });

    it('should return multiple errors for multiple validation failures', () => {
      // Arrange
      const mockSchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [
              {
                name: 'Current State',
                type: 'status_key',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Priority',
                type: 'priority_level',
                applicability: { plan: 'omitted', task: 'required' },
              },
              {
                name: 'Progress',
                type: 'percentage',
                applicability: { plan: 'omitted', task: 'required' },
              },
            ],
          },
        ],
      };

      const mockAstNode: Root = {
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'Status' }],
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
        ],
      };

      mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);

      // Act
      const errors = schemaValidator.validateSection(mockAstNode, '1-meta', 'task');

      // Assert
      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.message)).toEqual([
        'Required field "Priority" is missing',
        'Required field "Progress" is missing',
      ]);
    });
  });
});
