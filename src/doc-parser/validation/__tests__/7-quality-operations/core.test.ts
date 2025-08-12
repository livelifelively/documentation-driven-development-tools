import { describe, it, expect } from 'vitest';
import {
  createQualityOperationsSchema,
  getQualityOperationsPlanSchema,
  getQualityOperationsTaskSchema,
} from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createQualityOperationsSchema', () => {
      it('should create plan schema with byId registration', () => {
        const planSchema = createQualityOperationsSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(typeof byId).toBe('object');
        expect(Object.keys(byId).length).toBeGreaterThan(0);

        // Verify key sections are registered
        expect(byId['7.1']).toBeDefined();
        expect(byId['7.1.1']).toBeDefined();
        expect(byId['7.1.2']).toBeDefined();
        expect(byId['7.2']).toBeDefined();
        expect(byId['7.3']).toBeDefined();
        expect(byId['7.3.1']).toBeDefined();
        expect(byId['7.3.2']).toBeDefined();
        expect(byId['7.3.3']).toBeDefined();
        expect(byId['7.4']).toBeDefined();

        // Task-only sections should NOT be in plan byId
        expect(byId['7.5']).toBeUndefined();
      });

      it('should create task schema with byId registration', () => {
        const taskSchema = createQualityOperationsSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(typeof byId).toBe('object');
        expect(Object.keys(byId).length).toBeGreaterThan(0);

        // Verify key sections are registered
        expect(byId['7.1']).toBeDefined();
        expect(byId['7.1.1']).toBeDefined();
        expect(byId['7.1.2']).toBeDefined();
        expect(byId['7.2']).toBeDefined();
        expect(byId['7.3']).toBeDefined();
        expect(byId['7.3.1']).toBeDefined();
        expect(byId['7.3.2']).toBeDefined();
        expect(byId['7.3.3']).toBeDefined();
        expect(byId['7.5']).toBeDefined();

        // Plan-only sections should NOT be in task byId
        expect(byId['7.4']).toBeUndefined();
      });

      it('should validate complete plan document', () => {
        const planSchema = createQualityOperationsSchema('plan');

        const validPlanDocument = {
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
          consumerResponseStrategies: [
            'CLI Tools: Display errors to console and exit with appropriate error codes',
            'Git Hooks: Block commits and display validation errors to user',
          ],
          errorRecovery: [
            'Parser Level: Emit appropriate events for all error conditions',
            'Consumer Level: Implement retry logic, fallback mechanisms, and user feedback',
          ],
          deploymentSteps: [
            'Run database migrations: yarn db:migrate',
            'Update environment variables in Vercel dashboard.',
            'Promote the build to production.',
          ],
        };

        const result = planSchema.safeParse(validPlanDocument);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const taskSchema = createQualityOperationsSchema('task');

        const validTaskDocument = {
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
          consumerResponseStrategies: [
            'CLI Tools: Display errors to console and exit with appropriate error codes',
            'Git Hooks: Block commits and display validation errors to user',
          ],
          errorRecovery: [
            'Parser Level: Emit appropriate events for all error conditions',
            'Consumer Level: Implement retry logic, fallback mechanisms, and user feedback',
          ],
          localTestCommands: ['npm test', 'npm run test:watch', 'npm run test:coverage'],
        };

        const result = taskSchema.safeParse(validTaskDocument);
        expect(result.success).toBe(true);
      });

      describe('Convenience Functions', () => {
        it('should create plan schema via convenience function', () => {
          const planSchema = getQualityOperationsPlanSchema();
          expect(planSchema).toBeDefined();
          expect(typeof planSchema.parse).toBe('function');

          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          expect(byId).toBeDefined();
          expect(byId['7.4']).toBeDefined(); // Plan-only section
          expect(byId['7.5']).toBeUndefined(); // Task-only section
        });

        it('should create task schema via convenience function', () => {
          const taskSchema = getQualityOperationsTaskSchema();
          expect(taskSchema).toBeDefined();
          expect(typeof taskSchema.parse).toBe('function');

          const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          expect(byId).toBeDefined();
          expect(byId['7.5']).toBeDefined(); // Task-only section
          expect(byId['7.4']).toBeUndefined(); // Plan-only section
        });
      });

      describe('byId Index Verification', () => {
        it('should allow independent section validation via byId', () => {
          const planSchema = createQualityOperationsSchema('plan');
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

          const validUnitTests = [
            {
              id: 'TEST-01',
              scenario: 'Unit test for parser',
              testType: 'Unit',
              toolsRunner: 'Vitest',
              notes: 'Ensure the event is emitted with appropriate error context.',
            },
          ];

          const result = byId['7.1.1'].safeParse(validUnitTests);
          expect(result.success).toBe(true);
        });

        it('should reject invalid data via byId', () => {
          const planSchema = createQualityOperationsSchema('plan');
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

          const invalidUnitTests = [
            {
              id: 'TEST-01',
              scenario: '', // Invalid empty scenario
              testType: 'Unit',
              toolsRunner: 'Vitest',
              notes: 'Ensure the event is emitted with appropriate error context.',
            },
          ];

          const result = byId['7.1.1'].safeParse(invalidUnitTests);
          expect(result.success).toBe(false);
        });
      });
    });
  });
});

