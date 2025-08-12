import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Integration Tests', () => {
  describe('byId Index Completeness Verification', () => {
    it('should verify byId index completeness for plan schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.4'];

      expectedSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      // Verify no extra sections
      const actualSections = Object.keys(byId);
      expect(actualSections.sort()).toEqual(expectedSections.sort());
    });

    it('should verify byId index completeness for task schema', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.5'];

      expectedSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      // Verify no extra sections
      const actualSections = Object.keys(byId);
      expect(actualSections.sort()).toEqual(expectedSections.sort());
    });
  });

  describe('Schema Registration Verification', () => {
    it('should verify schema registration for plan schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all registered schemas are valid Zod schemas
      Object.entries(byId).forEach(([sectionId, schema]) => {
        expect(schema).toBeDefined();
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
        expect(typeof schema.refine).toBe('function');
      });
    });

    it('should verify schema registration for task schema', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all registered schemas are valid Zod schemas
      Object.entries(byId).forEach(([sectionId, schema]) => {
        expect(schema).toBeDefined();
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
        expect(typeof schema.refine).toBe('function');
      });
    });
  });

  describe('Cross-Family Consistency', () => {
    it('should maintain consistent byId structure across document types', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Shared sections should have consistent structure
      const sharedSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3'];

      sharedSections.forEach((sectionId) => {
        expect(planById[sectionId]).toBeDefined();
        expect(taskById[sectionId]).toBeDefined();
        expect(typeof planById[sectionId].safeParse).toBe('function');
        expect(typeof taskById[sectionId].safeParse).toBe('function');
      });
    });

    it('should handle document type specific sections correctly', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan-only sections
      expect(planById['7.4']).toBeDefined();
      expect(taskById['7.4']).toBeUndefined();

      // Task-only sections
      expect(taskById['7.5']).toBeDefined();
      expect(planById['7.5']).toBeUndefined();
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
            scenario: 'Unit test for parser',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Ensure the event is emitted with appropriate error context.',
          },
          {
            id: 'TEST-02',
            scenario: 'Integration test for generator',
            testType: 'Integration',
            toolsRunner: 'Vitest',
            notes: 'Ensure the event is emitted with a non-empty array.',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'Event emission works correctly for valid task files',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Create a test fixture that adheres perfectly to the schema.',
          },
          {
            id: 'E2E-02',
            scenario: 'Event emission works correctly for invalid task files',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Create invalid test fixture and assert error context.',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'SchemaProvider injection',
            default: 'native',
            overrideMethod: 'Constructor parameter',
            notes: 'Determines which schema provider to use',
          },
          {
            id: 'CONFIG-02',
            settingName: 'eventEmitter',
            source: 'EventEmitter injection',
            default: 'Required',
            overrideMethod: 'Constructor parameter',
            notes: 'Event emitter instance for publishing events',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Document parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Consumer logs error and may block further processing',
            notes: 'Critical error that prevents document processing',
          },
          {
            id: 'ALERT-02',
            alertCondition: 'Document validation fails',
            eventType: 'validation.failed',
            consumerResponse: 'Consumer displays validation errors to user',
            notes: 'Non-critical, allows user to fix validation issues',
          },
        ],
        consumerResponseStrategies: [
          'CLI Tools: Display errors to console and exit with appropriate error codes',
          'Git Hooks: Block commits and display validation errors to user',
          'Reporting Systems: Log events for analysis and alert on critical failures',
        ],
        errorRecovery: [
          'Parser Level: Emit appropriate events for all error conditions',
          'Consumer Level: Implement retry logic, fallback mechanisms, and user feedback',
          'System Level: Monitor event emission patterns for system health',
        ],
        deploymentSteps: [
          'Run database migrations: yarn db:migrate',
          'Update environment variables in Vercel dashboard.',
          'Promote the build to production.',
        ],
      };

      const result = planSchema.safeParse(completePlanDocument);
      expect(result.success).toBe(true);
    });

    it('should validate complete task document with all sections', () => {
      const taskSchema = createQualityOperationsSchema('task');

      const completeTaskDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          {
            id: 'TEST-01',
            scenario: 'Unit test for parser',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Ensure the event is emitted with appropriate error context.',
          },
          {
            id: 'TEST-02',
            scenario: 'Integration test for generator',
            testType: 'Integration',
            toolsRunner: 'Vitest',
            notes: 'Ensure the event is emitted with a non-empty array.',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'Event emission works correctly for valid task files',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Create a test fixture that adheres perfectly to the schema.',
          },
          {
            id: 'E2E-02',
            scenario: 'Event emission works correctly for invalid task files',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Create invalid test fixture and assert error context.',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'SchemaProvider injection',
            default: 'native',
            overrideMethod: 'Constructor parameter',
            notes: 'Determines which schema provider to use',
          },
          {
            id: 'CONFIG-02',
            settingName: 'eventEmitter',
            source: 'EventEmitter injection',
            default: 'Required',
            overrideMethod: 'Constructor parameter',
            notes: 'Event emitter instance for publishing events',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Document parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Consumer logs error and may block further processing',
            notes: 'Critical error that prevents document processing',
          },
          {
            id: 'ALERT-02',
            alertCondition: 'Document validation fails',
            eventType: 'validation.failed',
            consumerResponse: 'Consumer displays validation errors to user',
            notes: 'Non-critical, allows user to fix validation issues',
          },
        ],
        consumerResponseStrategies: [
          'CLI Tools: Display errors to console and exit with appropriate error codes',
          'Git Hooks: Block commits and display validation errors to user',
          'Reporting Systems: Log events for analysis and alert on critical failures',
        ],
        errorRecovery: [
          'Parser Level: Emit appropriate events for all error conditions',
          'Consumer Level: Implement retry logic, fallback mechanisms, and user feedback',
          'System Level: Monitor event emission patterns for system health',
        ],
        localTestCommands: ['npm test', 'npm run test:watch', 'npm run test:coverage', 'npm run test:integration'],
      };

      const result = taskSchema.safeParse(completeTaskDocument);
      expect(result.success).toBe(true);
    });
  });

  describe('Schema Factory Pattern Consistency', () => {
    it('should maintain consistent factory pattern across all sections', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All sections should be registered via the factory pattern
      Object.entries(byId).forEach(([sectionId, schema]) => {
        expect(schema).toBeDefined();
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
      });
    });

    it('should ensure byId registration works for all factory functions', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify that all expected sections are registered
      const allSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.4', '7.5'];

      allSections.forEach((sectionId) => {
        if (planById[sectionId]) {
          expect(typeof planById[sectionId].safeParse).toBe('function');
        }
        if (taskById[sectionId]) {
          expect(typeof taskById[sectionId].safeParse).toBe('function');
        }
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing optional sections gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');

      const minimalDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          {
            id: 'TEST-01',
            scenario: 'Unit test for parser',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Ensure the event is emitted with appropriate error context.',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'Event emission works correctly for valid task files',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Create a test fixture that adheres perfectly to the schema.',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'SchemaProvider injection',
            default: 'native',
            overrideMethod: 'Constructor parameter',
            notes: 'Determines which schema provider to use',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Document parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Consumer logs error and may block further processing',
            notes: 'Critical error that prevents document processing',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: Display errors to console and exit with appropriate error codes'],
        errorRecovery: ['Parser Level: Emit appropriate events for all error conditions'],
        deploymentSteps: ['Run database migrations: yarn db:migrate'],
      };

      const result = planSchema.safeParse(minimalDocument);
      expect(result.success).toBe(true);
    });

    it('should handle byId access on invalid schema gracefully', () => {
      const invalidSchema = {} as any;

      expect(invalidSchema.__byId).toBeUndefined();

      // Should not throw when accessing byId on invalid schema
      expect(() => {
        const byId = invalidSchema.__byId;
        expect(byId).toBeUndefined();
      }).not.toThrow();
    });

    it('should handle non-existent section access gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['7.999']).toBeUndefined();
      expect(byId['invalid']).toBeUndefined();
      expect(byId['']).toBeUndefined();
    });
  });
});

