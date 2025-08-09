import { describe, it, expect } from 'vitest';
import {
  DocumentType,
  Applicability,
  getApplicability,
  isApplicable,
  loadSchemaDefinition,
  loadAllSchemaDefinitions,
  getFamilyConfig,
  DEFAULT_SCHEMA_LOADING_CONFIG,
  DEFAULT_SCHEMA_FAMILIES,
  SchemaLoadingConfig,
  SchemaFamilyConfig,
} from '../shared.schema';
import { z } from 'zod';
import { applyApplicability, applyFieldLevelApplicability } from '../shared.schema';

describe('Shared Schema Utilities', () => {
  describe('DocumentType enum', () => {
    it('should have correct values', () => {
      expect(DocumentType.enum.plan).toBe('plan');
      expect(DocumentType.enum.task).toBe('task');
    });

    it('should parse valid document types', () => {
      expect(DocumentType.parse('plan')).toBe('plan');
      expect(DocumentType.parse('task')).toBe('task');
    });

    it('should reject invalid document types', () => {
      expect(() => DocumentType.parse('invalid')).toThrow();
    });
  });

  describe('Applicability enum', () => {
    it('should have correct values', () => {
      expect(Applicability.enum.required).toBe('required');
      expect(Applicability.enum.optional).toBe('optional');
      expect(Applicability.enum.omitted).toBe('omitted');
    });

    it('should parse valid applicability values', () => {
      expect(Applicability.parse('required')).toBe('required');
      expect(Applicability.parse('optional')).toBe('optional');
      expect(Applicability.parse('omitted')).toBe('omitted');
    });

    it('should reject invalid applicability values', () => {
      expect(() => Applicability.parse('invalid')).toThrow();
    });
  });

  describe('Default Configuration', () => {
    it('should have correct default schema families', () => {
      expect(DEFAULT_SCHEMA_FAMILIES).toHaveLength(8);
      expect(DEFAULT_SCHEMA_FAMILIES[0]).toEqual({
        id: 1,
        name: 'meta',
        jsonFileName: '1-meta.json',
      });
      expect(DEFAULT_SCHEMA_FAMILIES[7]).toEqual({
        id: 8,
        name: 'reference',
        jsonFileName: '8-reference.json',
      });
    });

    it('should have correct default loading configuration', () => {
      expect(DEFAULT_SCHEMA_LOADING_CONFIG.schemaDirectory).toBe('../../schema/ddd-schema-json');
      expect(DEFAULT_SCHEMA_LOADING_CONFIG.families).toBe(DEFAULT_SCHEMA_FAMILIES);
    });
  });

  describe('getFamilyConfig', () => {
    it('should return family config for valid ID with default config', () => {
      const config = getFamilyConfig(1);
      expect(config).toEqual({
        id: 1,
        name: 'meta',
        jsonFileName: '1-meta.json',
      });
    });

    it('should return family config for valid ID with custom config', () => {
      const customConfig: SchemaLoadingConfig = {
        schemaDirectory: '/custom/path',
        families: [{ id: 1, name: 'custom-meta', jsonFileName: 'custom-1.json' }],
      };
      const config = getFamilyConfig(1, customConfig);
      expect(config).toEqual({
        id: 1,
        name: 'custom-meta',
        jsonFileName: 'custom-1.json',
      });
    });

    it('should throw error for invalid family ID', () => {
      expect(() => getFamilyConfig(999)).toThrow('Unknown family ID: 999');
    });
  });

  describe('getApplicability', () => {
    it('should return required for required sections and fields', () => {
      const applicability = { plan: 'required', task: 'required' };
      expect(getApplicability(applicability, 'plan')).toBe('required');
      expect(getApplicability(applicability, 'task')).toBe('required');
    });

    it('should return optional for optional sections and fields', () => {
      const applicability = { plan: 'optional', task: 'required' };
      expect(getApplicability(applicability, 'plan')).toBe('optional');
      expect(getApplicability(applicability, 'task')).toBe('required');
    });

    it('should return omitted for omitted sections and fields', () => {
      const applicability = { plan: 'omitted', task: 'required' };
      expect(getApplicability(applicability, 'plan')).toBe('omitted');
      expect(getApplicability(applicability, 'task')).toBe('required');
    });
  });

  describe('isApplicable', () => {
    it('should return true for required sections and fields', () => {
      const applicability = { plan: 'required', task: 'required' };
      expect(isApplicable(applicability, 'plan')).toBe(true);
      expect(isApplicable(applicability, 'task')).toBe(true);
    });

    it('should return true for optional sections and fields', () => {
      const applicability = { plan: 'optional', task: 'required' };
      expect(isApplicable(applicability, 'plan')).toBe(true);
      expect(isApplicable(applicability, 'task')).toBe(true);
    });

    it('should return false for omitted sections and fields', () => {
      const applicability = { plan: 'omitted', task: 'required' };
      expect(isApplicable(applicability, 'plan')).toBe(false);
      expect(isApplicable(applicability, 'task')).toBe(true);
    });
  });

  describe('loadSchemaDefinition', () => {
    it('should load a valid schema definition with default config', async () => {
      const definition = await loadSchemaDefinition(1);
      expect(definition).toBeDefined();
      expect(definition.id).toBe(1);
      expect(definition.name).toBe('Meta & Governance');
      expect(definition.applicability).toBeDefined();
      expect(definition.sections).toBeDefined();
    });

    it('should throw error for invalid family ID', async () => {
      await expect(loadSchemaDefinition(999)).rejects.toThrow('Failed to load schema definition for family 999');
    });
  });

  describe('loadAllSchemaDefinitions', () => {
    it('should load all schema definitions with default config', async () => {
      const definitions = await loadAllSchemaDefinitions();
      expect(definitions).toBeDefined();
      expect(Array.isArray(definitions)).toBe(true);
      expect(definitions.length).toBeGreaterThan(0);

      // Check that we have the expected families
      const familyIds = definitions.map((d) => d.id).sort();
      expect(familyIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should load schema definitions with custom config', async () => {
      const customConfig: SchemaLoadingConfig = {
        schemaDirectory: '../../schema/ddd-schema-json',
        families: [
          { id: 1, name: 'meta', jsonFileName: '1-meta.json' },
          { id: 2, name: 'business-scope', jsonFileName: '2-business-scope.json' },
        ],
      };
      const definitions = await loadAllSchemaDefinitions(customConfig);
      expect(definitions).toBeDefined();
      expect(Array.isArray(definitions)).toBe(true);
      expect(definitions.length).toBeGreaterThan(0);

      // Check that we have the expected families from custom config
      const familyIds = definitions.map((d) => d.id).sort();
      expect(familyIds).toEqual([1, 2]);
    });
  });

  describe('applyApplicability', () => {
    const testSchema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
    });

    it('should return schema as-is for required applicability', () => {
      const rules = { plan: 'required', task: 'required' };
      const result = applyApplicability(testSchema, rules, 'plan');

      // Should be able to parse valid data
      const validData = { name: 'John', age: 30, email: 'john@example.com' };
      expect(() => result!.parse(validData)).not.toThrow();

      // Should reject missing required fields
      const invalidData = { name: 'John', age: 30 };
      expect(() => result!.parse(invalidData)).toThrow();
    });

    it('should make entire section optional for optional applicability', () => {
      const rules = { plan: 'optional', task: 'required' };
      const result = applyApplicability(testSchema, rules, 'plan');

      // Should accept undefined (entire section optional)
      expect(() => result!.parse(undefined)).not.toThrow();

      // Should accept complete data (section present and valid)
      const completeData = { name: 'John', age: 30, email: 'john@example.com' };
      expect(() => result!.parse(completeData)).not.toThrow();

      // Should reject partial data (section present but invalid)
      const partialData = { name: 'John' };
      expect(() => result!.parse(partialData)).toThrow();

      // Should reject empty object (section present but invalid)
      expect(() => result!.parse({})).toThrow();
    });

    it('should return null for omitted applicability', () => {
      const rules = { plan: 'omitted', task: 'required' };
      const result = applyApplicability(testSchema, rules, 'plan');

      // Should return null to indicate section should be omitted
      expect(result).toBeNull();
    });

    it('should throw error for invalid applicability value', () => {
      const rules = { plan: 'invalid', task: 'required' };
      expect(() => applyApplicability(testSchema, rules, 'plan')).toThrow('Invalid applicability value: invalid');
    });
  });

  describe('applyFieldLevelApplicability', () => {
    const testSchema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
      phone: z.string().optional(),
    });

    it('should apply field-level rules correctly', () => {
      const fieldRules = {
        name: { plan: 'required', task: 'required' },
        age: { plan: 'optional', task: 'required' },
        email: { plan: 'omitted', task: 'required' },
        phone: { plan: 'optional', task: 'optional' },
      };

      const result = applyFieldLevelApplicability(testSchema, fieldRules, 'plan');

      // name should be required
      expect(() => result.parse({ name: 'John' })).not.toThrow();
      expect(() => result.parse({})).toThrow();

      // age should be optional
      expect(() => result.parse({ name: 'John' })).not.toThrow();
      expect(() => result.parse({ name: 'John', age: 30 })).not.toThrow();

      // email should be omitted
      const dataWithEmail = { name: 'John', email: 'john@example.com' };
      expect(() => result.parse(dataWithEmail)).toThrow();

      // phone should be optional
      expect(() => result.parse({ name: 'John' })).not.toThrow();
      expect(() => result.parse({ name: 'John', phone: '123-456-7890' })).not.toThrow();
    });

    it('should keep fields as-is when no rule is specified', () => {
      const fieldRules = {
        name: { plan: 'required', task: 'required' },
        // age and email have no rules specified
      };

      const result = applyFieldLevelApplicability(testSchema, fieldRules, 'plan');

      // Should keep all fields as they were in original schema
      const validData = { name: 'John', age: 30, email: 'john@example.com' };
      expect(() => result.parse(validData)).not.toThrow();
    });

    it('should handle task-specific rules', () => {
      const fieldRules = {
        name: { plan: 'required', task: 'required' },
        age: { plan: 'optional', task: 'required' },
        email: { plan: 'omitted', task: 'required' },
      };

      const result = applyFieldLevelApplicability(testSchema, fieldRules, 'task');

      // For task, age should be required, email should be required
      expect(() => result.parse({ name: 'John', age: 30, email: 'john@example.com' })).not.toThrow();
      expect(() => result.parse({ name: 'John', age: 30 })).toThrow(); // missing email
    });

    it('should throw error for invalid field applicability', () => {
      const fieldRules = {
        name: { plan: 'invalid', task: 'required' },
      };

      expect(() => applyFieldLevelApplicability(testSchema, fieldRules, 'plan')).toThrow(
        'Invalid applicability value for field name: invalid'
      );
    });
  });
});
