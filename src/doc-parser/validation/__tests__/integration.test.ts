import { describe, it, expect } from 'vitest';
import {
  createBusinessScopeSchema,
  createPlanningDecompositionSchema,
  createReferenceSchema,
  getTaskSchema,
  getPlanSchema,
  getMetaGovernanceTaskSchema,
  getQualityOperationsTaskSchema,
} from '../index';

describe('Integration Tests', () => {
  describe('Valid Task Object', () => {
    it('should validate a fully valid task object', async () => {
      // Mock object that mimics the expected output of a real parser
      const validTaskObject = {
        metaGovernance: {
          status: {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          },
          priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
        },
        businessScope: {
          overview: {
            coreFunction: 'Create canonical Zod schemas for documentation validation',
            keyCapability: 'Validate parsed content structure of markdown sections',
            businessValue: 'Enable automated validation of documentation content',
          },
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'A validation library is available that can check the content of documentation files',
            },
            {
              id: 'DoD-2',
              criterion:
                "The library correctly identifies when a document's sections have missing or malformed information",
            },
            {
              id: 'DoD-3',
              criterion: 'The library can validate the structure of all tables, ensuring they have the right columns',
            },
            {
              id: 'DoD-4',
              criterion:
                'The library successfully flags documents that contain structural errors and confirms that valid documents pass without errors',
            },
            {
              id: 'DoD-5',
              criterion:
                'The validation logic for each of the 8 documentation families is organized separately for maintainability',
            },
          ],
        },
        planningDecomposition: {
          dependencies: [
            {
              id: 'D-1',
              dependencyOn: 'T28: Define Canonical Schema Interfaces',
              type: 'Internal',
              status: 'Complete',
              affectedPlansTasks: ['p1-p6.t32'],
              notes:
                'The base types for the schema definition itself are a prerequisite for creating strongly-typed content schemas',
            },
            {
              id: 'D-2',
              dependencyOn: 'A Markdown Parser (e.g., remark)',
              type: 'External',
              status: 'Complete',
              affectedPlansTasks: ['p1-p6.t32'],
              notes: 'The schemas must validate the output of the chosen parser',
            },
          ],
        },
        qualityOperations: {
          testingStrategyRequirements: {},
          unitIntegrationTests: [
            {
              id: 'TEST-01',
              scenario: 'Meta schema status validation',
              testType: 'Unit',
              toolsRunner: 'Vitest',
              notes: 'OK',
            },
          ],
          endToEndE2ETestingStrategy: [
            { id: 'E2E-01', scenario: 'Valid task end-to-end', testType: 'E2E', toolsRunner: 'Vitest', notes: 'OK' },
          ],
          configuration: [
            {
              id: 'CONFIG-01',
              settingName: 'schemaProvider',
              source: 'Injection',
              default: 'native',
              overrideMethod: 'ctor',
              notes: 'OK',
            },
          ],
          alertingResponse: {},
          eventBasedAlerting: [
            {
              id: 'ALERT-01',
              alertCondition: 'Parsing fails',
              eventType: 'parsing.failed',
              consumerResponse: 'Log',
              notes: 'Critical',
            },
          ],
          consumerResponseStrategies: ['CLI Tools: display errors'],
          errorRecovery: ['Parser Level: emit events'],
          localTestCommands: ['npm test'],
        },
        reference: {
          appendicesGlossary: {
            glossary: [
              {
                term: 'Zod',
                definition: 'The schema validation library used to define the content structure rules',
              },
              {
                term: 'AST (Abstract Syntax Tree)',
                definition: 'The tree representation of the parsed markdown content that the schemas will validate',
              },
              {
                term: 'Consumer',
                definition:
                  'Any tool or script that imports and uses this schema library for validation (e.g., a linter, a git-hook script)',
              },
            ],
          },
        },
      };

      // Test each family schema individually
      const metaGovernanceSchema = await getMetaGovernanceTaskSchema();
      const metaGovernanceResult = metaGovernanceSchema.safeParse(validTaskObject.metaGovernance);
      expect(metaGovernanceResult.success).toBe(true);

      const businessScopeSchema = createBusinessScopeSchema('task');
      const businessScopeResult = businessScopeSchema.safeParse(validTaskObject.businessScope);
      expect(businessScopeResult.success).toBe(true);

      const planningDecompositionSchema = createPlanningDecompositionSchema('task');
      const planningDecompositionResult = planningDecompositionSchema.safeParse(validTaskObject.planningDecomposition);
      expect(planningDecompositionResult.success).toBe(true);

      const qoSchema = getQualityOperationsTaskSchema();
      const qualityOperationsResult = qoSchema.safeParse(validTaskObject.qualityOperations);
      expect(qualityOperationsResult.success).toBe(true);

      const referenceSchema = createReferenceSchema('task');
      const referenceResult = referenceSchema.safeParse(validTaskObject.reference);
      expect(referenceResult.success).toBe(true);

      // Test the combined TaskSchema for end-to-end validation
      const taskSchema = await getTaskSchema();
      const combinedResult = taskSchema.safeParse(validTaskObject);
      expect(combinedResult.success).toBe(true);
    });
  });

  describe('Invalid Task Object', () => {
    it('should reject a task object with multiple structural errors', async () => {
      const invalidTaskObject = {
        metaGovernance: {
          status: {
            currentState: 'Invalid State', // Invalid enum
            priority: 'Low',
            progress: 150, // Out of range
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          },
          priorityDrivers: [], // Empty array
        },
        businessScope: {
          overview: {
            coreFunction: '', // Empty string
            keyCapability: 'Validate parsed content structure of markdown sections',
            businessValue: 'Enable automated validation of documentation content',
          },
        },
        // Missing required families like planningDecomposition, qualityOperations
      };

      const taskSchema = await getTaskSchema();
      const result = taskSchema.safeParse(invalidTaskObject);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        // Check for a few expected errors to confirm validation is working
        expect(issues.some((issue) => issue.path.includes('currentState'))).toBe(true);
        expect(issues.some((issue) => issue.path.includes('progress'))).toBe(true);
        expect(issues.some((issue) => issue.path.includes('priorityDrivers'))).toBe(true);
        expect(issues.some((issue) => issue.path.includes('coreFunction'))).toBe(true);
        expect(issues.some((issue) => issue.path.includes('planningDecomposition'))).toBe(true);
        expect(issues.some((issue) => issue.path.includes('qualityOperations'))).toBe(true);
      }
    });
  });

  describe('Valid Plan Object', () => {
    it('should validate a fully valid plan object', async () => {
      const validPlanObject = {
        metaGovernance: {
          status: {
            created: '2025-08-03 06:08',
            lastUpdated: '2025-08-03 06:08',
          },
          priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
        },
        businessScope: {
          overview: {
            coreFunction: 'Provides a validation engine for documentation content',
            keyCapability: 'Introduces a second tier of validation on final markdown documents',
            businessValue: 'Enforces runtime correctness and consistency of all documentation',
          },
          businessContext: 'Our current system lacks an enforcement mechanism.',
          coreBusinessRules: ['Focus on Content Rules', 'Zod as the Rule Definition Language'],
          userJourneys: [
            { name: 'Author writes doc', description: 'Author drafts doc in repo', diagram: 'graph TD A-->B' },
          ],
          userPersonas: [{ persona: 'Developer', goal: 'Ship correct docs' }],
          userStories: ['As a developer, I want validation so that docs are consistent.'],
          successCriteria: ['A comprehensive library of Zod schemas is created.'],
          inScope: ['Defining and maintaining a comprehensive library of Zod schemas'],
          outOfScope: ['The implementation of any tool that consumes these schemas'],
          coreBusinessProcesses: [
            {
              name: 'Validation CI',
              participants: 'Repo, CI',
              goal: 'Validate docs on PR',
              workflow: ['checkout', 'validate', 'report'],
            },
          ],
        },
        planningDecomposition: {
          roadmapInFocusItems: [
            {
              id: 'T32',
              childPlanTask: '[Define Section Content Schemas](./p1-p6.t32-define-section-content-schemas.task.md)',
              priority: 'High',
              priorityDrivers: ['TEC-Prod_Stability_Blocker'],
              status: 'Not Started',
              dependsOn: 'T28',
              summary: 'Create the Zod schemas that define the expected content for each section.',
            },
          ],
          dependencies: [
            {
              id: 'D-1',
              dependencyOn: '[Canonical Schema Interfaces](./p1.t28-define-schema-types.task.md)',
              type: 'Internal',
              status: 'In Progress',
              affectedPlansTasks: ['T32'],
              notes: 'The base types for the schema definition itself are a prerequisite for creating content schemas.',
            },
          ],
          backlogIcebox: [{ name: 'Reporting Plan', reason: 'Deferred to Q4 due to dependency on analytics service' }],
          decompositionGraph: {
            diagram:
              'graph TD\nsubgraph "P6: Doc Content Validator"\n T32["T32: Define Section Content Schemas"]\n T33["T33: Statically Generate Composed Schemas"]\nend\n\nT32 --> T33',
          },
        },
        qualityOperations: {
          testingStrategyRequirements: {},
          unitIntegrationTests: [
            {
              id: 'SC-3',
              scenario: 'A schema successfully parses a valid, compliant content object.',
              testType: 'Unit',
              toolsRunner: 'Vitest',
              notes: 'For each schema, provide a "golden path" test case with a perfect example of the content.',
            },
          ],
          endToEndE2ETestingStrategy: [
            { id: 'E2E-01', scenario: 'End-to-end happy path', testType: 'E2E', toolsRunner: 'Vitest', notes: 'OK' },
          ],
          configuration: [
            {
              id: 'CONFIG-01',
              settingName: 'schemaProvider',
              source: 'Injection',
              default: 'native',
              overrideMethod: 'ctor',
              notes: 'OK',
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
          deploymentSteps: ['Deployment of this library is handled as part of the parent `ddd-tools` npm package.'],
        },
      };

      const planSchema = await getPlanSchema();
      const result = planSchema.safeParse(validPlanObject);
      expect(result.success).toBe(true);
    });
  });
});
