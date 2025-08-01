import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchemaValidator } from '../../../doc-parser/schema/schema-validator.js';

// Mock SchemaProvider
vi.mock('../../../doc-parser/schema/schema-provider.js');

describe('SchemaValidator', () => {
  let schemaValidator: SchemaValidator;
  let mockSchemaProvider: any;

  const mockSchema = {
    id: '1.2',
    name: 'Status',
    fields: [
      {
        name: 'Current State',
        type: 'status_key',
        applicability: { task: 'required' },
      },
      {
        name: 'Priority',
        type: 'priority_level',
        applicability: { task: 'required' },
      },
      {
        name: 'Progress',
        type: 'percentage',
        applicability: { task: 'optional' },
      },
    ],
  };

  beforeEach(() => {
    mockSchemaProvider = {
      loadSchema: vi.fn(),
    };
    schemaValidator = new SchemaValidator(mockSchemaProvider);
    mockSchemaProvider.loadSchema.mockReturnValue(mockSchema);
  });

  describe('validate', () => {
    it('should return no errors for valid data', () => {
      const data = {
        currentState: '💡 Not Started',
        priority: '🟥 High',
        progress: 50,
      };
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(0);
    });

    it('should return an error for a missing required field', () => {
      const data = {
        currentState: '💡 Not Started',
      };
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Required field "Priority" is missing.');
    });

    it('should return multiple errors for multiple missing required fields', () => {
      const data = {};
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.message)).toContain('Required field "Current State" is missing.');
      expect(errors.map((e) => e.message)).toContain('Required field "Priority" is missing.');
    });

    it('should not return an error for a missing optional field', () => {
      const data = {
        currentState: '💡 Not Started',
        priority: '🟥 High',
      };
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(0);
    });

    it('should return an error for a field with the wrong type', () => {
      const data = {
        currentState: '💡 Not Started',
        priority: '🟥 High',
        progress: 'fifty', // Invalid type
      };
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Field "Progress" must be a percentage, but received type string.');
    });

    it('should return multiple errors for multiple type mismatches', () => {
      const data = {
        currentState: 123, // Invalid type
        priority: 456, // Invalid type
      };
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(2);
    });

    it('should return a combined list of missing and type errors', () => {
      const data = {
        priority: 123, // Invalid type
      };
      const errors = schemaValidator.validate(data, '1.2', 'task');
      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.message)).toContain('Required field "Current State" is missing.');
      expect(errors.map((e) => e.message)).toContain(
        'Field "Priority" must be a priority_level, but received type number.'
      );
    });

    it('should return no errors if schema has no fields defined', () => {
      mockSchemaProvider.loadSchema.mockReturnValueOnce({ id: '9.9', name: 'Empty', fields: [] });
      const data = { any: 'data' };
      const errors = schemaValidator.validate(data, '9.9', 'task');
      expect(errors).toHaveLength(0);
    });
  });
});
