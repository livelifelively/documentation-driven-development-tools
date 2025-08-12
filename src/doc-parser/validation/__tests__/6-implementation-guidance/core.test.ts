import { describe, it, expect } from 'vitest';
import { createImplementationGuidanceSchema } from '../../6-implementation-guidance.schema.js';
import { z } from 'zod';

describe('Implementation Guidance Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createImplementationGuidanceSchema', () => {
      it('should create plan schema with byId registration', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Verify byId registration
        expect(byId['6.1']).toBeDefined(); // Implementation Plan
        expect(byId['6.2']).toBeDefined(); // Prompts

        // Task-only sections should not be present
        expect(byId['6.1.1']).toBeUndefined(); // Initial Situation (task only)
        expect(byId['6.1.2']).toBeUndefined(); // Files Change Log (task only)

        // Verify schema structure
        const shape = planSchema.shape as any;
        expect(shape.implementationPlan).toBeDefined();
        expect(shape.promptsLlmReuse).toBeDefined();
      });

      it('should create task schema with byId registration', () => {
        const taskSchema = createImplementationGuidanceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Verify byId registration
        expect(byId['6.1']).toBeDefined(); // Implementation Log/Steps
        expect(byId['6.1.1']).toBeDefined(); // Initial Situation
        expect(byId['6.1.2']).toBeDefined(); // Files Change Log
        expect(byId['6.2']).toBeDefined(); // Prompts

        // Verify schema structure
        const shape = taskSchema.shape as any;
        expect(shape.implementationLogSteps).toBeDefined();
        expect(shape.initialSituation).toBeDefined();
        expect(shape.filesChangeLog).toBeDefined();
        expect(shape.promptsLlmReuse).toBeDefined();
      });

      it('should validate complete plan document', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const validPlanData = {
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
          ],
        };

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const taskSchema = createImplementationGuidanceSchema('task');
        const validTaskData = {
          implementationLogSteps: [
            '[x] Create `logger/types.ts` with core interfaces.',
            '[x] Implement `ConsoleTransport`.',
            '[ ] Implement `HttpTransport`.',
            '[ ] Write unit tests for transports.',
          ],
          initialSituation:
            'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming.',
          filesChangeLog:
            'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency.',
          promptsLlmReuse: [
            {
              description: 'Generate a Vitest test for this function:',
              code: 'export const add = (a: number, b: number): number => a + b;',
              language: 'typescript',
            },
          ],
        };

        const result = taskSchema.safeParse(validTaskData);
        expect(result.success).toBe(true);
      });

      describe('Convenience Functions', () => {
        it('should create plan schema via convenience function', () => {
          const planSchema = createImplementationGuidanceSchema('plan');
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          expect(byId['6.1']).toBeDefined();
          expect(byId['6.2']).toBeDefined();
        });

        it('should create task schema via convenience function', () => {
          const taskSchema = createImplementationGuidanceSchema('task');
          const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          expect(byId['6.1']).toBeDefined();
          expect(byId['6.1.1']).toBeDefined();
          expect(byId['6.1.2']).toBeDefined();
          expect(byId['6.2']).toBeDefined();
        });
      });
    });

    describe('byId Index Verification', () => {
      it('should allow independent section validation via byId', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Test implementation plan validation via byId
        const implementationPlanData = [
          'Phase 1: Set up project structure and basic configuration',
          'Phase 2: Implement core validation logic',
          'Phase 3: Add comprehensive test coverage',
        ];

        const result = byId['6.1'].safeParse(implementationPlanData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid data via byId', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Test implementation plan validation with invalid data
        const invalidImplementationPlanData = [
          'Phase 1: Set up project structure and basic configuration',
          '', // Invalid empty string
          'Phase 3: Add comprehensive test coverage',
        ];

        const result = byId['6.1'].safeParse(invalidImplementationPlanData);
        expect(result.success).toBe(false);
      });
    });
  });
});
