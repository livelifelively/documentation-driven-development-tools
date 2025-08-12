import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Integration and Validation (Phase 6)', () => {
  describe('byId Index Completeness Verification', () => {
    it('should verify complete byId index for plan schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedPlanSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.4'];

      // Verify all expected sections are present
      expectedPlanSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      // Verify no unexpected sections
      expect(Object.keys(byId).length).toBe(expectedPlanSections.length);

      // Verify no task-only sections in plan byId
      expect(byId['7.5']).toBeUndefined();
    });

    it('should verify complete byId index for task schema', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedTaskSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.5'];

      // Verify all expected sections are present
      expectedTaskSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      // Verify no unexpected sections
      expect(Object.keys(byId).length).toBe(expectedTaskSections.length);

      // Verify no plan-only sections in task byId
      expect(byId['7.4']).toBeUndefined();
    });

    it('should verify byId index structure consistency', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify shared sections have consistent structure
      const sharedSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3'];

      sharedSections.forEach((sectionId) => {
        expect(planById[sectionId]).toBeDefined();
        expect(taskById[sectionId]).toBeDefined();
        expect(typeof planById[sectionId].safeParse).toBe('function');
        expect(typeof taskById[sectionId].safeParse).toBe('function');
      });
    });
  });

  describe('Schema Registration Verification', () => {
    it('should verify all sections are properly accessible via byId', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test that each section can be accessed and validated
      const testData = {
        '7.1': {}, // Container section
        '7.1.1': [
          { id: 'TEST-01', scenario: 'Test scenario', testType: 'Unit', toolsRunner: 'Vitest', notes: 'Test notes' },
        ],
        '7.1.2': [
          { id: 'E2E-01', scenario: 'E2E scenario', testType: 'E2E', toolsRunner: 'Vitest', notes: 'E2E notes' },
        ],
        '7.2': [
          {
            id: 'CONFIG-01',
            settingName: 'test',
            source: 'test',
            default: 'test',
            overrideMethod: 'test',
            notes: 'test',
          },
        ],
        '7.3': {}, // Container section
        '7.3.1': [
          { id: 'ALERT-01', eventType: 'test', alertCondition: 'test', consumerResponse: 'test', notes: 'test' },
        ],
        '7.3.2': ['Test strategy 1', 'Test strategy 2'],
        '7.3.3': ['Test recovery 1', 'Test recovery 2'],
        '7.4': ['Test deployment step 1', 'Test deployment step 2'],
      };

      Object.entries(testData).forEach(([sectionId, data]) => {
        const result = byId[sectionId].safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should verify schema types are correct for each section', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should be ZodObject
      expect(byId['7.1']).toBeInstanceOf(z.ZodObject);
      expect(byId['7.3']).toBeInstanceOf(z.ZodObject);

      // Table and array sections should be ZodArray
      expect(byId['7.1.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.1.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.3.3']).toBeInstanceOf(z.ZodArray);
      expect(byId['7.4']).toBeInstanceOf(z.ZodArray);
    });
  });

  describe('Container Sections Complexity Handling', () => {
    it('should handle container sections (7.1, 7.3) with no direct content', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should accept empty objects
      expect(byId['7.1'].safeParse({}).success).toBe(true);
      expect(byId['7.3'].safeParse({}).success).toBe(true);

      // Container sections should accept objects with any content
      expect(byId['7.1'].safeParse({ someField: 'value' }).success).toBe(true);
      expect(byId['7.3'].safeParse({ anotherField: 123 }).success).toBe(true);

      // Container sections should reject non-objects
      expect(byId['7.1'].safeParse('not an object').success).toBe(false);
      expect(byId['7.3'].safeParse(null).success).toBe(false);
    });

    it('should verify container sections work correctly in composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const shape = planSchema.shape as any;

      // Container sections should work in composed schema
      expect(shape.testingStrategyRequirements.safeParse({}).success).toBe(true);
      expect(shape.alertingResponse.safeParse({}).success).toBe(true);

      // Container sections should accept any object content
      expect(shape.testingStrategyRequirements.safeParse({ metadata: { version: '1.0' } }).success).toBe(true);
      expect(shape.alertingResponse.safeParse({ settings: { enabled: true } }).success).toBe(true);
    });
  });

  describe('Cross-Family Validation', () => {
    it('should maintain consistency with established patterns from other families', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify byId structure follows established pattern
      expect(typeof planById).toBe('object');
      expect(typeof taskById).toBe('object');
      expect(Array.isArray(planById)).toBe(false);
      expect(Array.isArray(taskById)).toBe(false);

      // Verify byId is attached to schema
      expect((planSchema as any).__byId).toBeDefined();
      expect((taskSchema as any).__byId).toBeDefined();

      // Verify byId contains Zod schemas
      Object.values(planById).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
      });

      Object.values(taskById).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
      });
    });

    it('should verify document type applicability follows established patterns', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify plan-only sections
      expect(planById['7.4']).toBeDefined();
      expect(taskById['7.4']).toBeUndefined();

      // Verify task-only sections
      expect(taskById['7.5']).toBeDefined();
      expect(planById['7.5']).toBeUndefined();

      // Verify shared sections
      const sharedSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3'];
      sharedSections.forEach((sectionId) => {
        expect(planById[sectionId]).toBeDefined();
        expect(taskById[sectionId]).toBeDefined();
      });
    });
  });

  describe('Complete Document Validation', () => {
    it('should validate complete plan document with all sections', () => {
      const planSchema = createQualityOperationsSchema('plan');

      const completePlanDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          {
            id: 'TEST-01',
            scenario: 'Test scenario',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Test notes',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'E2E scenario',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'E2E notes',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'test',
            source: 'test',
            default: 'test',
            overrideMethod: 'test',
            notes: 'test',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            eventType: 'test',
            alertCondition: 'test',
            consumerResponse: 'test',
            notes: 'test',
          },
        ],
        consumerResponseStrategies: ['Strategy 1', 'Strategy 2'],
        errorRecovery: ['Recovery 1', 'Recovery 2'],
        deploymentSteps: ['Step 1', 'Step 2'],
      };

      const result = planSchema.safeParse(completePlanDocument);
      expect(result.success).toBe(true);
    });

    it('should validate complete task document with all applicable sections', () => {
      const taskSchema = createQualityOperationsSchema('task');

      const completeTaskDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          {
            id: 'TEST-01',
            scenario: 'Test scenario',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Test notes',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'E2E scenario',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'E2E notes',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'test',
            source: 'test',
            default: 'test',
            overrideMethod: 'test',
            notes: 'test',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            eventType: 'test',
            alertCondition: 'test',
            consumerResponse: 'test',
            notes: 'test',
          },
        ],
        consumerResponseStrategies: ['Strategy 1', 'Strategy 2'],
        errorRecovery: ['Recovery 1', 'Recovery 2'],
        localTestCommands: ['npm test', 'npm run test:watch'],
      };

      const result = taskSchema.safeParse(completeTaskDocument);
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing optional sections gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');

      // Document with minimal required sections (arrays need at least 1 item)
      const minimalDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          { id: 'TEST-01', scenario: 'Minimal test', testType: 'Unit', toolsRunner: 'Vitest', notes: 'Minimal' },
        ],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Minimal E2E', testType: 'E2E', toolsRunner: 'Vitest', notes: 'Minimal' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'minimal',
            source: 'minimal',
            default: 'minimal',
            overrideMethod: 'minimal',
            notes: 'minimal',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            eventType: 'minimal',
            alertCondition: 'minimal',
            consumerResponse: 'minimal',
            notes: 'minimal',
          },
        ],
        consumerResponseStrategies: ['Minimal strategy'],
        errorRecovery: ['Minimal recovery'],
        deploymentSteps: ['Minimal step'],
      };

      const result = planSchema.safeParse(minimalDocument);
      expect(result.success).toBe(true);
    });

    it('should handle byId access on invalid schema gracefully', () => {
      // Test with invalid schema object
      const invalidSchema = { __byId: null };

      expect(() => {
        (invalidSchema as any).__byId['7.1'].safeParse({});
      }).toThrow();
    });

    it('should handle non-existent section access gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Non-existent section should be undefined
      expect(byId['7.999']).toBeUndefined();
      expect(byId['invalid']).toBeUndefined();
    });

    it('should verify byId schemas are actual Zod schemas', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      Object.entries(byId).forEach(([sectionId, schema]) => {
        expect(schema).toBeDefined();
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
        expect(typeof schema.refine).toBe('function');
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large documents efficiently', () => {
      const planSchema = createQualityOperationsSchema('plan');

      // Create large document with many items
      const largeDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: Array.from({ length: 100 }, (_, i) => ({
          id: `TEST-${String(i + 1).padStart(3, '0')}`,
          scenario: `Test scenario ${i + 1}`,
          testType: i % 2 === 0 ? 'Unit' : 'Integration',
          toolsRunner: i % 3 === 0 ? 'Vitest' : i % 3 === 1 ? 'Jest' : 'Mocha',
          notes: `Test notes for scenario ${i + 1}`,
        })),
        endToEndE2ETestingStrategy: Array.from({ length: 50 }, (_, i) => ({
          id: `E2E-${String(i + 1).padStart(3, '0')}`,
          scenario: `E2E scenario ${i + 1}`,
          testType: 'E2E',
          toolsRunner: 'Vitest',
          notes: `E2E notes for scenario ${i + 1}`,
        })),
        configuration: Array.from({ length: 25 }, (_, i) => ({
          id: `CONFIG-${String(i + 1).padStart(3, '0')}`,
          settingName: `setting_${i + 1}`,
          source: `source_${i + 1}`,
          default: `default_${i + 1}`,
          overrideMethod: `method_${i + 1}`,
          notes: `Config notes ${i + 1}`,
        })),
        alertingResponse: {},
        eventBasedAlerting: Array.from({ length: 30 }, (_, i) => ({
          id: `ALERT-${String(i + 1).padStart(3, '0')}`,
          eventType: `event_${i + 1}`,
          alertCondition: `condition_${i + 1}`,
          consumerResponse: `response_${i + 1}`,
          notes: `Alert notes ${i + 1}`,
        })),
        consumerResponseStrategies: Array.from({ length: 200 }, (_, i) => `Strategy ${i + 1}`),
        errorRecovery: Array.from({ length: 100 }, (_, i) => `Recovery ${i + 1}`),
        deploymentSteps: Array.from({ length: 150 }, (_, i) => `Deployment step ${i + 1}`),
      };

      const result = planSchema.safeParse(largeDocument);
      expect(result.success).toBe(true);
    });
  });
});
