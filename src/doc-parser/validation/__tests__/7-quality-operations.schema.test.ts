import { describe, it, expect } from 'vitest';
import {
  QualityOperationsFamilySchema,
  TestingStrategySchema,
  ConfigurationSchema,
  AlertingResponseSchema,
  DeploymentStepsSchema,
  LocalTestCommandsSchema,
} from '../7-quality-operations.schema.js';

describe('Quality & Operations Schema Validation', () => {
  describe('Testing Strategy Schema', () => {
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

      const result = TestingStrategySchema.safeParse(validTestingStrategy);
      expect(result.success).toBe(true);
    });

    it('should reject testing strategy with missing AC ID', () => {
      const invalidTestingStrategy = [
        {
          dodLink: 'DoD-2',
          scenario: 'Unit test for metaGovernanceSchema',
          testType: 'Unit',
          testFile: '1-meta-governance.schema.test.ts',
        },
      ];

      const result = TestingStrategySchema.safeParse(invalidTestingStrategy);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('acId');
      }
    });

    it('should reject testing strategy with invalid test type', () => {
      const invalidTestingStrategy = [
        {
          acId: 'AC-1',
          dodLink: 'DoD-2',
          scenario: 'Unit test for metaGovernanceSchema',
          testType: 'InvalidType',
          testFile: '1-meta-governance.schema.test.ts',
        },
      ];

      const result = TestingStrategySchema.safeParse(invalidTestingStrategy);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('testType');
      }
    });

    it('should reject testing strategy with empty scenario', () => {
      const invalidTestingStrategy = [
        {
          acId: 'AC-1',
          dodLink: 'DoD-2',
          scenario: '',
          testType: 'Unit',
          testFile: '1-meta-governance.schema.test.ts',
        },
      ];

      const result = TestingStrategySchema.safeParse(invalidTestingStrategy);
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
          settingName: 'analyzerApiEndpoint',
          planDependency: 'p1-analyzer',
          source: 'ddd.config.json',
          overrideMethod: 'DDD_ANALYZER_API_ENDPOINT (Environment Var)',
          notes: '(Required) The URL of the external service for status reporting.',
        },
        {
          settingName: 'logLevel',
          planDependency: '(All)',
          source: 'ddd.config.json',
          overrideMethod: 'DDD_LOG_LEVEL (Environment Variable)',
          notes: 'info (default), debug, warn, error. Controls logging verbosity.',
        },
      ];

      const result = ConfigurationSchema.safeParse(validConfiguration);
      expect(result.success).toBe(true);
    });

    it('should reject configuration with missing setting name', () => {
      const invalidConfiguration = [
        {
          planDependency: 'p1-analyzer',
          source: 'ddd.config.json',
          overrideMethod: 'DDD_ANALYZER_API_ENDPOINT (Environment Var)',
          notes: '(Required) The URL of the external service for status reporting.',
        },
      ];

      const result = ConfigurationSchema.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('settingName');
      }
    });

    it('should reject configuration with empty source', () => {
      const invalidConfiguration = [
        {
          settingName: 'analyzerApiEndpoint',
          planDependency: 'p1-analyzer',
          source: '',
          overrideMethod: 'DDD_ANALYZER_API_ENDPOINT (Environment Var)',
          notes: '(Required) The URL of the external service for status reporting.',
        },
      ];

      const result = ConfigurationSchema.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('source');
      }
    });
  });

  describe('Alerting & Response Schema', () => {
    it('should validate a complete alerting and response table', () => {
      const validAlertingResponse = [
        {
          errorCondition: 'Internal Script Failure',
          relevantPlans: 'All',
          responsePlan:
            'Abort the git commit with a non-zero exit code. Print the error stack trace directly to the console.',
          status: 'Not Started',
        },
        {
          errorCondition: 'External API Non-2xx Response',
          relevantPlans: 'p1-analyzer',
          responsePlan: "Abort the git commit with a non-zero exit code. Log the API's error response to the console.",
          status: 'Not Started',
        },
      ];

      const result = AlertingResponseSchema.safeParse(validAlertingResponse);
      expect(result.success).toBe(true);
    });

    it('should reject alerting response with missing error condition', () => {
      const invalidAlertingResponse = [
        {
          relevantPlans: 'All',
          responsePlan: 'Abort the git commit with a non-zero exit code.',
          status: 'Not Started',
        },
      ];

      const result = AlertingResponseSchema.safeParse(invalidAlertingResponse);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('errorCondition');
      }
    });

    it('should reject alerting response with invalid status', () => {
      const invalidAlertingResponse = [
        {
          errorCondition: 'Internal Script Failure',
          relevantPlans: 'All',
          responsePlan: 'Abort the git commit with a non-zero exit code.',
          status: 'Invalid Status',
        },
      ];

      const result = AlertingResponseSchema.safeParse(invalidAlertingResponse);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('status');
      }
    });

    it('should reject alerting response with empty response plan', () => {
      const invalidAlertingResponse = [
        {
          errorCondition: 'Internal Script Failure',
          relevantPlans: 'All',
          responsePlan: '',
          status: 'Not Started',
        },
      ];

      const result = AlertingResponseSchema.safeParse(invalidAlertingResponse);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('responsePlan');
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

      const result = DeploymentStepsSchema.safeParse(validDeploymentSteps);
      expect(result.success).toBe(true);
    });

    it('should reject deployment steps with empty strings', () => {
      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        '',
        'Promote the build to production.',
      ];

      const result = DeploymentStepsSchema.safeParse(invalidDeploymentSteps);
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

      const result = DeploymentStepsSchema.safeParse(invalidDeploymentSteps);
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

      const result = LocalTestCommandsSchema.safeParse(validLocalTestCommands);
      expect(result.success).toBe(true);
    });

    it('should reject local test commands with empty strings', () => {
      const invalidLocalTestCommands = [
        'npm test -- --coverage src/doc-parser/validation/',
        '',
        'npm run test:integration',
      ];

      const result = LocalTestCommandsSchema.safeParse(invalidLocalTestCommands);
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

      const result = LocalTestCommandsSchema.safeParse(invalidLocalTestCommands);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain(1);
      }
    });
  });

  describe('Quality Operations Schema (Main Schema)', () => {
    it('should validate a complete quality operations object', () => {
      const validQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: 'Unit test for metaGovernanceSchema',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
        configuration: [
          {
            settingName: 'analyzerApiEndpoint',
            planDependency: 'p1-analyzer',
            source: 'ddd.config.json',
            overrideMethod: 'DDD_ANALYZER_API_ENDPOINT (Environment Var)',
            notes: '(Required) The URL of the external service for status reporting.',
          },
        ],
        alertingResponse: [
          {
            errorCondition: 'Internal Script Failure',
            relevantPlans: 'All',
            responsePlan: 'Abort the git commit with a non-zero exit code.',
            status: 'Not Started',
          },
        ],
        deploymentSteps: [
          'Run database migrations: yarn db:migrate',
          'Update environment variables in Vercel dashboard.',
        ],
        localTestCommands: ['npm test -- --coverage src/doc-parser/validation/', 'npm run test:unit'],
      };

      const result = QualityOperationsFamilySchema.safeParse(validQualityOperations);
      expect(result.success).toBe(true);
    });

    it('should validate quality operations with only required fields', () => {
      const minimalQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: 'Unit test for metaGovernanceSchema',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
      };

      const result = QualityOperationsFamilySchema.safeParse(minimalQualityOperations);
      expect(result.success).toBe(true);
    });

    it('should reject quality operations with invalid testing strategy', () => {
      const invalidQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: '',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
      };

      const result = QualityOperationsFamilySchema.safeParse(invalidQualityOperations);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('testingStrategy');
      }
    });

    it('should reject quality operations with invalid configuration', () => {
      const invalidQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: 'Unit test for metaGovernanceSchema',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
        configuration: [
          {
            settingName: '',
            planDependency: 'p1-analyzer',
            source: 'ddd.config.json',
            overrideMethod: 'DDD_ANALYZER_API_ENDPOINT (Environment Var)',
            notes: '(Required) The URL of the external service for status reporting.',
          },
        ],
      };

      const result = QualityOperationsFamilySchema.safeParse(invalidQualityOperations);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('configuration');
      }
    });

    it('should reject quality operations with invalid alerting response', () => {
      const invalidQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: 'Unit test for metaGovernanceSchema',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
        alertingResponse: [
          {
            errorCondition: 'Internal Script Failure',
            relevantPlans: 'All',
            responsePlan: '',
            status: 'Not Started',
          },
        ],
      };

      const result = QualityOperationsFamilySchema.safeParse(invalidQualityOperations);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('alertingResponse');
      }
    });

    it('should reject quality operations with invalid deployment steps', () => {
      const invalidQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: 'Unit test for metaGovernanceSchema',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
        deploymentSteps: ['Run database migrations: yarn db:migrate', '', 'Promote the build to production.'],
      };

      const result = QualityOperationsFamilySchema.safeParse(invalidQualityOperations);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('deploymentSteps');
      }
    });

    it('should reject quality operations with invalid local test commands', () => {
      const invalidQualityOperations = {
        testingStrategy: [
          {
            acId: 'AC-1',
            dodLink: 'DoD-2',
            scenario: 'Unit test for metaGovernanceSchema',
            testType: 'Unit',
            testFile: '1-meta-governance.schema.test.ts',
          },
        ],
        localTestCommands: ['npm test -- --coverage src/doc-parser/validation/', '', 'npm run test:integration'],
      };

      const result = QualityOperationsFamilySchema.safeParse(invalidQualityOperations);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('localTestCommands');
      }
    });
  });
});
