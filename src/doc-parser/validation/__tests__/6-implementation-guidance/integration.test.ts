import { describe, it, expect } from 'vitest';
import { createImplementationGuidanceSchema } from '../../6-implementation-guidance.schema.js';
import { z } from 'zod';

describe('Implementation Guidance Schema - Integration Tests', () => {
  describe('byId Index Completeness Verification', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all plan sections are registered
      expect(byId['6.1']).toBeDefined(); // Implementation Plan
      expect(byId['6.2']).toBeDefined(); // Prompts

      // Verify task-only sections are not present
      expect(byId['6.1.1']).toBeUndefined(); // Initial Situation (task only)
      expect(byId['6.1.2']).toBeUndefined(); // Files Change Log (task only)

      // Verify no extra sections
      expect(Object.keys(byId)).toHaveLength(2);
      expect(Object.keys(byId).sort()).toEqual(['6.1', '6.2']);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all task sections are registered
      expect(byId['6.1']).toBeDefined(); // Implementation Log/Steps
      expect(byId['6.1.1']).toBeDefined(); // Initial Situation
      expect(byId['6.1.2']).toBeDefined(); // Files Change Log
      expect(byId['6.2']).toBeDefined(); // Prompts

      // Verify no extra sections
      expect(Object.keys(byId)).toHaveLength(4);
      expect(Object.keys(byId).sort()).toEqual(['6.1', '6.1.1', '6.1.2', '6.2']);
    });

    it('should verify byId schemas are actual Zod schemas', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All byId schemas should have safeParse method
      expect(typeof byId['6.1'].safeParse).toBe('function');
      expect(typeof byId['6.2'].safeParse).toBe('function');
    });
  });

  describe('Schema Registration Verification', () => {
    it('should verify all plan sections are properly accessible via byId', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test that each section can validate appropriate data
      const implementationPlanData = [
        'Phase 1: Set up project structure and basic configuration',
        'Phase 2: Implement core validation logic',
        'Phase 3: Add comprehensive test coverage',
      ];

      const promptsData = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];

      // Verify each section validates correctly
      expect(byId['6.1'].safeParse(implementationPlanData).success).toBe(true);
      expect(byId['6.2'].safeParse(promptsData).success).toBe(true);
    });

    it('should verify all task sections are properly accessible via byId', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const implementationLogData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '[x] Implement `ConsoleTransport`.',
        '[ ] Implement `HttpTransport`.',
        '[ ] Write unit tests for transports.',
      ];

      const initialSituationData =
        'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming.';

      const filesChangeLogData =
        'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency.';

      const promptsData = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];

      // Verify each section validates correctly
      expect(byId['6.1'].safeParse(implementationLogData).success).toBe(true);
      expect(byId['6.1.1'].safeParse(initialSituationData).success).toBe(true);
      expect(byId['6.1.2'].safeParse(filesChangeLogData).success).toBe(true);
      expect(byId['6.2'].safeParse(promptsData).success).toBe(true);
    });
  });

  describe('Cross-Family Consistency Verification', () => {
    it('should follow same byId pattern as Family 1 (Meta Governance)', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Family 1 has sections 1.2 and 1.3
      // Family 6 should have sections 6.1 and 6.2 for plan
      // Both should use the same byId pattern
      expect(typeof byId).toBe('object');
      expect(byId).not.toBeNull();
      expect(Object.keys(byId).length).toBeGreaterThan(0);

      // Verify all keys are strings (section IDs)
      Object.keys(byId).forEach((key) => {
        expect(typeof key).toBe('string');
        expect(key).toMatch(/^\d+\.\d+$/); // Format: X.Y
      });
    });

    it('should follow same byId pattern as Family 2 (Business Scope)', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Family 2 has sections 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
      // Family 6 should have sections 6.1 and 6.2 for plan
      // Both should use the same byId pattern
      expect(typeof byId).toBe('object');
      expect(byId).not.toBeNull();
      expect(Object.keys(byId).length).toBeGreaterThan(0);

      // Verify all values are Zod schemas
      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
      });
    });

    it('should follow same byId pattern as Family 3 (Planning & Decomposition)', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Family 3 has sections 3.1, 3.2, 3.3, 3.4
      // Family 6 should have sections 6.1 and 6.2 for plan
      // Both should use the same byId pattern
      expect(typeof byId).toBe('object');
      expect(byId).not.toBeNull();
      expect(Object.keys(byId).length).toBeGreaterThan(0);

      // Verify all values are Zod schemas
      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
      });
    });

    it('should maintain consistent schema structure across document types', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const taskSchema = createImplementationGuidanceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Both should have byId property
      expect(planById).toBeDefined();
      expect(taskById).toBeDefined();

      // Both should be objects
      expect(typeof planById).toBe('object');
      expect(typeof taskById).toBe('object');

      // Task should have more sections than plan
      expect(Object.keys(taskById).length).toBeGreaterThan(Object.keys(planById).length);

      // Shared sections should have same schema type
      expect(typeof planById['6.2'].safeParse).toBe('function');
      expect(typeof taskById['6.2'].safeParse).toBe('function');
    });
  });

  describe('Complete Document Validation', () => {
    it('should validate complete plan document with all sections', () => {
      const planSchema = createImplementationGuidanceSchema('plan');

      const completePlanData = {
        implementationPlan: [
          'Phase 1: Set up project structure and basic configuration',
          'Phase 2: Implement core validation logic',
          'Phase 3: Add comprehensive test coverage',
          'Phase 4: Create integration tests and documentation',
        ],
        promptsLlmReuse: [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
          {
            description: 'Create a Zod schema for user validation:',
            code: 'const UserSchema = z.object({ name: z.string(), email: z.string().email() });',
            language: 'typescript',
          },
        ],
      };

      const result = planSchema.safeParse(completePlanData);
      expect(result.success).toBe(true);
    });

    it('should validate complete task document with all sections', () => {
      const taskSchema = createImplementationGuidanceSchema('task');

      const completeTaskData = {
        implementationLogSteps: [
          '[x] Create `logger/types.ts` with core interfaces.',
          '[x] Implement `ConsoleTransport`.',
          '[ ] Implement `HttpTransport`.',
          '[ ] Write unit tests for transports.',
        ],
        initialSituation:
          'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming. We need to implement an automated validation system using Zod schemas.',
        filesChangeLog:
          'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency. Updated: README.md with usage examples.',
        promptsLlmReuse: [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ],
      };

      const result = taskSchema.safeParse(completeTaskData);
      expect(result.success).toBe(true);
    });

    it('should reject plan document with missing required sections', () => {
      const planSchema = createImplementationGuidanceSchema('plan');

      const incompletePlanData = {
        // Missing implementationPlan (required)
        promptsLlmReuse: [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ],
      };

      const result = planSchema.safeParse(incompletePlanData);
      expect(result.success).toBe(false);
    });

    it('should reject task document with missing required sections', () => {
      const taskSchema = createImplementationGuidanceSchema('task');

      const incompleteTaskData = {
        implementationLogSteps: [
          '[x] Create `logger/types.ts` with core interfaces.',
          '[x] Implement `ConsoleTransport`.',
        ],
        // Missing initialSituation (required)
        // Missing filesChangeLog (required)
        promptsLlmReuse: [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ],
      };

      const result = taskSchema.safeParse(incompleteTaskData);
      expect(result.success).toBe(false);
    });
  });

  describe('Schema Factory Pattern Consistency', () => {
    it('should use consistent factory pattern across all sections', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All sections should be created using the same factory pattern
      // Each section should be a Zod schema with safeParse method
      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
        expect(typeof schema.refine).toBe('function');
      });
    });

    it('should maintain consistent error handling across sections', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test error handling consistency
      const invalidData = {};

      Object.entries(byId).forEach(([sectionId, schema]) => {
        const result = schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeDefined();
          expect(Array.isArray(result.error.issues)).toBe(true);
        }
      });
    });
  });
});
