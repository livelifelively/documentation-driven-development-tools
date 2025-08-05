import { describe, it, expect } from 'vitest';
import {
  createBusinessScopeSchema,
  getBusinessScopeTaskSchema,
  getBusinessScopePlanSchema,
  OverviewPlanSchema,
  BusinessContextPlanSchema,
  UserJourneyPlanSchema,
  UserPersonasPlanSchema,
  CoreBusinessRulesPlanSchema,
  UserStoriesPlanSchema,
  SuccessCriteriaPlanSchema,
  DefinitionOfDonePlanSchema,
  InScopePlanSchema,
  OutOfScopePlanSchema,
  BusinessProcessPlanSchema,
  BusinessScopeFamilyPlanSchema,
  OverviewTaskSchema,
  BusinessContextTaskSchema,
  UserJourneyTaskSchema,
  UserPersonasTaskSchema,
  CoreBusinessRulesTaskSchema,
  UserStoriesTaskSchema,
  SuccessCriteriaTaskSchema,
  DefinitionOfDoneTaskSchema,
  InScopeTaskSchema,
  OutOfScopeTaskSchema,
  BusinessProcessTaskSchema,
  BusinessScopeFamilyTaskSchema,
} from '../2-business-scope.schema';

describe('Business & Scope Schema Validation', () => {
  describe('Factory Function Tests', () => {
    describe('createBusinessScopeSchema', () => {
      it('should create plan schema with all required sections', () => {
        const planSchema = createBusinessScopeSchema('plan');
        const validPlanData = {
          overview: {
            coreFunction: 'Implements a robust, multi-level logging system',
            keyCapability: 'Ensures operational errors and business events are captured',
            businessValue: 'Enables proactive issue resolution and performance analysis',
          },
          businessContext: 'Currently, pipeline failures are opaque, requiring developers to manually inspect logs.',
          userJourneys: [
            {
              name: 'Analyst Processes a New Document',
              description: 'This journey describes the end-to-end path for a data analyst',
              diagram: 'graph\nA("Start") --> B["Selects Document"];',
            },
          ],
          userPersonas: [
            {
              persona: 'Data Analyst',
              goal: 'Process documents efficiently and accurately',
            },
          ],
          coreBusinessRules: ['All documents must be validated before processing'],
          userStories: ['As a data analyst, I want to process documents automatically'],
          successCriteria: ['Processing time reduced by 50%'],
          inScope: ['Logging system implementation'],
          outOfScope: ['UI redesign'],
          coreBusinessProcesses: [
            {
              name: 'Document Processing',
              participants: 'Data Analyst, System',
              goal: 'Process documents efficiently',
              workflow: ['Upload document', 'Validate content', 'Process data'],
            },
          ],
        };

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });

      it('should create task schema with task-specific sections', () => {
        const taskSchema = createBusinessScopeSchema('task');
        const validTaskData = {
          overview: {
            coreFunction: 'Create Zod schemas for document validation',
            keyCapability: 'Produces TypeScript files with Zod schemas',
            businessValue: 'Enables automated validation of documentation content',
          },
          coreBusinessRules: ['All schemas must be properly validated'],
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'All schemas pass validation tests',
            },
            {
              id: 'DoD-2',
              criterion: 'Documentation is updated',
            },
          ],
        };

        const result = taskSchema.safeParse(validTaskData);
        expect(result.success).toBe(true);
      });

      it('should omit plan-specific sections from task schema', () => {
        const taskSchema = createBusinessScopeSchema('task');

        // Test that validation passes with only task-specific sections
        const validTaskData = {
          overview: {
            coreFunction: 'Create Zod schemas',
            keyCapability: 'Produces TypeScript files',
            businessValue: 'Enables automated validation',
          },
          coreBusinessRules: ['All schemas must be properly validated'],
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'All schemas pass validation tests',
            },
          ],
        };

        const validResult = taskSchema.safeParse(validTaskData);
        expect(validResult.success).toBe(true);

        // Verify that the schema shape only includes task-specific sections
        const schemaShape = taskSchema.shape;
        expect(schemaShape).toHaveProperty('overview');
        expect(schemaShape).toHaveProperty('coreBusinessRules');
        expect(schemaShape).toHaveProperty('definitionOfDone');
        expect(schemaShape).not.toHaveProperty('businessContext');
        expect(schemaShape).not.toHaveProperty('userJourneys');
        expect(schemaShape).not.toHaveProperty('successCriteria');
      });

      it('should omit task-specific sections from plan schema', () => {
        const planSchema = createBusinessScopeSchema('plan');

        // Test that validation passes with only plan-specific sections
        const validPlanData = {
          overview: {
            coreFunction: 'Implements logging system',
            keyCapability: 'Captures operational errors',
            businessValue: 'Enables proactive resolution',
          },
          businessContext: 'Currently, pipeline failures are opaque',
          userJourneys: [
            {
              name: 'Analyst Processes Document',
              description: 'This journey describes the end-to-end path',
              diagram: 'graph\nA --> B;',
            },
          ],
          userPersonas: [
            {
              persona: 'Data Analyst',
              goal: 'Process documents efficiently',
            },
          ],
          coreBusinessRules: ['All documents must be validated'],
          userStories: ['As a data analyst, I want to process documents'],
          successCriteria: ['Processing time reduced by 50%'],
          boundariesScope: {},
          inScope: ['Logging system implementation'],
          outOfScope: ['UI redesign'],
          coreBusinessProcesses: [
            {
              name: 'Document Processing',
              participants: 'Data Analyst, System',
              goal: 'Process documents efficiently',
              workflow: ['Upload document', 'Process data'],
            },
          ],
        };

        const validResult = planSchema.safeParse(validPlanData);
        expect(validResult.success).toBe(true);

        // Verify that the schema shape only includes plan-specific sections
        const schemaShape = planSchema.shape;
        expect(schemaShape).toHaveProperty('overview');
        expect(schemaShape).toHaveProperty('businessContext');
        expect(schemaShape).toHaveProperty('userJourneys');
        expect(schemaShape).toHaveProperty('successCriteria');
        expect(schemaShape).not.toHaveProperty('definitionOfDone');
      });
    });

    describe('Convenience Functions', () => {
      it('should create task schema via convenience function', () => {
        const taskSchema = getBusinessScopeTaskSchema();
        const validTaskData = {
          overview: {
            coreFunction: 'Create Zod schemas',
            keyCapability: 'Produces TypeScript files',
            businessValue: 'Enables automated validation',
          },
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'All schemas pass validation tests',
            },
          ],
        };

        const result = taskSchema.safeParse(validTaskData);
        expect(result.success).toBe(true);
      });

      it('should create plan schema via convenience function', () => {
        const planSchema = getBusinessScopePlanSchema();
        const validPlanData = {
          overview: {
            coreFunction: 'Implements logging system',
            keyCapability: 'Captures operational errors',
            businessValue: 'Enables proactive resolution',
          },
          businessContext: 'Currently, pipeline failures are opaque',
          userJourneys: [
            {
              name: 'Analyst Processes Document',
              description: 'This journey describes the end-to-end path',
              diagram: 'graph\nA --> B;',
            },
          ],
          userPersonas: [
            {
              persona: 'Data Analyst',
              goal: 'Process documents efficiently',
            },
          ],
          coreBusinessRules: ['All documents must be validated'],
          userStories: ['As a data analyst, I want to process documents'],
          successCriteria: ['Processing time reduced by 50%'],
          boundariesScope: {},
          inScope: ['Logging system implementation'],
          outOfScope: ['UI redesign'],
          coreBusinessProcesses: [
            {
              name: 'Document Processing',
              participants: 'Data Analyst, System',
              goal: 'Process documents efficiently',
              workflow: ['Upload document', 'Process data'],
            },
          ],
        };

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Individual Section Tests', () => {
    describe('Plan-Specific Section Tests', () => {
      describe('Overview Schema (Plan)', () => {
        it('should validate a complete overview', () => {
          const overviewSchema = createBusinessScopeSchema('plan').shape.overview;
          const validOverview = {
            coreFunction:
              'This task is to create the canonical Zod schemas that define the expected content structure for each section within a *.plan.md or *.task.md document.',
            keyCapability:
              'It will produce one or more *.ts files that export Zod schemas for validating the parsed content of markdown sections.',
            businessValue:
              'Enables automated validation of documentation content, guaranteeing that all documents are structurally correct and can be reliably parsed by tools and LLMs.',
          };

          const result = overviewSchema.safeParse(validOverview);
          expect(result.success).toBe(true);
        });

        it('should reject overview with missing core function', () => {
          const overviewSchema = createBusinessScopeSchema('plan').shape.overview;
          const invalidOverview = {
            keyCapability: 'It will produce one or more *.ts files that export Zod schemas.',
            businessValue: 'Enables automated validation of documentation content.',
          };

          const result = overviewSchema.safeParse(invalidOverview);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('coreFunction');
          }
        });

        it('should reject overview with empty strings', () => {
          const overviewSchema = createBusinessScopeSchema('plan').shape.overview;
          const invalidOverview = {
            coreFunction: '',
            keyCapability: 'It will produce one or more *.ts files that export Zod schemas.',
            businessValue: 'Enables automated validation of documentation content.',
          };

          const result = overviewSchema.safeParse(invalidOverview);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('coreFunction');
          }
        });
      });

      describe('Business Context Schema (Plan)', () => {
        const businessContextSchema = createBusinessScopeSchema('plan').shape.businessContext;
        it('should validate a business context', () => {
          const validBusinessContext =
            'Currently, pipeline failures are opaque, requiring developers to manually inspect logs, which slows down resolution time.';

          const result = businessContextSchema.safeParse(validBusinessContext);
          expect(result.success).toBe(true);
        });

        it('should reject empty business context', () => {
          const result = businessContextSchema.safeParse('');
          expect(result.success).toBe(false);
        });
      });

      describe('User Journey Schema (Plan)', () => {
        it('should validate a complete user journey array', () => {
          const validUserJourneys = [
            {
              name: 'Analyst Processes a New Document',
              description:
                'This journey describes the end-to-end path for a data analyst supervising the processing of a single document from selection to completion.',
              diagram: 'graph\nA("Start") --> B["Selects Document"];\nB --> C("Completes Pipeline");',
            },
          ];

          const result = UserJourneyPlanSchema.safeParse(validUserJourneys);
          expect(result.success).toBe(true);
        });

        it('should reject user journey array with missing name', () => {
          const invalidUserJourneys = [
            {
              description: 'This journey describes the end-to-end path.',
              diagram: 'graph\nA --> B;',
            },
          ];

          const result = UserJourneyPlanSchema.safeParse(invalidUserJourneys);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('name');
          }
        });

        it('should reject user journey array with empty description', () => {
          const invalidUserJourneys = [
            {
              name: 'Analyst Processes a New Document',
              description: '',
              diagram: 'graph\nA --> B;',
            },
          ];

          const result = UserJourneyPlanSchema.safeParse(invalidUserJourneys);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('description');
          }
        });
      });

      describe('User Personas Schema (Plan)', () => {
        it('should validate user personas', () => {
          const validUserPersonas = [
            {
              persona: 'Data Analyst',
              goal: 'Process documents efficiently and accurately',
            },
            {
              persona: 'System Administrator',
              goal: 'Monitor system performance and resolve issues',
            },
          ];

          const result = UserPersonasPlanSchema.safeParse(validUserPersonas);
          expect(result.success).toBe(true);
        });

        it('should reject user personas with missing fields', () => {
          const invalidUserPersonas = [
            {
              persona: 'Data Analyst',
              // Missing goal
            },
          ];

          const result = UserPersonasPlanSchema.safeParse(invalidUserPersonas);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('goal');
          }
        });
      });

      describe('Core Business Rules Schema (Plan)', () => {
        it('should validate core business rules', () => {
          const validBusinessRules = [
            'All documents must be validated before processing',
            'System must log all errors for audit purposes',
            'Performance must meet SLA requirements',
          ];

          const result = CoreBusinessRulesPlanSchema.safeParse(validBusinessRules);
          expect(result.success).toBe(true);
        });

        it('should reject empty business rules array', () => {
          const invalidBusinessRules: string[] = [];

          const result = CoreBusinessRulesPlanSchema.safeParse(invalidBusinessRules);
          expect(result.success).toBe(false);
        });

        it('should reject business rules with empty strings', () => {
          const invalidBusinessRules = ['Valid rule', '', 'Another valid rule'];

          const result = CoreBusinessRulesPlanSchema.safeParse(invalidBusinessRules);
          expect(result.success).toBe(false);
        });
      });

      describe('User Stories Schema (Plan)', () => {
        it('should validate user stories', () => {
          const validUserStories = [
            'As a data analyst, I want to process documents automatically so that I can focus on analysis',
            'As a system administrator, I want to monitor system performance so that I can proactively resolve issues',
          ];

          const result = UserStoriesPlanSchema.safeParse(validUserStories);
          expect(result.success).toBe(true);
        });

        it('should reject empty user stories array', () => {
          const invalidUserStories: string[] = [];

          const result = UserStoriesPlanSchema.safeParse(invalidUserStories);
          expect(result.success).toBe(false);
        });
      });

      describe('Success Criteria Schema (Plan)', () => {
        it('should validate success criteria', () => {
          const validSuccessCriteria = [
            'Processing time reduced by 50%',
            'Error rate reduced to less than 1%',
            'User satisfaction score above 4.5/5',
          ];

          const result = SuccessCriteriaPlanSchema.safeParse(validSuccessCriteria);
          expect(result.success).toBe(true);
        });

        it('should reject empty success criteria array', () => {
          const invalidSuccessCriteria: string[] = [];

          const result = SuccessCriteriaPlanSchema.safeParse(invalidSuccessCriteria);
          expect(result.success).toBe(false);
        });
      });

      describe('In Scope Schema (Plan)', () => {
        it('should validate in scope items', () => {
          const validInScope = [
            'Logging system implementation',
            'Error monitoring dashboard',
            'Performance metrics collection',
          ];

          const result = InScopePlanSchema.safeParse(validInScope);
          expect(result.success).toBe(true);
        });

        it('should reject empty in scope array', () => {
          const invalidInScope: string[] = [];

          const result = InScopePlanSchema.safeParse(invalidInScope);
          expect(result.success).toBe(false);
        });
      });

      describe('Out of Scope Schema (Plan)', () => {
        it('should validate out of scope items', () => {
          const validOutOfScope = ['UI redesign', 'Database migration', 'Third-party integrations'];

          const result = OutOfScopePlanSchema.safeParse(validOutOfScope);
          expect(result.success).toBe(true);
        });

        it('should reject empty out of scope array', () => {
          const invalidOutOfScope: string[] = [];

          const result = OutOfScopePlanSchema.safeParse(invalidOutOfScope);
          expect(result.success).toBe(false);
        });
      });

      describe('Business Process Schema (Plan)', () => {
        it('should validate a business process array', () => {
          const validBusinessProcesses = [
            {
              name: 'Document Processing Workflow',
              participants: 'Data Analyst, System, Quality Assurance',
              goal: 'Process documents efficiently while maintaining quality standards',
              workflow: [
                'Upload document to system',
                'Validate document format and content',
                'Process document through pipeline',
                'Generate processing report',
                'Archive processed document',
              ],
            },
          ];

          const result = BusinessProcessPlanSchema.safeParse(validBusinessProcesses);
          expect(result.success).toBe(true);
        });

        it('should reject business process array with missing name', () => {
          const invalidBusinessProcesses = [
            {
              participants: 'Data Analyst, System',
              goal: 'Process documents efficiently',
              workflow: ['Upload document', 'Process data'],
            },
          ];

          const result = BusinessProcessPlanSchema.safeParse(invalidBusinessProcesses);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('name');
          }
        });

        it('should reject business process array with empty workflow', () => {
          const invalidBusinessProcesses = [
            {
              name: 'Document Processing Workflow',
              participants: 'Data Analyst, System',
              goal: 'Process documents efficiently',
              workflow: [],
            },
          ];

          const result = BusinessProcessPlanSchema.safeParse(invalidBusinessProcesses);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('workflow');
          }
        });
      });
    });

    describe('Task-Specific Section Tests', () => {
      describe('Overview Schema (Task)', () => {
        it('should validate a complete overview for task', () => {
          const overviewSchema = createBusinessScopeSchema('task').shape.overview;
          const validOverview = {
            coreFunction:
              'This task is to create the canonical Zod schemas that define the expected content structure for each section within a *.plan.md or *.task.md document.',
            keyCapability:
              'It will produce one or more *.ts files that export Zod schemas for validating the parsed content of markdown sections.',
            businessValue:
              'Enables automated validation of documentation content, guaranteeing that all documents are structurally correct and can be reliably parsed by tools and LLMs.',
          };

          const result = overviewSchema.safeParse(validOverview);
          expect(result.success).toBe(true);
        });

        it('should reject overview with missing core function for task', () => {
          const overviewSchema = createBusinessScopeSchema('task').shape.overview;
          const invalidOverview = {
            keyCapability: 'It will produce one or more *.ts files that export Zod schemas.',
            businessValue: 'Enables automated validation of documentation content.',
          };

          const result = overviewSchema.safeParse(invalidOverview);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('coreFunction');
          }
        });

        it('should reject overview with empty strings for task', () => {
          const overviewSchema = createBusinessScopeSchema('task').shape.overview;
          const invalidOverview = {
            coreFunction: '',
            keyCapability: 'It will produce one or more *.ts files that export Zod schemas.',
            businessValue: 'Enables automated validation of documentation content.',
          };

          const result = overviewSchema.safeParse(invalidOverview);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('coreFunction');
          }
        });
      });

      describe('Core Business Rules Schema (Task)', () => {
        it('should validate core business rules for task', () => {
          const validBusinessRules = [
            'All schemas must be properly validated',
            'All tests must pass before deployment',
            'Documentation must be updated with schema changes',
          ];

          const result = CoreBusinessRulesTaskSchema.safeParse(validBusinessRules);
          expect(result.success).toBe(true);
        });

        it('should reject empty business rules array for task', () => {
          const invalidBusinessRules: string[] = [];

          const result = CoreBusinessRulesTaskSchema.safeParse(invalidBusinessRules);
          expect(result.success).toBe(false);
        });

        it('should reject business rules with empty strings for task', () => {
          const invalidBusinessRules = ['Valid rule', '', 'Another valid rule'];

          const result = CoreBusinessRulesTaskSchema.safeParse(invalidBusinessRules);
          expect(result.success).toBe(false);
        });
      });

      describe('Definition of Done Schema (Task)', () => {
        it('should validate definition of done table for task', () => {
          const validDefinitionOfDone = [
            {
              id: 'DoD-1',
              criterion: 'All schemas pass validation tests',
            },
            {
              id: 'DoD-2',
              criterion: 'Documentation is updated with new schema definitions',
            },
            {
              id: 'DoD-3',
              criterion: 'Integration tests pass with new schemas',
            },
          ];

          const result = DefinitionOfDoneTaskSchema.safeParse(validDefinitionOfDone);
          expect(result.success).toBe(true);
        });

        it('should reject definition of done with missing ID for task', () => {
          const invalidDefinitionOfDone = [
            {
              criterion: 'All schemas pass validation tests',
            },
          ];

          const result = DefinitionOfDoneTaskSchema.safeParse(invalidDefinitionOfDone);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('id');
          }
        });

        it('should reject definition of done with missing criterion for task', () => {
          const invalidDefinitionOfDone = [
            {
              id: 'DoD-1',
              // Missing criterion
            },
          ];

          const result = DefinitionOfDoneTaskSchema.safeParse(invalidDefinitionOfDone);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('criterion');
          }
        });
      });

      describe('In Scope Schema (Task)', () => {
        it('should be omitted for tasks', () => {
          // In Scope is omitted for tasks according to the JSON schema
          const result = InScopeTaskSchema.safeParse(['some data']);
          expect(result.success).toBe(false);
        });
      });

      describe('Out of Scope Schema (Task)', () => {
        it('should be omitted for tasks', () => {
          // Out of Scope is omitted for tasks according to the JSON schema
          const result = OutOfScopeTaskSchema.safeParse(['some data']);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('Business Scope Schema (Complete Family)', () => {
      it('should validate a complete business scope for a Plan', () => {
        const validPlanBusinessScope = {
          overview: {
            coreFunction:
              'This plan is to implement a comprehensive logging system for the document processing pipeline.',
            keyCapability:
              'It will provide structured, queryable logging data that can be analyzed for operational insights.',
            businessValue:
              'Enables proactive issue resolution and performance analysis, reducing mean time to resolution by 60%.',
          },
          businessContext:
            'Currently, pipeline failures are opaque, requiring developers to manually inspect logs, which slows down resolution time. This new logging system will provide structured, queryable data to our analytics dashboard, allowing support staff to diagnose issues without engineering intervention.',
          userJourneys: [
            {
              name: 'Analyst Processes a New Document',
              description:
                'This journey describes the end-to-end path for a data analyst supervising the processing of a single document from selection to completion.',
              diagram: 'graph\nA("Start") --> B["Selects Document"];\nB --> C("Completes Pipeline");',
            },
          ],
          userPersonas: [
            {
              persona: 'Data Analyst',
              goal: 'Process documents efficiently and accurately',
            },
            {
              persona: 'System Administrator',
              goal: 'Monitor system performance and resolve issues',
            },
          ],
          coreBusinessRules: [
            'All documents must be validated before processing',
            'System must log all errors for audit purposes',
            'Performance must meet SLA requirements',
          ],
          userStories: [
            'As a data analyst, I want to process documents automatically so that I can focus on analysis',
            'As a system administrator, I want to monitor system performance so that I can proactively resolve issues',
          ],
          successCriteria: [
            'Processing time reduced by 50%',
            'Error rate reduced to less than 1%',
            'User satisfaction score above 4.5/5',
          ],
          inScope: ['Logging system implementation', 'Error monitoring dashboard', 'Performance metrics collection'],
          outOfScope: ['UI redesign', 'Database migration', 'Third-party integrations'],
          coreBusinessProcesses: [
            {
              name: 'Document Processing Workflow',
              participants: 'Data Analyst, System, Quality Assurance',
              goal: 'Process documents efficiently while maintaining quality standards',
              workflow: [
                'Upload document to system',
                'Validate document format and content',
                'Process document through pipeline',
                'Generate processing report',
                'Archive processed document',
              ],
            },
          ],
        };

        const result = BusinessScopeFamilyPlanSchema.safeParse(validPlanBusinessScope);
        expect(result.success).toBe(true);
      });

      it('should validate a complete business scope for a Task', () => {
        const validTaskBusinessScope = {
          overview: {
            coreFunction:
              'This task is to create the canonical Zod schemas that define the expected content structure for each section within a *.plan.md or *.task.md document.',
            keyCapability:
              'It will produce one or more *.ts files that export Zod schemas for validating the parsed content of markdown sections.',
            businessValue:
              'Enables automated validation of documentation content, guaranteeing that all documents are structurally correct and can be reliably parsed by tools and LLMs.',
          },
          coreBusinessRules: [
            'All schemas must be properly validated',
            'All tests must pass before deployment',
            'Documentation must be updated with schema changes',
          ],
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'All schemas pass validation tests',
            },
            {
              id: 'DoD-2',
              criterion: 'Documentation is updated with new schema definitions',
            },
            {
              id: 'DoD-3',
              criterion: 'Integration tests pass with new schemas',
            },
          ],
        };

        const result = BusinessScopeFamilyTaskSchema.safeParse(validTaskBusinessScope);
        expect(result.success).toBe(true);
      });

      it('should reject business scope with missing overview', () => {
        const invalidBusinessScope = {
          businessContext: 'Some business context',
          userStories: ['Some user story'],
        };

        const result = BusinessScopeFamilyPlanSchema.safeParse(invalidBusinessScope);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('overview');
        }
      });

      it('should reject business scope with invalid overview', () => {
        const invalidBusinessScope = {
          overview: {
            coreFunction: '', // Empty string should be rejected
            keyCapability: 'Some capability',
            businessValue: 'Some value',
          },
        };

        const result = BusinessScopeFamilyPlanSchema.safeParse(invalidBusinessScope);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('coreFunction');
        }
      });
    });
  });
});
