import { describe, it, expect } from 'vitest';
import { createBusinessScopeSchema } from '../../2-business-scope.schema.js';
import { z } from 'zod';

describe('Business & Scope Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedPlanSections = [
        '2.1', // Overview
        '2.2', // Business Context
        '2.2.1', // User Journeys
        '2.2.2', // User Personas
        '2.2.3', // Core Business Rules
        '2.2.4', // User Stories
        '2.3', // Success Criteria
        '2.5', // Boundaries and Scope
        '2.5.1', // In Scope
        '2.5.2', // Out of Scope
        '2.6', // Core Business Processes
      ];

      expectedPlanSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
      });

      expect(Object.keys(byId).length).toBe(expectedPlanSections.length);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createBusinessScopeSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedTaskSections = [
        '2.1', // Overview
        '2.2.3', // Core Business Rules
        '2.4', // Definition of Done
      ];

      expectedTaskSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
      });

      expect(Object.keys(byId).length).toBe(expectedTaskSections.length);
    });

    it('should not register plan-only sections in task byId index', () => {
      const taskSchema = createBusinessScopeSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const planOnlySections = [
        '2.2', // Business Context
        '2.2.1', // User Journeys
        '2.2.2', // User Personas
        '2.2.4', // User Stories
        '2.3', // Success Criteria
        '2.5', // Boundaries and Scope
        '2.5.1', // In Scope
        '2.5.2', // Out of Scope
        '2.6', // Core Business Processes
      ];

      planOnlySections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeUndefined();
      });
    });

    it('should not register task-only sections in plan byId index', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const taskOnlySections = [
        '2.4', // Definition of Done
      ];

      taskOnlySections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeUndefined();
      });
    });
  });

  describe('Schema Registration Verification', () => {
    it('should register schemas with correct types for plan', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test that schemas are properly registered and functional
      expect(typeof byId['2.1'].safeParse).toBe('function');
      expect(typeof byId['2.2'].safeParse).toBe('function');
      expect(typeof byId['2.2.1'].safeParse).toBe('function');
      expect(typeof byId['2.2.2'].safeParse).toBe('function');
      expect(typeof byId['2.2.3'].safeParse).toBe('function');
      expect(typeof byId['2.2.4'].safeParse).toBe('function');
      expect(typeof byId['2.3'].safeParse).toBe('function');
      expect(typeof byId['2.5'].safeParse).toBe('function');
      expect(typeof byId['2.5.1'].safeParse).toBe('function');
      expect(typeof byId['2.5.2'].safeParse).toBe('function');
      expect(typeof byId['2.6'].safeParse).toBe('function');
    });

    it('should register schemas with correct types for task', () => {
      const taskSchema = createBusinessScopeSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test that schemas are properly registered and functional
      expect(typeof byId['2.1'].safeParse).toBe('function');
      expect(typeof byId['2.2.3'].safeParse).toBe('function');
      expect(typeof byId['2.4'].safeParse).toBe('function');
    });
  });

  describe('Independent Section Validation', () => {
    it('should validate plan sections independently via byId', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test Overview (2.1)
      const overviewData = {
        coreFunction: 'Test function',
        keyCapability: 'Test capability',
        businessValue: 'Test value',
      };
      expect(byId['2.1'].safeParse(overviewData).success).toBe(true);

      // Test Business Context (2.2)
      const businessContextData = 'Valid business context description';
      expect(byId['2.2'].safeParse(businessContextData).success).toBe(true);

      // Test User Journeys (2.2.1)
      const userJourneysData = [
        {
          name: 'Test Journey',
          description: 'Test description',
          diagram: 'graph TD; A-->B;',
        },
      ];
      expect(byId['2.2.1'].safeParse(userJourneysData).success).toBe(true);

      // Test Core Business Rules (2.2.3)
      const businessRulesData = ['Rule 1', 'Rule 2'];
      expect(byId['2.2.3'].safeParse(businessRulesData).success).toBe(true);
    });

    it('should validate task sections independently via byId', () => {
      const taskSchema = createBusinessScopeSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test Overview (2.1)
      const overviewData = {
        coreFunction: 'Test function',
        keyCapability: 'Test capability',
        businessValue: 'Test value',
      };
      expect(byId['2.1'].safeParse(overviewData).success).toBe(true);

      // Test Core Business Rules (2.2.3)
      const businessRulesData = ['Rule 1', 'Rule 2'];
      expect(byId['2.2.3'].safeParse(businessRulesData).success).toBe(true);

      // Test Definition of Done (2.4)
      const definitionOfDoneData = [
        {
          id: 'DoD-1',
          criterion: 'Test criterion',
        },
      ];
      expect(byId['2.4'].safeParse(definitionOfDoneData).success).toBe(true);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain consistent validation between byId and composed schema for plan', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      // Test Overview consistency
      const overviewData = {
        coreFunction: 'Test function',
        keyCapability: 'Test capability',
        businessValue: 'Test value',
      };
      const byIdResult = byId['2.1'].safeParse(overviewData);
      const composedResult = shape.overview.safeParse(overviewData);
      expect(byIdResult.success).toBe(composedResult.success);

      // Test Business Context consistency
      const businessContextData = 'Valid business context';
      const byIdContextResult = byId['2.2'].safeParse(businessContextData);
      const composedContextResult = shape.businessContext.safeParse(businessContextData);
      expect(byIdContextResult.success).toBe(composedContextResult.success);
    });

    it('should maintain consistent validation between byId and composed schema for task', () => {
      const taskSchema = createBusinessScopeSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      // Test Overview consistency
      const overviewData = {
        coreFunction: 'Test function',
        keyCapability: 'Test capability',
        businessValue: 'Test value',
      };
      const byIdResult = byId['2.1'].safeParse(overviewData);
      const composedResult = shape.overview.safeParse(overviewData);
      expect(byIdResult.success).toBe(composedResult.success);

      // Test Definition of Done consistency
      const definitionOfDoneData = [
        {
          id: 'DoD-1',
          criterion: 'Test criterion',
        },
      ];
      const byIdDoDResult = byId['2.4'].safeParse(definitionOfDoneData);
      const composedDoDResult = shape.definitionOfDone.safeParse(definitionOfDoneData);
      expect(byIdDoDResult.success).toBe(composedDoDResult.success);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Non-existent section should be undefined
      expect(byId['2.999']).toBeUndefined();
      expect(byId['invalid']).toBeUndefined();
      expect(byId['']).toBeUndefined();
    });

    it('should handle byId access on invalid schema gracefully', () => {
      // Test that accessing byId on a schema without it doesn't crash
      const invalidSchema = { shape: {} };
      expect((invalidSchema as any).__byId).toBeUndefined();
    });

    it('should validate that byId schemas are actual Zod schemas', () => {
      const planSchema = createBusinessScopeSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All registered schemas should be Zod schemas with safeParse method
      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
      });
    });
  });
});
