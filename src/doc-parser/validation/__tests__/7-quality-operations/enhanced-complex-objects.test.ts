import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Enhanced Complex Object Validation Tests (Phase 5)', () => {
  describe('Enhanced Table Validation', () => {
    it('should validate table with single row', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const singleRowTable = [
        {
          id: 'TEST-01',
          scenario: 'parseDocument emits parsing.failed for an invalid file',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(singleRowTable).success).toBe(true);
      expect(shape.unitIntegrationTests.safeParse(singleRowTable).success).toBe(true);
    });

    it('should validate table with large number of rows', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const largeTable = Array.from({ length: 10 }, (_, index) => ({
        id: `TEST-${String(index + 1).padStart(2, '0')}`,
        scenario: `Test scenario ${index + 1} for comprehensive validation`,
        testType: index % 2 === 0 ? 'Unit' : 'Integration',
        toolsRunner: index % 3 === 0 ? 'Vitest' : index % 3 === 1 ? 'Jest' : 'Mocha',
        notes: `Detailed notes for test scenario ${index + 1} with comprehensive coverage.`,
      }));

      expect(byId['7.1.1'].safeParse(largeTable).success).toBe(true);
      expect(shape.unitIntegrationTests.safeParse(largeTable).success).toBe(true);
    });

    it('should reject table with invalid data types', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidTable = [
        {
          id: 123, // Invalid: should be string
          scenario: 'parseDocument emits parsing.failed for an invalid file',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(invalidTable).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(invalidTable).success).toBe(false);
    });

    it('should reject table with null values', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidTable = [
        {
          id: 'TEST-01',
          scenario: null, // Invalid: should be string
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(invalidTable).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(invalidTable).success).toBe(false);
    });
  });

  describe('Enhanced Array Validation', () => {
    it('should validate array with single item', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const singleItemArray = ['CLI Tools: Display errors to console and exit with appropriate error codes'];

      expect(byId['7.3.2'].safeParse(singleItemArray).success).toBe(true);
      expect(shape.consumerResponseStrategies.safeParse(singleItemArray).success).toBe(true);
    });

    it('should validate array with large number of items', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const largeArray = Array.from(
        { length: 20 },
        (_, index) => `Strategy ${index + 1}: Comprehensive response strategy for scenario ${index + 1}`
      );

      expect(byId['7.3.2'].safeParse(largeArray).success).toBe(true);
      expect(shape.consumerResponseStrategies.safeParse(largeArray).success).toBe(true);
    });

    it('should reject array with null values', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidArray = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        null, // Invalid null value
        'Reporting Systems: Log events for analysis and alert on critical failures',
      ];

      expect(byId['7.3.2'].safeParse(invalidArray).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(invalidArray).success).toBe(false);
    });

    it('should reject array with undefined values', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidArray = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        undefined, // Invalid undefined value
        'Reporting Systems: Log events for analysis and alert on critical failures',
      ];

      expect(byId['7.3.2'].safeParse(invalidArray).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(invalidArray).success).toBe(false);
    });
  });

  describe('Enhanced Object Validation', () => {
    it('should accept container with non-empty object', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validContainer = { someField: 'value' };

      expect(byId['7.1'].safeParse(validContainer).success).toBe(true);
      expect(shape.testingStrategyRequirements.safeParse(validContainer).success).toBe(true);
    });

    it('should accept container with complex nested object', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const complexContainer = {
        metadata: {
          version: '1.0.0',
          author: 'Development Team',
          lastUpdated: '2024-01-15',
        },
        settings: {
          enabled: true,
          priority: 'high',
          notifications: ['email', 'slack'],
        },
        customFields: {
          field1: 'value1',
          field2: 123,
          field3: ['item1', 'item2'],
        },
      };

      expect(byId['7.1'].safeParse(complexContainer).success).toBe(true);
      expect(shape.testingStrategyRequirements.safeParse(complexContainer).success).toBe(true);
    });

    it('should reject container with null value', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidContainer = null;

      expect(byId['7.1'].safeParse(invalidContainer).success).toBe(false);
      expect(shape.testingStrategyRequirements.safeParse(invalidContainer).success).toBe(false);
    });

    it('should reject container with undefined value', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidContainer = undefined;

      expect(byId['7.1'].safeParse(invalidContainer).success).toBe(false);
      expect(shape.testingStrategyRequirements.safeParse(invalidContainer).success).toBe(false);
    });

    it('should reject container with non-object value', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidContainer = 'not an object';

      expect(byId['7.1'].safeParse(invalidContainer).success).toBe(false);
      expect(shape.testingStrategyRequirements.safeParse(invalidContainer).success).toBe(false);
    });
  });

  describe('Mixed Content Validation', () => {
    it('should validate complete document with all complex object types', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const shape = planSchema.shape as any;

      const completeDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          {
            id: 'TEST-01',
            scenario: 'parseDocument emits parsing.failed for an invalid file',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Ensure the event is emitted with appropriate error context.',
          },
          {
            id: 'TEST-02',
            scenario: 'lintDocument emits validation.failed for an invalid file',
            testType: 'Integration',
            toolsRunner: 'Jest',
            notes: 'Ensure the event is emitted with a non-empty LintingError[] array.',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'Event emission works correctly for valid task files',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Create comprehensive test fixtures.',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'SchemaProvider injection',
            default: 'native',
            overrideMethod: 'Constructor parameter',
            notes: 'Determines which schema provider to use.',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            eventType: 'parsing.failed',
            alertCondition: 'File parsing fails due to invalid format',
            consumerResponse: 'Log error, notify developers, block deployment',
            notes: 'Critical for maintaining data integrity',
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
          'Verify deployment health checks',
        ],
      };

      const result = planSchema.safeParse(completeDocument);
      expect(result.success).toBe(true);
    });

    it('should validate task document with all applicable complex object types', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const shape = taskSchema.shape as any;

      const completeTaskDocument = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [
          {
            id: 'TEST-01',
            scenario: 'Task-specific parsing validation',
            testType: 'Unit',
            toolsRunner: 'Vitest',
            notes: 'Ensure task-specific validation works correctly.',
          },
        ],
        endToEndE2ETestingStrategy: [
          {
            id: 'E2E-01',
            scenario: 'Task document processing workflow',
            testType: 'E2E',
            toolsRunner: 'Vitest',
            notes: 'Test complete task processing pipeline.',
          },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'taskValidation',
            source: 'Task-specific configuration',
            default: 'enabled',
            overrideMethod: 'Environment variable',
            notes: 'Controls task-specific validation behavior.',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            eventType: 'task.validation.failed',
            alertCondition: 'Task validation fails',
            consumerResponse: 'Log warning, notify user, allow with warning',
            notes: 'Important for task quality assurance',
          },
        ],
        consumerResponseStrategies: [
          'Task-specific error handling: Display task validation errors',
          'Task workflow integration: Integrate with task management systems',
          'Task reporting: Generate task-specific reports',
        ],
        errorRecovery: [
          'Task Level: Handle task-specific errors gracefully',
          'Workflow Level: Implement task retry mechanisms',
          'System Level: Monitor task processing health',
        ],
        localTestCommands: [
          'npm test -- --grep "task"',
          'npm run test:task-validation',
          'npm run test:task-integration',
          'npm run lint:task',
        ],
      };

      const result = taskSchema.safeParse(completeTaskDocument);
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed table data gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const malformedTable = [
        {
          id: 'TEST-01',
          scenario: 'Valid scenario',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Valid notes',
        },
        {
          // Missing required fields
          scenario: 'Invalid scenario without ID',
          testType: 'Unit',
        },
        {
          id: 'TEST-03',
          scenario: 'Another valid scenario',
          testType: 'Integration',
          toolsRunner: 'Jest',
          notes: 'Valid notes',
        },
      ];

      const result = byId['7.1.1'].safeParse(malformedTable);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        // Check that there are validation errors for the malformed data
        expect(result.error.issues.some((issue) => issue.path.length > 0)).toBe(true);
      }
    });

    it('should handle malformed array data gracefully', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const malformedArray = [
        'Valid strategy 1',
        123, // Invalid non-string
        'Valid strategy 2',
        '', // Invalid empty string
        'Valid strategy 3',
      ];

      const result = byId['7.3.2'].safeParse(malformedArray);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        // Check that there are validation errors for the malformed data
        expect(result.error.issues.some((issue) => issue.path.length > 0)).toBe(true);
      }
    });

    it('should handle extremely large data structures', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Create a large array with 1000 items
      const largeArray = Array.from(
        { length: 1000 },
        (_, index) =>
          `Strategy ${index + 1}: Comprehensive response strategy for scenario ${
            index + 1
          } with detailed description and multiple considerations for various edge cases and error conditions`
      );

      const result = byId['7.3.2'].safeParse(largeArray);
      expect(result.success).toBe(true);
    });

    it('should handle special characters in string data', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const specialCharArray = [
        'Strategy with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
        'Strategy with unicode: 🚀✨🎯📊🔧',
        'Strategy with quotes: "double quotes" and \'single quotes\'',
        'Strategy with newlines: Line 1\nLine 2\nLine 3',
        'Strategy with tabs: Column1\tColumn2\tColumn3',
      ];

      const result = byId['7.3.2'].safeParse(specialCharArray);
      expect(result.success).toBe(true);
    });
  });
});
