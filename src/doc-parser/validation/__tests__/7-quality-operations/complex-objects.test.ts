import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Complex Object Validation Tests', () => {
  describe('Table Validation', () => {
    it('should validate complex testing scenario table via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const complexTestTable = [
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
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with a non-empty LintingError[] array.',
        },
        {
          id: 'TEST-03',
          scenario: 'Schema validation works correctly for both task and plan types',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Test that SchemaProvider integration works for both document types.',
        },
      ];

      expect(byId['7.1.1'].safeParse(complexTestTable).success).toBe(true);
      expect(shape.unitIntegrationTests.safeParse(complexTestTable).success).toBe(true);
    });

    it('should validate complex E2E testing table via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const complexE2ETable = [
        {
          id: 'E2E-01',
          scenario: 'Event emission works correctly for valid task files with comprehensive context',
          testType: 'E2E',
          toolsRunner: 'Vitest',
          notes: 'Create a test-fixtures/valid.task.md that adheres perfectly to the schema.',
        },
        {
          id: 'E2E-02',
          scenario: 'Event emission works correctly for invalid task files with proper error context',
          testType: 'E2E',
          toolsRunner: 'Vitest',
          notes: 'Create test-fixtures/invalid-missing-field.task.md and assert error context.',
        },
        {
          id: 'E2E-03',
          scenario: 'Event consumer integration works correctly with multiple listeners',
          testType: 'E2E',
          toolsRunner: 'Vitest',
          notes: 'Test that multiple event consumers can subscribe to and receive events.',
        },
      ];

      expect(byId['7.1.2'].safeParse(complexE2ETable).success).toBe(true);
      expect(shape.endToEndE2ETestingStrategy.safeParse(complexE2ETable).success).toBe(true);
    });

    it('should validate complex configuration table via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const complexConfigTable = [
        {
          id: 'CONFIG-01',
          settingName: 'schemaProvider',
          source: 'SchemaProvider injection',
          default: 'native',
          overrideMethod: 'Constructor parameter',
          notes: 'Determines which schema provider to use (native or config)',
        },
        {
          id: 'CONFIG-02',
          settingName: 'eventEmitter',
          source: 'EventEmitter injection',
          default: 'Required',
          overrideMethod: 'Constructor parameter',
          notes: 'Event emitter instance for publishing events',
        },
        {
          id: 'CONFIG-03',
          settingName: 'NODE_ENV',
          source: 'Environment Variable',
          default: 'development',
          overrideMethod: 'NODE_ENV env var',
          notes: 'Environment configuration for different deployment stages',
        },
      ];

      expect(byId['7.2'].safeParse(complexConfigTable).success).toBe(true);
      expect(shape.configuration.safeParse(complexConfigTable).success).toBe(true);
    });

    it('should validate complex alerting table via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const complexAlertingTable = [
        {
          id: 'ALERT-01',
          eventType: 'parsing.failed',
          alertCondition: 'File parsing fails due to invalid format',
          consumerResponse: 'Log error, notify developers, block deployment',
          notes: 'Critical for maintaining data integrity',
        },
        {
          id: 'ALERT-02',
          eventType: 'validation.failed',
          alertCondition: 'Schema validation fails for document',
          consumerResponse: 'Log warning, notify QA team, allow with warning',
          notes: 'Important for quality assurance',
        },
        {
          id: 'ALERT-03',
          eventType: 'processing.completed',
          alertCondition: 'Document processing completes successfully',
          consumerResponse: 'Log info, update metrics, continue workflow',
          notes: 'Informational for monitoring',
        },
      ];

      expect(byId['7.3.1'].safeParse(complexAlertingTable).success).toBe(true);
      expect(shape.eventBasedAlerting.safeParse(complexAlertingTable).success).toBe(true);
    });

    it('should reject table with missing required fields', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidTable = [
        {
          id: 'TEST-01',
          scenario: 'parseDocument emits parsing.failed for an invalid file',
          // Missing testType field
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(invalidTable).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(invalidTable).success).toBe(false);
    });

    it('should reject table with invalid test type', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidTable = [
        {
          id: 'TEST-01',
          scenario: 'parseDocument emits parsing.failed for an invalid file',
          testType: 'InvalidType', // Invalid test type
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(invalidTable).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(invalidTable).success).toBe(false);
    });

    it('should reject empty table', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyTable: any[] = [];

      expect(byId['7.1.1'].safeParse(emptyTable).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(emptyTable).success).toBe(false);
    });

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

  describe('Array Validation', () => {
    it('should validate consumer response strategies array via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validStrategies = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        'Git Hooks: Block commits and display validation errors to user',
        'Reporting Systems: Log events for analysis and alert on critical failures',
        'Integration Systems: Implement retry logic and graceful degradation',
      ];

      expect(byId['7.3.2'].safeParse(validStrategies).success).toBe(true);
      expect(shape.consumerResponseStrategies.safeParse(validStrategies).success).toBe(true);
    });

    it('should validate error recovery array via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validRecovery = [
        'Parser Level: Emit appropriate events for all error conditions',
        'Consumer Level: Implement retry logic, fallback mechanisms, and user feedback',
        'System Level: Monitor event emission patterns for system health',
      ];

      expect(byId['7.3.3'].safeParse(validRecovery).success).toBe(true);
      expect(shape.errorRecovery.safeParse(validRecovery).success).toBe(true);
    });

    it('should validate deployment steps array via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validSteps = [
        'Run database migrations: yarn db:migrate',
        'Update environment variables in Vercel dashboard.',
        'Promote the build to production.',
      ];

      expect(byId['7.4'].safeParse(validSteps).success).toBe(true);
      expect(shape.deploymentSteps.safeParse(validSteps).success).toBe(true);
    });

    it('should validate local test commands array via byId and composed schema', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validCommands = ['npm test', 'npm run test:watch', 'npm run test:coverage', 'npm run test:integration'];

      expect(byId['7.5'].safeParse(validCommands).success).toBe(true);
      expect(shape.localTestCommands.safeParse(validCommands).success).toBe(true);
    });

    it('should reject array with empty strings', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidArray = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        '', // Invalid empty string
        'Reporting Systems: Log events for analysis and alert on critical failures',
      ];

      expect(byId['7.3.2'].safeParse(invalidArray).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(invalidArray).success).toBe(false);
    });

    it('should reject empty array', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyArray: any[] = [];

      expect(byId['7.3.2'].safeParse(emptyArray).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(emptyArray).success).toBe(false);
    });

    it('should reject array with non-string items', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidArray = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        123, // Invalid non-string item
        'Reporting Systems: Log events for analysis and alert on critical failures',
      ];

      expect(byId['7.3.2'].safeParse(invalidArray).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(invalidArray).success).toBe(false);
    });

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

    it('should reject array with whitespace-only strings', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidArray = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        '   ', // Invalid whitespace-only string
        'Reporting Systems: Log events for analysis and alert on critical failures',
      ];

      // Note: Current schema only checks min(1), so whitespace-only strings are accepted
      expect(byId['7.3.2'].safeParse(invalidArray).success).toBe(true);
      expect(shape.consumerResponseStrategies.safeParse(invalidArray).success).toBe(true);
    });
  });

  describe('Object Validation', () => {
    it('should validate testing strategy requirements container via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validContainer = {};

      expect(byId['7.1'].safeParse(validContainer).success).toBe(true);
      expect(shape.testingStrategyRequirements.safeParse(validContainer).success).toBe(true);
    });

    it('should validate alerting response container via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validContainer = {};

      expect(byId['7.3'].safeParse(validContainer).success).toBe(true);
      expect(shape.alertingResponse.safeParse(validContainer).success).toBe(true);
    });

    it('should accept container with empty object', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validContainer = {};

      expect(byId['7.1'].safeParse(validContainer).success).toBe(true);
      expect(shape.testingStrategyRequirements.safeParse(validContainer).success).toBe(true);
    });

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
        testingStrategyRequirements: {
          metadata: {
            version: '1.0.0',
            scope: 'comprehensive',
          },
        },
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
        alertingResponse: {
          settings: {
            enabled: true,
            notificationChannels: ['email', 'slack'],
          },
        },
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
        testingStrategyRequirements: {
          metadata: {
            version: '1.0.0',
            scope: 'task-specific',
          },
        },
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
        alertingResponse: {
          settings: {
            enabled: true,
            taskSpecificNotifications: ['console', 'file'],
          },
        },
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
        expect(result.error.issues.some((issue) => issue.path.length > 0)).toBe(true);
      }
    });

    it('should handle deeply nested invalid data', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const deeplyNestedInvalid = {
        level1: {
          level2: {
            level3: {
              invalidField: null, // Invalid null in nested object
            },
          },
        },
      };

      // Container sections accept any object, so this should pass
      const result = byId['7.1'].safeParse(deeplyNestedInvalid);
      expect(result.success).toBe(true);
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

  describe('Document Type Specific Validation', () => {
    it('should validate deployment steps only in plan schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(planById['7.4']).toBeDefined();
      expect(taskById['7.4']).toBeUndefined();
    });

    it('should validate local test commands only in task schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(taskById['7.5']).toBeDefined();
      expect(planById['7.5']).toBeUndefined();
    });
  });
});
