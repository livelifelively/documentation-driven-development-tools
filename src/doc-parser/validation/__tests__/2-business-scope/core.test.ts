import { describe, it, expect } from 'vitest';
import {
  createBusinessScopeSchema,
  getBusinessScopePlanSchema,
  getBusinessScopeTaskSchema,
} from '../../2-business-scope.schema.js';
import { z } from 'zod';

describe('Business & Scope Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createBusinessScopeSchema', () => {
      it('should create plan schema with byId registration', () => {
        const planSchema = createBusinessScopeSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Verify byId index exists and has sections
        expect(byId).toBeDefined();
        expect(Object.keys(byId).length).toBeGreaterThan(0);

        // Verify specific sections are registered
        expect(byId['2.1']).toBeDefined(); // Overview
        expect(byId['2.2']).toBeDefined(); // Business Context
        expect(byId['2.2.1']).toBeDefined(); // User Journeys
        expect(byId['2.2.2']).toBeDefined(); // User Personas
        expect(byId['2.2.3']).toBeDefined(); // Core Business Rules
        expect(byId['2.2.4']).toBeDefined(); // User Stories
        expect(byId['2.3']).toBeDefined(); // Success Criteria
        expect(byId['2.5']).toBeDefined(); // Boundaries and Scope
        expect(byId['2.5.1']).toBeDefined(); // In Scope
        expect(byId['2.5.2']).toBeDefined(); // Out of Scope
        expect(byId['2.6']).toBeDefined(); // Core Business Processes

        // Task-only sections should not be in plan byId
        expect(byId['2.4']).toBeUndefined(); // Definition of Done
      });

      it('should create task schema with byId registration', () => {
        const taskSchema = createBusinessScopeSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Verify byId index exists and has sections
        expect(byId).toBeDefined();
        expect(Object.keys(byId).length).toBeGreaterThan(0);

        // Verify specific sections are registered
        expect(byId['2.1']).toBeDefined(); // Overview
        expect(byId['2.2.3']).toBeDefined(); // Core Business Rules
        expect(byId['2.4']).toBeDefined(); // Definition of Done

        // Plan-only sections should not be in task byId
        expect(byId['2.2']).toBeUndefined(); // Business Context
        expect(byId['2.2.1']).toBeUndefined(); // User Journeys
        expect(byId['2.2.2']).toBeUndefined(); // User Personas
        expect(byId['2.2.4']).toBeUndefined(); // User Stories
        expect(byId['2.3']).toBeUndefined(); // Success Criteria
        expect(byId['2.5']).toBeUndefined(); // Boundaries and Scope
        expect(byId['2.5.1']).toBeUndefined(); // In Scope
        expect(byId['2.5.2']).toBeUndefined(); // Out of Scope
        expect(byId['2.6']).toBeUndefined(); // Core Business Processes
      });

      it('should validate complete plan document', () => {
        const planSchema = createBusinessScopeSchema('plan');
        const validPlanData = {
          overview: {
            coreFunction: 'Implements a robust, multi-level logging system',
            keyCapability: 'Ensures operational errors and business events are captured',
            businessValue: 'Enables proactive issue resolution and performance analysis',
          },
          businessContext: 'Currently, pipeline failures are opaque, requiring developers to manually inspect logs.',
          userJourneys: [
            {
              name: 'Analyst Processes a New Document',
              description: 'This journey describes the end-to-end path for a data analyst',
              diagram: 'graph\nA("Start") --> B["Selects Document"];',
            },
          ],
          userPersonas: [
            {
              persona: 'Data Analyst',
              goal: 'Process documents efficiently and accurately',
            },
          ],
          coreBusinessRules: ['All documents must be validated before processing'],
          userStories: ['As a data analyst, I want to process documents automatically'],
          successCriteria: ['Processing time reduced by 50%'],
          inScope: ['Logging system implementation'],
          outOfScope: ['UI redesign'],
          coreBusinessProcesses: [
            {
              name: 'Document Processing',
              participants: 'Data Analyst, System',
              goal: 'Process documents efficiently',
              workflow: ['Upload document', 'Validate content', 'Process data'],
            },
          ],
        };

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const taskSchema = createBusinessScopeSchema('task');
        const validTaskData = {
          overview: {
            coreFunction: 'Create Zod schemas for document validation',
            keyCapability: 'Produces TypeScript files with Zod schemas',
            businessValue: 'Enables automated validation of documentation content',
          },
          coreBusinessRules: ['All schemas must be properly validated'],
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'All schemas pass validation tests',
            },
            {
              id: 'DoD-2',
              criterion: 'Documentation is updated',
            },
          ],
        };

        const result = taskSchema.safeParse(validTaskData);
        expect(result.success).toBe(true);
      });
    });

    describe('Convenience Functions', () => {
      it('should create plan schema via convenience function', () => {
        const planSchema = getBusinessScopePlanSchema();
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(byId['2.1']).toBeDefined(); // Overview
        expect(byId['2.2']).toBeDefined(); // Business Context
        expect(byId['2.4']).toBeUndefined(); // Definition of Done (task only)
      });

      it('should create task schema via convenience function', () => {
        const taskSchema = getBusinessScopeTaskSchema();
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(byId['2.1']).toBeDefined(); // Overview
        expect(byId['2.4']).toBeDefined(); // Definition of Done
        expect(byId['2.2']).toBeUndefined(); // Business Context (plan only)
      });
    });
  });

  describe('byId Index Verification', () => {
    it('should allow independent section validation via byId', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test Overview section (2.1) independently
      const validOverview = {
        coreFunction: 'Test function',
        keyCapability: 'Test capability',
        businessValue: 'Test value',
      };
      const overviewResult = byId['2.1'].safeParse(validOverview);
      expect(overviewResult.success).toBe(true);

      // Test Business Context section (2.2) independently
      const validBusinessContext = 'This is a valid business context description.';
      const businessContextResult = byId['2.2'].safeParse(validBusinessContext);
      expect(businessContextResult.success).toBe(true);

      // Test User Journeys section (2.2.1) independently
      const validUserJourneys = [
        {
          name: 'Test Journey',
          description: 'Test description',
          diagram: 'graph TD; A-->B;',
        },
      ];
      const userJourneysResult = byId['2.2.1'].safeParse(validUserJourneys);
      expect(userJourneysResult.success).toBe(true);
    });

    it('should reject invalid data via byId', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test invalid Overview section
      const invalidOverview = {
        coreFunction: '', // Empty string should fail
        keyCapability: 'Test capability',
        businessValue: 'Test value',
      };
      const overviewResult = byId['2.1'].safeParse(invalidOverview);
      expect(overviewResult.success).toBe(false);

      // Test invalid Business Context section
      const invalidBusinessContext = ''; // Empty string should fail
      const businessContextResult = byId['2.2'].safeParse(invalidBusinessContext);
      expect(businessContextResult.success).toBe(false);
    });
  });
});
