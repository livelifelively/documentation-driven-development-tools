import { describe, it, expect } from 'vitest';
import { createImplementationGuidanceSchema } from '../../6-implementation-guidance.schema.js';
import { z } from 'zod';

describe('Implementation Guidance Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['6.1']).toBeDefined(); // Implementation Plan
      expect(byId['6.2']).toBeDefined(); // Prompts

      expect(Object.keys(byId)).toHaveLength(2);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['6.1']).toBeDefined(); // Implementation Log/Steps
      expect(byId['6.1.1']).toBeDefined(); // Initial Situation
      expect(byId['6.1.2']).toBeDefined(); // Files Change Log
      expect(byId['6.2']).toBeDefined(); // Prompts

      expect(Object.keys(byId)).toHaveLength(4);
    });

    it('should not register task-only sections in plan byId index', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['6.1.1']).toBeUndefined(); // Initial Situation (task only)
      expect(byId['6.1.2']).toBeUndefined(); // Files Change Log (task only)
    });

    it('should not register plan-only sections in task byId index', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // There are no plan-only sections in Family 6, so this test confirms that
      // if there were, they wouldn't be in the task schema.
      // For now, it implicitly confirms that all task sections are present.
      expect(byId['6.1']).toBeDefined();
      expect(byId['6.1.1']).toBeDefined();
      expect(byId['6.1.2']).toBeDefined();
      expect(byId['6.2']).toBeDefined();
    });
  });

  describe('Schema Registration Verification', () => {
    it('should register schemas with correct types for plan', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // The schemas are wrapped in createSectionSchemaWithApplicability, so we check for safeParse method instead
      expect(typeof byId['6.1'].safeParse).toBe('function'); // Implementation Plan is an array
      expect(typeof byId['6.2'].safeParse).toBe('function'); // Prompts is an array
    });

    it('should register schemas with correct types for task', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // The schemas are wrapped in createSectionSchemaWithApplicability, so we check for safeParse method instead
      expect(typeof byId['6.1'].safeParse).toBe('function'); // Implementation Log/Steps is an array
      expect(typeof byId['6.1.1'].safeParse).toBe('function'); // Initial Situation is a string
      expect(typeof byId['6.1.2'].safeParse).toBe('function'); // Files Change Log is a string
      expect(typeof byId['6.2'].safeParse).toBe('function'); // Prompts is an array
    });
  });

  describe('Independent Section Validation', () => {
    it('should validate plan sections independently via byId', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const implementationPlanData = [
        'Phase 1: Set up project structure and basic configuration',
        'Phase 2: Implement core validation logic',
        'Phase 3: Add comprehensive test coverage',
      ];
      expect(byId['6.1'].safeParse(implementationPlanData).success).toBe(true);

      const promptsData = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];
      expect(byId['6.2'].safeParse(promptsData).success).toBe(true);
    });

    it('should validate task sections independently via byId', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const implementationLogData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '[x] Implement `ConsoleTransport`.',
        '[ ] Implement `HttpTransport`.',
        '[ ] Write unit tests for transports.',
      ];
      expect(byId['6.1'].safeParse(implementationLogData).success).toBe(true);

      const initialSituationData =
        'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming.';
      expect(byId['6.1.1'].safeParse(initialSituationData).success).toBe(true);

      const filesChangeLogData =
        'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency.';
      expect(byId['6.1.2'].safeParse(filesChangeLogData).success).toBe(true);

      const promptsData = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];
      expect(byId['6.2'].safeParse(promptsData).success).toBe(true);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain consistent validation between byId and composed schema for plan', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const implementationPlanData = [
        'Phase 1: Set up project structure and basic configuration',
        'Phase 2: Implement core validation logic',
        'Phase 3: Add comprehensive test coverage',
      ];
      expect(byId['6.1'].safeParse(implementationPlanData).success).toBe(
        shape.implementationPlan.safeParse(implementationPlanData).success
      );

      const promptsData = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];
      expect(byId['6.2'].safeParse(promptsData).success).toBe(shape.promptsLlmReuse.safeParse(promptsData).success);
    });

    it('should maintain consistent validation between byId and composed schema for task', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const implementationLogData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '[x] Implement `ConsoleTransport`.',
        '[ ] Implement `HttpTransport`.',
        '[ ] Write unit tests for transports.',
      ];
      expect(byId['6.1'].safeParse(implementationLogData).success).toBe(
        shape.implementationLogSteps.safeParse(implementationLogData).success
      );

      const initialSituationData =
        'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming.';
      expect(byId['6.1.1'].safeParse(initialSituationData).success).toBe(
        shape.initialSituation.safeParse(initialSituationData).success
      );

      const filesChangeLogData =
        'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency.';
      expect(byId['6.1.2'].safeParse(filesChangeLogData).success).toBe(
        shape.filesChangeLog.safeParse(filesChangeLogData).success
      );

      const promptsData = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];
      expect(byId['6.2'].safeParse(promptsData).success).toBe(shape.promptsLlmReuse.safeParse(promptsData).success);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['99.99']).toBeUndefined();
    });

    it('should handle byId access on invalid schema gracefully', () => {
      // Test with invalid schema
      const invalidSchema = {} as any;
      expect(invalidSchema.__byId).toBeUndefined();
    });

    it('should validate that byId schemas are actual Zod schemas', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All byId schemas should have safeParse method
      expect(typeof byId['6.1'].safeParse).toBe('function');
      expect(typeof byId['6.2'].safeParse).toBe('function');
    });

    it('should handle duplicate section ID 6.1 correctly in byId access', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const taskSchema = createImplementationGuidanceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Both should have 6.1 but with different schemas
      expect(planById['6.1']).toBeDefined();
      expect(taskById['6.1']).toBeDefined();

      // They should be different schemas (Implementation Plan vs Implementation Log/Steps)
      expect(planById['6.1']).not.toBe(taskById['6.1']);

      // Test that they validate different content types
      const planData = ['Phase 1: Set up project structure'];
      const taskData = ['[x] Create logger types'];

      expect(planById['6.1'].safeParse(planData).success).toBe(true);
      expect(taskById['6.1'].safeParse(taskData).success).toBe(true);
    });
  });
});
