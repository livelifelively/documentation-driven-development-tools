import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Section Tests', () => {
  describe('Testing Strategy Requirements Section (7.1) - Both Plan & Task', () => {
    it('should validate testing strategy requirements via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validRequirements = {};

      expect(byId['7.1'].safeParse(validRequirements).success).toBe(true);
      expect(shape.testingStrategyRequirements.safeParse(validRequirements).success).toBe(true);
    });

    it('should validate testing strategy requirements for task schema', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validRequirements = {};

      expect(byId['7.1'].safeParse(validRequirements).success).toBe(true);
      expect(shape.testingStrategyRequirements.safeParse(validRequirements).success).toBe(true);
    });
  });

  describe('Unit & Integration Tests Section (7.1.1) - Both Plan & Task', () => {
    it('should validate unit integration tests via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validTests = [
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
      ];

      expect(byId['7.1.1'].safeParse(validTests).success).toBe(true);
      expect(shape.unitIntegrationTests.safeParse(validTests).success).toBe(true);
    });

    it('should reject unit integration tests with missing required fields', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidTests = [
        {
          id: 'TEST-01',
          // Missing scenario
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(invalidTests).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(invalidTests).success).toBe(false);
    });

    it('should reject unit integration tests with invalid test type', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidTests = [
        {
          id: 'TEST-01',
          scenario: 'Unit test for parser',
          testType: 'InvalidType', // Invalid test type
          toolsRunner: 'Vitest',
          notes: 'Ensure the event is emitted with appropriate error context.',
        },
      ];

      expect(byId['7.1.1'].safeParse(invalidTests).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(invalidTests).success).toBe(false);
    });

    it('should reject empty unit integration tests array', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyTests: any[] = [];

      expect(byId['7.1.1'].safeParse(emptyTests).success).toBe(false);
      expect(shape.unitIntegrationTests.safeParse(emptyTests).success).toBe(false);
    });
  });

  describe('End-to-End Testing Strategy Section (7.1.2) - Both Plan & Task', () => {
    it('should validate E2E testing strategy via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validE2ETests = [
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
      ];

      expect(byId['7.1.2'].safeParse(validE2ETests).success).toBe(true);
      expect(shape.endToEndE2ETestingStrategy.safeParse(validE2ETests).success).toBe(true);
    });

    it('should reject E2E testing strategy with missing required fields', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidE2ETests = [
        {
          id: 'E2E-01',
          scenario: 'Event emission works correctly for valid task files',
          testType: 'E2E',
          // Missing toolsRunner
          notes: 'Create a test fixture that adheres perfectly to the schema.',
        },
      ];

      expect(byId['7.1.2'].safeParse(invalidE2ETests).success).toBe(false);
      expect(shape.endToEndE2ETestingStrategy.safeParse(invalidE2ETests).success).toBe(false);
    });
  });

  describe('Configuration Section (7.2) - Both Plan & Task', () => {
    it('should validate configuration via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validConfig = [
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
      ];

      expect(byId['7.2'].safeParse(validConfig).success).toBe(true);
      expect(shape.configuration.safeParse(validConfig).success).toBe(true);
    });

    it('should reject configuration with missing required fields', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidConfig = [
        {
          id: 'CONFIG-01',
          settingName: 'schemaProvider',
          source: 'SchemaProvider injection',
          default: 'native',
          // Missing overrideMethod
          notes: 'Determines which schema provider to use',
        },
      ];

      expect(byId['7.2'].safeParse(invalidConfig).success).toBe(false);
      expect(shape.configuration.safeParse(invalidConfig).success).toBe(false);
    });
  });

  describe('Alerting Response Section (7.3) - Both Plan & Task', () => {
    it('should validate alerting response via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validAlerting = {};

      expect(byId['7.3'].safeParse(validAlerting).success).toBe(true);
      expect(shape.alertingResponse.safeParse(validAlerting).success).toBe(true);
    });
  });

  describe('Event-Based Alerting Section (7.3.1) - Both Plan & Task', () => {
    it('should validate event-based alerting via byId and composed schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validAlerts = [
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
      ];

      expect(byId['7.3.1'].safeParse(validAlerts).success).toBe(true);
      expect(shape.eventBasedAlerting.safeParse(validAlerts).success).toBe(true);
    });

    it('should reject event-based alerting with missing required fields', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidAlerts = [
        {
          id: 'ALERT-01',
          alertCondition: 'Document parsing fails',
          eventType: 'parsing.failed',
          // Missing consumerResponse
          notes: 'Critical error that prevents document processing',
        },
      ];

      expect(byId['7.3.1'].safeParse(invalidAlerts).success).toBe(false);
      expect(shape.eventBasedAlerting.safeParse(invalidAlerts).success).toBe(false);
    });
  });

  describe('Consumer Response Strategies Section (7.3.2) - Both Plan & Task', () => {
    it('should validate consumer response strategies via byId and composed schema', () => {
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

    it('should reject consumer response strategies with empty strings', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidStrategies = [
        'CLI Tools: Display errors to console and exit with appropriate error codes',
        '', // Invalid empty string
        'Reporting Systems: Log events for analysis and alert on critical failures',
      ];

      expect(byId['7.3.2'].safeParse(invalidStrategies).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(invalidStrategies).success).toBe(false);
    });

    it('should reject empty consumer response strategies array', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyStrategies: any[] = [];

      expect(byId['7.3.2'].safeParse(emptyStrategies).success).toBe(false);
      expect(shape.consumerResponseStrategies.safeParse(emptyStrategies).success).toBe(false);
    });
  });

  describe('Error Recovery Section (7.3.3) - Both Plan & Task', () => {
    it('should validate error recovery via byId and composed schema', () => {
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

    it('should reject error recovery with empty strings', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidRecovery = [
        'Parser Level: Emit appropriate events for all error conditions',
        '', // Invalid empty string
        'System Level: Monitor event emission patterns for system health',
      ];

      expect(byId['7.3.3'].safeParse(invalidRecovery).success).toBe(false);
      expect(shape.errorRecovery.safeParse(invalidRecovery).success).toBe(false);
    });
  });
});

