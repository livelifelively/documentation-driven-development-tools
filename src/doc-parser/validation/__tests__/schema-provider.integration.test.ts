import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

// Mock the IndexModule from T32
vi.mock('../index.js', () => ({
  createTaskSchema: vi.fn(),
  createPlanSchema: vi.fn(),
}));

// Import the mocked functions
import { createTaskSchema, createPlanSchema } from '../index.js';

// Import the types we'll need (these will be created in the implementation)
interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: LintingError[];
}

interface LintingError {
  sectionId: string;
  familyId: string;
  field: string;
  message: string;
  path: string;
  lineNumber: number;
}

interface DocumentData {
  docType: 'plan' | 'task';
  sections: Record<string, any>;
}

// Import the function we'll implement (this will fail initially)
import { createSchemaProvider } from '../schema-provider.js';

describe('SchemaProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Realistic Document Validation', () => {
    it('should validate a realistic task Section[] payload successfully', async () => {
      // AC-2: Valid task Section[] validates successfully via provider

      // This test uses a realistic task document structure that matches
      // what would be produced by the markdown parser
      const realisticTaskData: DocumentData = {
        docType: 'task',
        sections: {
          metaGovernance: {
            status: {
              currentState: 'Not Started',
              priority: 'High',
              progress: 0,
              planningEstimate: 10,
              estVariance: 0,
              created: '2025-08-09 10:00',
              implementationStarted: '',
              completed: '',
              lastUpdated: '2025-08-09 10:00',
            },
            priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
          },
          businessScope: {
            overview: [
              'Core Function: A single service that checks whether Plan/Task documents follow the agreed documentation rules.',
              "Key Capability: Takes a document's sections and tells whether they are valid. If not, it clearly lists what is wrong and where to fix it.",
              'Business Value: Prevents malformed documentation from slipping through reviews or CI, reduces rework, and ensures downstream tools can rely on consistent, well-structured documents.',
            ],
            acceptanceCriteria: [
              {
                id: 'DoD-1',
                criterion:
                  'A single validation service is available to check whether any Plan/Task document follows the documentation rules.',
              },
              {
                id: 'DoD-2',
                criterion: 'For a correct document, the service confirms validity without errors.',
              },
              {
                id: 'DoD-3',
                criterion:
                  'For an incorrect document, the service returns a clear, actionable list of issues indicating what and where to fix.',
              },
              {
                id: 'DoD-4',
                criterion: 'The service works for both document types (Plans and Tasks).',
              },
              {
                id: 'DoD-5',
                criterion:
                  "The service's results are easy to consume in tools and CI (simple pass/fail plus human-readable messages).",
              },
              {
                id: 'DoD-6',
                criterion:
                  'The service operates safely and avoids exposing sensitive content in its messages by default.',
              },
            ],
          },
          planningDecomposition: {
            dependencies: [
              {
                id: 'D-1',
                dependencyOn: 'T32: Define Section Content Schemas',
                type: 'Internal',
                status: 'In Progress',
                notes: 'Provider composes the family/section schemas produced by T32.',
              },
            ],
          },
          highLevelDesign: {
            targetArchitecture: {
              dataModels: {
                description: "This task focuses on the SchemaProvider's role...",
                diagram: {
                  type: 'mermaid',
                  diagramType: 'erDiagram',
                  content: 'erDiagram\n    DOCUMENT_DATA {\n        string docType\n        object sections\n    }',
                },
              },
              components: {
                description: 'The SchemaProviderImpl acts as a facade...',
                diagram: {
                  type: 'mermaid',
                  diagramType: 'classDiagram',
                  content:
                    'classDiagram\n    class SchemaProviderImpl {\n        +validate(document: DOCUMENT_DATA): VALIDATION_RESULT\n    }',
                },
              },
            },
            techStackDeployment: [
              'Language: TypeScript',
              'Schema Validation: Zod',
              'Testing: Vitest',
              'Deployment: Part of @livelifelively/ddd-tools internal package under src/doc-parser/validation/.',
            ],
            nonFunctionalRequirements: {
              performance: [
                {
                  id: 'PERF-01',
                  requirement: 'Provider validation must process a typical DOCUMENT_DATA payload in < 50ms.',
                  priority: 'Medium',
                },
                {
                  id: 'PERF-02',
                  requirement: 'DOCUMENT_SCHEMA composition from SectionContentZodSchemas must complete in < 10ms.',
                  priority: 'Low',
                },
              ],
              security: [
                {
                  id: 'SEC-01',
                  requirement: 'Provider must not execute any untrusted user code while processing DOCUMENT_DATA.',
                  priority: 'High',
                },
                {
                  id: 'SEC-02',
                  requirement:
                    'LINTING_ERROR messages must avoid leaking sensitive raw content from DOCUMENT_DATA by default.',
                  priority: 'Medium',
                },
              ],
              reliability: [
                {
                  id: 'REL-01',
                  requirement: 'Provider output strictly adheres to the VALIDATION_RESULT contract.',
                  priority: 'High',
                },
                {
                  id: 'REL-02',
                  requirement: 'DOCUMENT_SCHEMA composition must be deterministic for the same docType input.',
                  priority: 'High',
                },
              ],
            },
          },
          implementationGuidance: {
            implementationLog: [
              'Implement createSchemaProvider() in src/doc-parser/validation/.',
              'Define ValidationResult and ValidationContext types colocated with provider.',
              'Compose schemas via existing family factories from T32.',
              'Implement mapping from Zod issues to LintingError[] with section paths.',
              'Add unit tests for provider API (success/failure).',
              'Add integration test validating a realistic Section[] payload.',
            ],
          },
          qualityOperations: {
            testingStrategy: [
              {
                acId: 'AC-1',
                scenario: 'Provider exposes getDocumentSchema and validate',
                testType: 'Unit',
                testFile: '__tests__/schema-provider.test.ts',
              },
              {
                acId: 'AC-2',
                scenario: 'Valid task Section[] validates successfully via provider',
                testType: 'Integration',
                testFile: '__tests__/schema-provider.integration.test.ts',
              },
              {
                acId: 'AC-3',
                scenario: 'Invalid fields map to LintingError[] with correct paths/messages',
                testType: 'Unit',
                testFile: '__tests__/schema-provider.test.ts',
              },
              {
                acId: 'AC-4',
                scenario: 'No tight coupling to parser internals (types-only)',
                testType: 'Unit',
                testFile: '__tests__/schema-provider.test.ts',
              },
            ],
            localTestCommands: ['npm test -- src/doc-parser/validation/__tests__/'],
          },
        },
      };

      // Create a realistic mock schema that matches the structure above
      const mockTaskSchema = z.object({
        metaGovernance: z.object({
          status: z.object({
            currentState: z.enum(['Not Started', 'In Progress', 'Under Review', 'Complete', 'Blocked']),
            priority: z.enum(['High', 'Medium', 'Low']),
            progress: z.number(),
            planningEstimate: z.number(),
            estVariance: z.number(),
            created: z.string(),
            implementationStarted: z.string(),
            completed: z.string(),
            lastUpdated: z.string(),
          }),
          priorityDrivers: z.array(z.string()),
        }),
        businessScope: z.object({
          overview: z.array(z.string()),
          acceptanceCriteria: z.array(
            z.object({
              id: z.string(),
              criterion: z.string(),
            })
          ),
        }),
        planningDecomposition: z.object({
          dependencies: z.array(
            z.object({
              id: z.string(),
              dependencyOn: z.string(),
              type: z.enum(['Internal', 'External']),
              status: z.enum(['Complete', 'Blocked', 'In Progress']),
              notes: z.string(),
            })
          ),
        }),
        highLevelDesign: z.object({
          targetArchitecture: z.object({
            dataModels: z.object({
              description: z.string(),
              diagram: z.object({
                type: z.literal('mermaid'),
                diagramType: z.enum(['erDiagram', 'classDiagram', 'sequenceDiagram', 'graph', 'flowchart']),
                content: z.string(),
              }),
            }),
            components: z.object({
              description: z.string(),
              diagram: z.object({
                type: z.literal('mermaid'),
                diagramType: z.enum(['erDiagram', 'classDiagram', 'sequenceDiagram', 'graph', 'flowchart']),
                content: z.string(),
              }),
            }),
          }),
          techStackDeployment: z.array(z.string()),
          nonFunctionalRequirements: z.object({
            performance: z.array(
              z.object({
                id: z.string(),
                requirement: z.string(),
                priority: z.enum(['High', 'Medium', 'Low']),
              })
            ),
            security: z.array(
              z.object({
                id: z.string(),
                requirement: z.string(),
                priority: z.enum(['High', 'Medium', 'Low']),
              })
            ),
            reliability: z.array(
              z.object({
                id: z.string(),
                requirement: z.string(),
                priority: z.enum(['High', 'Medium', 'Low']),
              })
            ),
          }),
        }),
        implementationGuidance: z.object({
          implementationLog: z.array(z.string()),
        }),
        qualityOperations: z.object({
          testingStrategy: z.array(
            z.object({
              acId: z.string(),
              scenario: z.string(),
              testType: z.enum(['Unit', 'Integration', 'E2E', 'Performance', 'Security']),
              testFile: z.string(),
            })
          ),
          localTestCommands: z.array(z.string()),
        }),
      });

      (createTaskSchema as any).mockResolvedValue(mockTaskSchema);

      const provider = await createSchemaProvider();
      const result = await provider.validate(realisticTaskData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();

      // Verify that the validated data matches the input sections structure
      expect(result.data).toEqual(realisticTaskData.sections);
    });

    it('should validate a realistic plan document successfully', async () => {
      // Test with a realistic plan document structure

      const realisticPlanData: DocumentData = {
        docType: 'plan',
        sections: {
          metaGovernance: {
            status: {
              created: '2025-08-03 06:08',
              lastUpdated: '2025-08-03 06:08',
            },
            priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
          },
          businessScope: {
            overview: [
              'Core Function: Provides a validation engine to ensure the _content_ of *.plan.md and *.task.md files conforms to the canonical schema.',
              'Key Capability: This system introduces a second tier of validation that operates on the final markdown documents.',
              'Business Value: Enforces runtime correctness and consistency of all documentation.',
            ],
            businessContext:
              'Our currently implemented schema definition system generates documentation that specifies the rules for our markdown files. However, it lacks an enforcement mechanism.',
            coreBusinessRules: [
              "Focus on Content Rules: This system's sole responsibility is to define the validation rules for the _content_ within markdown documentation files.",
              'Zod as the Rule Definition Language: The expected structure for the content of each documentation section will be defined using Zod schemas.',
              'Zod as the Source of Truth for Structure: The Zod schemas produced by this system are the canonical source of truth for the _content structure_ of all documentation sections.',
              'Schema Independence: The validation rules created here must be self-contained and not directly dependent on the file structure of the schema definition system.',
            ],
            successCriteria: [
              'A comprehensive library of Zod schemas is created, covering the content structure for all sections defined in the canonical documentation schema.',
              'Each Zod schema correctly and strictly enforces the documented rules for its corresponding section.',
              'The created schemas can be successfully imported and used by a consumer to validate compliant and non-compliant content.',
              'The schema library is organized logically, making it easy to maintain and extend as the documentation methodology evolves.',
            ],
            boundariesScope: {
              inScope: [
                'Defining and maintaining a comprehensive library of Zod schemas that represent the content rules for every section in the documentation.',
                'Providing clear, typed exports for all schemas so they can be consumed by other systems.',
                'Ensuring the schema library is well-organized and maintainable.',
              ],
              outOfScope: [
                'The implementation of any tool that consumes these schemas, such as a markdown parser or linter.',
                'The validation of the *.json schema _definition_ files.',
                'Auto-correction of invalid markdown content.',
                'Real-time validation in an IDE or git-hooks.',
              ],
            },
          },
          planningDecomposition: {
            roadmap: [
              {
                id: 'T32',
                childPlanTask: 'Define Section Content Schemas',
                priority: 'High',
                priorityDrivers: 'TEC-Prod_Stability_Blocker',
                status: 'Complete',
                dependsOn: 'T28',
                summary: 'Create the Zod schemas that define the expected content for each section.',
              },
              {
                id: 'T33',
                childPlanTask: 'Statically Generate Composed Schemas',
                priority: 'Medium',
                priorityDrivers: 'TEC-Dev_Productivity_Enhancement',
                status: 'Not Started',
                dependsOn: 'T32',
                summary: 'Implement a build-time process to statically generate schemas for better performance.',
              },
              {
                id: 'T34',
                childPlanTask: 'Schema Provider Implementation',
                priority: 'High',
                priorityDrivers: 'TEC-Prod_Stability_Blocker',
                status: 'Not Started',
                dependsOn: 'T32',
                summary: 'Implement provider that composes schemas and returns standardized ValidationResult.',
              },
            ],
            dependencies: [
              {
                id: 'D-1',
                dependencyOn: 'Canonical Schema Interfaces',
                type: 'Internal',
                status: 'Not Started',
                affectedPlansTasks: 'T32',
                notes:
                  'The base types for the schema definition itself are a prerequisite for creating content schemas.',
              },
            ],
          },
        },
      };

      // Create a realistic mock schema for plan documents
      const mockPlanSchema = z.object({
        metaGovernance: z.object({
          status: z.object({
            created: z.string(),
            lastUpdated: z.string(),
          }),
          priorityDrivers: z.array(z.string()),
        }),
        businessScope: z.object({
          overview: z.array(z.string()),
          businessContext: z.string(),
          coreBusinessRules: z.array(z.string()),
          successCriteria: z.array(z.string()),
          boundariesScope: z.object({
            inScope: z.array(z.string()),
            outOfScope: z.array(z.string()),
          }),
        }),
        planningDecomposition: z.object({
          roadmap: z.array(
            z.object({
              id: z.string(),
              childPlanTask: z.string(),
              priority: z.enum(['High', 'Medium', 'Low']),
              priorityDrivers: z.string(),
              status: z.enum(['Not Started', 'In Progress', 'Under Review', 'Complete', 'Blocked']),
              dependsOn: z.string(),
              summary: z.string(),
            })
          ),
          dependencies: z.array(
            z.object({
              id: z.string(),
              dependencyOn: z.string(),
              type: z.enum(['Internal', 'External']),
              status: z.enum(['Complete', 'Blocked', 'In Progress', 'Not Started']),
              affectedPlansTasks: z.string(),
              notes: z.string(),
            })
          ),
        }),
      });

      (createPlanSchema as any).mockResolvedValue(mockPlanSchema);

      const provider = await createSchemaProvider();
      const result = await provider.validate(realisticPlanData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });
  });
});
