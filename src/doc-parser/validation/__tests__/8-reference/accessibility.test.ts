import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createReferenceSchema } from '../../8-reference.schema.js';

describe('Reference Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan should have section 8.1
      expect(byId['8.1']).toBeDefined(); // Appendices/Glossary

      expect(Object.keys(byId)).toHaveLength(1);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createReferenceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Task should have section 8.1
      expect(byId['8.1']).toBeDefined(); // Appendices/Glossary

      expect(Object.keys(byId)).toHaveLength(1);
    });

    it('should have same sections in plan and task byId index', () => {
      const planSchema = createReferenceSchema('plan');
      const taskSchema = createReferenceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Both should have the same sections (only one section in this family)
      expect(Object.keys(planById)).toEqual(Object.keys(taskById));
      expect(Object.keys(planById)).toHaveLength(1);
    });
  });

  describe('Schema Registration Verification', () => {
    it('should register schemas with correct types for plan', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Section 8.1 should be a ZodOptional (since it's marked as optional in JSON)
      expect(byId['8.1']).toBeDefined();
      expect(byId['8.1'].constructor.name).toBe('ZodOptional');

      // The underlying schema should be a ZodObject
      const underlyingSchema = (byId['8.1'] as any)._def.innerType;
      expect(underlyingSchema.constructor.name).toBe('ZodObject');
    });

    it('should register schemas with correct types for task', () => {
      const taskSchema = createReferenceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Section 8.1 should be a ZodOptional (since it's marked as optional in JSON)
      expect(byId['8.1']).toBeDefined();
      expect(byId['8.1'].constructor.name).toBe('ZodOptional');

      // The underlying schema should be a ZodObject
      const underlyingSchema = (byId['8.1'] as any)._def.innerType;
      expect(underlyingSchema.constructor.name).toBe('ZodObject');
    });

    it('should have consistent schema types between plan and task', () => {
      const planSchema = createReferenceSchema('plan');
      const taskSchema = createReferenceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Both should have the same schema types
      expect(planById['8.1'].constructor.name).toBe(taskById['8.1'].constructor.name);

      const planUnderlying = (planById['8.1'] as any)._def.innerType;
      const taskUnderlying = (taskById['8.1'] as any)._def.innerType;
      expect(planUnderlying.constructor.name).toBe(taskUnderlying.constructor.name);
    });
  });

  describe('Independent Section Validation', () => {
    it('should allow independent validation of plan sections via byId', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const validGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = byId['8.1'].safeParse(validGlossary);
      expect(result.success).toBe(true);
    });

    it('should allow independent validation of task sections via byId', () => {
      const taskSchema = createReferenceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const validAppendices = {
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation.',
          },
        ],
      };

      const result = byId['8.1'].safeParse(validAppendices);
      expect(result.success).toBe(true);
    });

    it('should reject invalid data via independent validation', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidData = {
        glossary: [
          {
            term: '', // Empty string not allowed
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = byId['8.1'].safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should have consistent validation between byId and composed schema for plan', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const byIdResult = byId['8.1'].safeParse(validData);
      const composedResult = shape.appendicesGlossary.safeParse(validData);

      expect(byIdResult.success).toBe(composedResult.success);
    });

    it('should have consistent validation between byId and composed schema for task', () => {
      const taskSchema = createReferenceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validData = {
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation.',
          },
        ],
      };

      const byIdResult = byId['8.1'].safeParse(validData);
      const composedResult = shape.appendicesGlossary.safeParse(validData);

      expect(byIdResult.success).toBe(composedResult.success);
    });

    it('should have consistent error handling between byId and composed schema', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = {
        glossary: [],
        appendices: [],
      };

      const byIdResult = byId['8.1'].safeParse(invalidData);
      const composedResult = shape.appendicesGlossary.safeParse(invalidData);

      expect(byIdResult.success).toBe(composedResult.success);
      expect(byIdResult.success).toBe(false);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Non-existent section should be undefined
      expect(byId['8.2']).toBeUndefined();
      expect(byId['9.1']).toBeUndefined();
    });

    it('should validate byId schemas are actual Zod schemas', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Section 8.1 should be a valid Zod schema
      expect(byId['8.1']).toBeDefined();
      expect(typeof byId['8.1'].safeParse).toBe('function');
      expect(typeof byId['8.1'].parse).toBe('function');
    });

    it('should handle optional section validation correctly', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Optional section should accept undefined
      const result = byId['8.1'].safeParse(undefined);
      expect(result.success).toBe(true);
    });
  });
});

