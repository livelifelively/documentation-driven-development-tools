import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedPlanSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.4'];

      expectedPlanSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      expect(Object.keys(byId).length).toBe(expectedPlanSections.length);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedTaskSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.5'];

      expectedTaskSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      expect(Object.keys(byId).length).toBe(expectedTaskSections.length);
    });

    it('should not register task-only sections in plan byId index', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['7.5']).toBeUndefined(); // Local Test Commands (task-only)
    });

    it('should not register plan-only sections in task byId index', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['7.4']).toBeUndefined(); // Deployment Steps (plan-only)
    });
  });

  describe('Schema Registration Verification', () => {
    it('should register schemas with correct types for plan', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should be object schemas
      expect(byId['7.1']).toBeInstanceOf(z.ZodObject);
      expect(byId['7.3']).toBeInstanceOf(z.ZodObject);

      // Table sections should be array schemas
      expect(byId['7.1.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.1.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.1']).toBeInstanceOf(z.ZodArray);

      // Array sections should be array schemas
      expect(byId['7.3.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.3']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.4']).toBeInstanceOf(z.ZodArray);
    });

    it('should register schemas with correct types for task', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should be object schemas
      expect(byId['7.1']).toBeInstanceOf(z.ZodObject);
      expect(byId['7.3']).toBeInstanceOf(z.ZodObject);

      // Table sections should be array schemas
      expect(byId['7.1.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.1.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.1']).toBeInstanceOf(z.ZodArray);

      // Array sections should be array schemas
      expect(byId['7.3.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.3']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.5']).toBeInstanceOf(z.ZodArray);
    });
  });

  describe('Independent Section Validation', () => {
    it('should validate plan sections independently via byId', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test container section
      expect(byId['7.1'].safeParse({}).success).toBe(true);
      expect(byId['7.3'].safeParse({}).success).toBe(true);

      // Test table section
      const validTable = [
        {
          id: 'TEST-01',
          scenario: 'Unit test for parser',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];
      expect(byId['7.1.1'].safeParse(validTable).success).toBe(true);

      // Test array section
      const validArray = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        'Git Hooks: Block commits and display validation errors to user',
      ];
      expect(byId['7.3.2'].safeParse(validArray).success).toBe(true);
    });

    it('should validate task sections independently via byId', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test container section
      expect(byId['7.1'].safeParse({}).success).toBe(true);
      expect(byId['7.3'].safeParse({}).success).toBe(true);

      // Test table section
      const validTable = [
        {
          id: 'TEST-01',
          scenario: 'Unit test for parser',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];
      expect(byId['7.1.1'].safeParse(validTable).success).toBe(true);

      // Test array section
      const validArray = ['npm test', 'npm run test:watch', 'npm run test:coverage'];
      expect(byId['7.5'].safeParse(validArray).success).toBe(true);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain consistent validation between byId and composed schema for plan', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validTable = [
        {
          id: 'TEST-01',
          scenario: 'Unit test for parser',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      const byIdResult = byId['7.1.1'].safeParse(validTable);
      const composedResult = shape.unitIntegrationTests.safeParse(validTable);

      expect(byIdResult.success).toBe(composedResult.success);
    });

    it('should maintain consistent validation between byId and composed schema for task', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validArray = ['npm test', 'npm run test:watch', 'npm run test:coverage'];

      const byIdResult = byId['7.5'].safeParse(validArray);
      const composedResult = shape.localTestCommands.safeParse(validArray);

      expect(byIdResult.success).toBe(composedResult.success);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['7.999']).toBeUndefined();
      expect(byId['invalid']).toBeUndefined();
    });

    it('should handle byId access on invalid schema gracefully', () => {
      const invalidSchema = {} as any;

      expect(invalidSchema.__byId).toBeUndefined();
    });

    it('should validate that byId schemas are actual Zod schemas', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
        expect(typeof schema.refine).toBe('function');
      });
    });

    it('should handle container sections correctly in byId access', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should accept empty objects
      expect(byId['7.1'].safeParse({}).success).toBe(true);
      expect(byId['7.3'].safeParse({}).success).toBe(true);

      // Container sections should accept any object (they are containers)
      expect(byId['7.1'].safeParse({ someField: 'value' }).success).toBe(true);
      expect(byId['7.3'].safeParse({ someField: 'value' }).success).toBe(true);
    });
  });
});
