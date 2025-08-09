import { describe, it, expect } from 'vitest';
import {
  createQualityOperationsSchema,
  getQualityOperationsPlanSchema,
  getQualityOperationsTaskSchema,
} from '../7-quality-operations.schema.js';

describe('Quality & Operations Schema Validation', () => {
  describe('Testing Strategy Schema (unitIntegrationTests)', () => {
    it('should validate a complete testing strategy table', () => {
      const validTestingStrategy = [
        {
          acId: 'AC-1',
          dodLink: 'DoD-2',
          scenario: 'Unit test for metaGovernanceSchema (valid and invalid Status)',
          testType: 'Unit',
          testFile: '1-meta-governance.schema.test.ts',
        },
        {
          acId: 'AC-2',
          dodLink: 'DoD-3',
          scenario: 'Unit test for businessScopeSchema (valid and invalid DoD table)',
          testType: 'Unit',
          testFile: '2-business-scope.schema.test.ts',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const validRows = [
        { id: 'TEST-01', scenario: 'Unit test for parser', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' },
        {
          id: 'TEST-02',
          scenario: 'Integration test for generator',
          testType: 'Integration',
          toolsRunner: 'Vitest',
          notes: 'N',
        },
      ];
      const result = anyShape.unitIntegrationTests.safeParse(validRows);
      expect(result.success).toBe(true);
    });

    it('should reject testing strategy with missing AC ID', () => {
      const invalidRows = [
        {
          // id missing
          scenario: 'Unit test for parser',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.unitIntegrationTests.safeParse(invalidRows);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('should reject testing strategy with invalid test type', () => {
      const invalidRows = [
        {
          id: 'TEST-01',
          scenario: 'Unit test for parser',
          testType: 'InvalidType',
          toolsRunner: 'Vitest',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.unitIntegrationTests.safeParse(invalidRows);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('testType');
      }
    });

    it('should reject testing strategy with empty scenario', () => {
      const invalidRows = [
        {
          id: 'TEST-01',
          scenario: '',
          testType: 'Unit',
          toolsRunner: 'Vitest',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.unitIntegrationTests.safeParse(invalidRows);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('scenario');
      }
    });
  });

  describe('Configuration Schema', () => {
    it('should validate a complete configuration table', () => {
      const validConfiguration = [
        {
          id: 'CONFIG-01',
          settingName: 'schemaProvider',
          source: 'Injection',
          default: 'native',
          overrideMethod: 'ctor',
          notes: 'N',
        },
        {
          id: 'CONFIG-02',
          settingName: 'logLevel',
          source: 'ddd.config.json',
          default: 'info',
          overrideMethod: 'env',
          notes: 'Controls logging verbosity.',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.configuration.safeParse(validConfiguration);
      expect(result.success).toBe(true);
    });

    it('should reject configuration with missing setting name', () => {
      const invalidConfiguration = [
        {
          id: 'CONFIG-01',
          // settingName missing
          source: 'Injection',
          default: 'native',
          overrideMethod: 'ctor',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.configuration.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('settingName');
      }
    });

    it('should reject configuration with empty source', () => {
      const invalidConfiguration = [
        {
          id: 'CONFIG-01',
          settingName: 'schemaProvider',
          source: '',
          default: 'native',
          overrideMethod: 'ctor',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.configuration.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('source');
      }
    });
  });

  describe('Event-Based Alerting Schema', () => {
    it('should validate a complete alerting and response table', () => {
      const validEventAlerts = [
        {
          id: 'ALERT-01',
          alertCondition: 'Parsing fails',
          eventType: 'parsing.failed',
          consumerResponse: 'Log',
          notes: 'N',
        },
        {
          id: 'ALERT-02',
          alertCondition: 'Validation fails',
          eventType: 'validation.failed',
          consumerResponse: 'Display error',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.eventBasedAlerting.safeParse(validEventAlerts);
      expect(result.success).toBe(true);
    });

    it('should reject alerting response with missing error condition', () => {
      const invalidEventAlerts = [
        {
          id: 'ALERT-01',
          // alertCondition missing
          eventType: 'parsing.failed',
          consumerResponse: 'Log',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.eventBasedAlerting.safeParse(invalidEventAlerts);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('alertCondition');
      }
    });

    it('should reject event-based alerting with invalid eventType', () => {
      const invalidEventAlerts = [
        {
          id: 'ALERT-01',
          alertCondition: 'Parsing fails',
          eventType: 123 as unknown as string,
          consumerResponse: 'Log',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.eventBasedAlerting.safeParse(invalidEventAlerts);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('eventType');
      }
    });

    it('should reject event-based alerting with empty consumerResponse', () => {
      const invalidEventAlerts = [
        {
          id: 'ALERT-01',
          alertCondition: 'Parsing fails',
          eventType: 'parsing.failed',
          consumerResponse: '',
          notes: 'N',
        },
      ];

      const anyShape = createQualityOperationsSchema('plan').shape as any;
      const result = anyShape.eventBasedAlerting.safeParse(invalidEventAlerts);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('consumerResponse');
      }
    });
  });

  describe('Deployment Steps Schema', () => {
    it('should validate deployment steps for plans', () => {
      const validDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        'Update environment variables in Vercel dashboard.',
        'Promote the build to production.',
      ];

      const planShape = createQualityOperationsSchema('plan').shape as any;
      const result = planShape.deploymentSteps.safeParse(validDeploymentSteps);
      expect(result.success).toBe(true);
    });

    it('should reject deployment steps with empty strings', () => {
      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        '',
        'Promote the build to production.',
      ];

      const planShape = createQualityOperationsSchema('plan').shape as any;
      const result = planShape.deploymentSteps.safeParse(invalidDeploymentSteps);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain(1);
      }
    });

    it('should reject deployment steps with non-string items', () => {
      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        123,
        'Promote the build to production.',
      ];

      const planShape = createQualityOperationsSchema('plan').shape as any;
      const result = planShape.deploymentSteps.safeParse(invalidDeploymentSteps);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain(1);
      }
    });
  });

  describe('Local Test Commands Schema', () => {
    it('should validate local test commands for tasks', () => {
      const validLocalTestCommands = [
        'npm test -- --coverage src/doc-parser/validation/',
        'npm run test:unit',
        'npm run test:integration',
      ];

      const taskShape = createQualityOperationsSchema('task').shape as any;
      const result = taskShape.localTestCommands.safeParse(validLocalTestCommands);
      expect(result.success).toBe(true);
    });

    it('should reject local test commands with empty strings', () => {
      const invalidLocalTestCommands = [
        'npm test -- --coverage src/doc-parser/validation/',
        '',
        'npm run test:integration',
      ];

      const taskShape = createQualityOperationsSchema('task').shape as any;
      const result = taskShape.localTestCommands.safeParse(invalidLocalTestCommands);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain(1);
      }
    });

    it('should reject local test commands with non-string items', () => {
      const invalidLocalTestCommands = [
        'npm test -- --coverage src/doc-parser/validation/',
        null,
        'npm run test:integration',
      ];

      const taskShape = createQualityOperationsSchema('task').shape as any;
      const result = taskShape.localTestCommands.safeParse(invalidLocalTestCommands);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain(1);
      }
    });
  });

  describe('Quality Operations Schema (Main Schema)', () => {
    it('should validate a complete quality operations object (plan)', () => {
      const plan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Deploy step 1'],
      };

      const family = createQualityOperationsSchema('plan');
      const result = family.safeParse(plan);
      expect(result.success).toBe(true);
    });

    it('should validate plan with minimal valid content per applicability', () => {
      const minimalPlan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Deploy step 1'],
      };

      const family = createQualityOperationsSchema('plan');
      const result = family.safeParse(minimalPlan);
      expect(result.success).toBe(true);
    });

    it('should reject quality operations with invalid testing strategy', () => {
      const invalidPlan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: '', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Deploy step 1'],
      } as unknown as Record<string, unknown>;

      const family = createQualityOperationsSchema('plan');
      const result = family.safeParse(invalidPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('unitIntegrationTests');
      }
    });

    it('should reject quality operations with invalid configuration', () => {
      const invalidPlan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: '',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Deploy step 1'],
      } as unknown as Record<string, unknown>;

      const family = createQualityOperationsSchema('plan');
      const result = family.safeParse(invalidPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('configuration');
      }
    });

    it('should reject quality operations with invalid alerting response', () => {
      const invalidPlan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: '',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Deploy step 1'],
      } as unknown as Record<string, unknown>;

      const family = createQualityOperationsSchema('plan');
      const result = family.safeParse(invalidPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('eventBasedAlerting');
      }
    });

    it('should reject quality operations with invalid deployment steps', () => {
      const invalidPlan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Run database migrations: yarn db:migrate', '', 'Promote the build to production.'],
      } as unknown as Record<string, unknown>;

      const family = createQualityOperationsSchema('plan');
      const result = family.safeParse(invalidPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('deploymentSteps');
      }
    });

    it('should reject quality operations with invalid local test commands', () => {
      const invalidTask = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        localTestCommands: ['npm test -- --coverage src/doc-parser/validation/', '', 'npm run test:integration'],
      } as unknown as Record<string, unknown>;

      const family = createQualityOperationsSchema('task');
      const result = family.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('localTestCommands');
      }
    });
  });

  describe('Family factory (docType-specific schemas)', () => {
    it('plan schema: requires plan-only sections and omits task-only sections', () => {
      const planSchema = getQualityOperationsPlanSchema();

      const validPlan = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        deploymentSteps: ['Deploy step 1'],
      };
      const planResult = planSchema.safeParse(validPlan);
      if (!planResult.success) {
        // eslint-disable-next-line no-console
        console.log('Plan schema parse error:', planResult.error.flatten());
      }
      expect(planResult.success).toBe(true);

      const invalidPlanWithTask = {
        ...validPlan,
        localTestCommands: ['npm test'],
      } as unknown as Record<string, unknown>;
      expect(planSchema.safeParse(invalidPlanWithTask).success).toBe(false);
    });

    it('task schema: requires task-only sections and omits plan-only sections', () => {
      const taskSchema = getQualityOperationsTaskSchema();

      const validTask = {
        testingStrategyRequirements: {},
        unitIntegrationTests: [{ id: 'TEST-01', scenario: 'X', testType: 'Unit', toolsRunner: 'Vitest', notes: 'N' }],
        endToEndE2ETestingStrategy: [
          { id: 'E2E-01', scenario: 'Y', testType: 'E2E', toolsRunner: 'Vitest', notes: 'N' },
        ],
        configuration: [
          {
            id: 'CONFIG-01',
            settingName: 'schemaProvider',
            source: 'Injection',
            default: 'native',
            overrideMethod: 'ctor',
            notes: 'N',
          },
        ],
        alertingResponse: {},
        eventBasedAlerting: [
          {
            id: 'ALERT-01',
            alertCondition: 'Parsing fails',
            eventType: 'parsing.failed',
            consumerResponse: 'Log',
            notes: 'N',
          },
        ],
        consumerResponseStrategies: ['CLI Tools: display errors'],
        errorRecovery: ['Parser Level: emit events'],
        localTestCommands: ['npm test'],
      };
      const taskResult = taskSchema.safeParse(validTask);
      if (!taskResult.success) {
        // eslint-disable-next-line no-console
        console.log('Task schema parse error:', taskResult.error.flatten());
      }
      expect(taskResult.success).toBe(true);

      const invalidTaskWithPlan = {
        ...validTask,
        deploymentSteps: ['Deploy step 1'],
      } as unknown as Record<string, unknown>;
      expect(taskSchema.safeParse(invalidTaskWithPlan).success).toBe(false);
    });
  });
});
