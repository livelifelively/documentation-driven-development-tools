import { describe, it, expect } from 'vitest';
import {
  createHighLevelDesignSchema,
  getHighLevelDesignTaskSchema,
  getHighLevelDesignPlanSchema,
} from '../../4-high-level-design.schema.js';
import { z } from 'zod';

describe('High-Level Design Schema Validation', () => {
  describe('createCurrentArchitectureSchema', () => {
    // Based on 4-high-level-design.json, 'Current Architecture' is 'optional' for 'plan'
    // but if present, it must contain either a 'text' description or subsections.

    const validSubsections = {
      dataModels: { diagram: 'erDiagram ...' },
      components: { diagram: 'classDiagram ...' },
      dataFlow: { diagram: 'graph ...' },
      controlFlow: { diagram: 'sequenceDiagram ...' },
      integrationPoints: { upstream: [{ trigger: 'a', inputData: 'b' }] },
    };

    describe('for docType: "plan"', () => {
      const family = createHighLevelDesignSchema('plan') as any;
      const schema = (family.shape as any).currentArchitecture;
      const byId = family.__byId as Record<string, z.ZodTypeAny>;

      it('should be an optional schema', () => {
        expect(schema.isOptional()).toBe(true);
      });

      it('should validate a structure with only subsections', () => {
        const result = schema.safeParse(validSubsections);
        expect(result.success, 'Validation should succeed with full subsections').toBe(true);
        // Also validate via id→schema index using the same family
        expect(byId['4.1'].safeParse(validSubsections).success).toBe(true);
      });

      it('should validate a structure with only a text description', () => {
        const dataWithTextOnly = { text: ['This is a greenfield project.'] };
        const result = schema.safeParse(dataWithTextOnly);
        expect(result.success, 'Validation should succeed with only a text description').toBe(true);
      });

      it('should validate a structure with both text and subsections', () => {
        const dataWithBoth = { ...validSubsections, text: ['Describing the existing system.'] };
        const result = schema.safeParse(dataWithBoth);
        expect(result.success, 'Validation should succeed with both text and subsections').toBe(true);
      });

      it('should invalidate an empty object', () => {
        const result = schema.safeParse({});
        expect(result.success, 'Validation should fail for an empty object').toBe(false);
        expect(byId['4.1'].safeParse({}).success).toBe(false);
      });

      it('should invalidate data with extra properties due to .strict() in the union components', () => {
        const invalidData = { ...validSubsections, extraProperty: 'should not be here' };
        const result = schema.safeParse(invalidData);
        expect(result.success, 'Validation should fail due to extra properties').toBe(false);
        expect(byId['4.1'].safeParse(invalidData).success).toBe(false);
      });
    });

    describe('for docType: "task"', () => {
      const taskShape = createHighLevelDesignSchema('task').shape as any;

      it('should omit the section for tasks', () => {
        expect(taskShape.currentArchitecture).toBeUndefined();
      });

      it('should invalidate any data provided for a task at family level', () => {
        const familySchema = createHighLevelDesignSchema('task');
        const result = familySchema.safeParse({ currentArchitecture: { ...validSubsections } });
        expect(result.success, 'Validation should always fail for an omitted section').toBe(false);
      });
    });
  });

  describe('createTargetArchitectureSchema', () => {
    const validSubsections = {
      dataModels: { diagram: 'erDiagram ...' },
      components: { diagram: 'classDiagram ...' },
      dataFlow: { diagram: 'graph ...' },
      controlFlow: { diagram: 'sequenceDiagram ...' },
      integrationPoints: { upstream: [{ trigger: 'a', inputData: 'b' }] },
      exposedAPI: 'api details',
    };

    describe('for docType: "plan"', () => {
      const family = createHighLevelDesignSchema('plan') as any;
      const schema = (family.shape as any).targetArchitecture;
      const byId = family.__byId as Record<string, z.ZodTypeAny>;

      it('should be a required schema', () => {
        expect(schema.isOptional()).toBe(false);
      });

      it('should validate a structure with only subsections', () => {
        const result = schema.safeParse(validSubsections);
        expect(result.success).toBe(true);
        // Also validate via id→schema index using the same family
        expect(byId['4.2'].safeParse(validSubsections).success).toBe(true);
      });

      it('should validate a structure with only a text description', () => {
        const dataWithTextOnly = { text: ['This is a new architecture.'] };
        const result = schema.safeParse(dataWithTextOnly);
        expect(result.success).toBe(true);
      });

      it('should validate a structure with both text and subsections', () => {
        const dataWithBoth = { ...validSubsections, text: ['New architecture details.'] };
        const result = schema.safeParse(dataWithBoth);
        expect(result.success).toBe(true);
      });

      it('should invalidate an empty object', () => {
        const result = schema.safeParse({});
        expect(result.success).toBe(false);
        expect(byId['4.2'].safeParse({}).success).toBe(false);
      });
    });

    describe('for docType: "task"', () => {
      const schema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

      it('should be a required schema', () => {
        expect(schema.isOptional()).toBe(false);
      });

      it('should validate a structure with only subsections', () => {
        const result = schema.safeParse(validSubsections);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Factory Function Tests', () => {
    describe('createHighLevelDesignSchema', () => {
      it('should create plan schema with plan-specific sections', () => {
        const planSchema = createHighLevelDesignSchema('plan');
        const validPlanData = {
          guidingPrinciples: [
            'All UI components must be stateless to allow for horizontal scaling.',
            'Communication between major components should be asynchronous and event-driven where possible.',
          ],
          currentArchitecture: {
            dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
            components: { diagram: 'classDiagram\ndirection LR\nclass ClientLogger' },
          },
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            },
            exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
          },
          techStackDeployment: [
            { category: 'Language', technology: 'TypeScript' },
            { category: 'Framework', technology: 'Next.js' },
            { category: 'Deployment', technology: 'Vercel' },
          ],
          nonFunctionalRequirements: {
            performance: [
              {
                id: 'PERF-01',
                requirement: 'API endpoints must respond in < 200ms (95th percentile).',
                priority: 'High',
              },
            ],
            security: [
              {
                id: 'SEC-01',
                requirement: 'All sensitive user data must be encrypted at rest using AES-256.',
                priority: 'High',
              },
            ],
            reliability: [
              {
                id: 'REL-01',
                requirement: 'The service must maintain 99.9% uptime, measured monthly.',
                priority: 'High',
              },
            ],
            permissionModel: [
              {
                role: 'Admin',
                permissions: ['Full CRUD access to all documents', 'Can assign roles'],
                notes: 'For system administrators only.',
              },
            ],
          },
        };
        const result = planSchema.safeParse(validPlanData);
        expect(
          result.success,
          result.success ? '' : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
        ).toBe(true);
      });
      it('should create task schema with task-specific sections', () => {
        const taskSchema = createHighLevelDesignSchema('task');
        const validTaskData = {
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
            components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
            dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
            integrationPoints: {
              upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
              downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
            },
            exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
          },
          techStackDeployment: [
            { category: 'Language', technology: 'TypeScript' },
            { category: 'Testing', technology: 'Vitest' },
          ],
          nonFunctionalRequirements: {
            performance: [
              { id: 'PERF-01', requirement: 'Task processing must complete within 5 seconds.', priority: 'High' },
            ],
            security: [{ id: 'SEC-01', requirement: 'Task data must be encrypted in transit.', priority: 'High' }],
          },
        };
        const result = taskSchema.safeParse(validTaskData);
        expect(
          result.success,
          result.success ? '' : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
        ).toBe(true);
      });
      it('should omit plan-specific sections from task schema', () => {
        const taskSchema = createHighLevelDesignSchema('task');
        // Test that validation passes with only task-specific sections
        const validTaskData = {
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
            components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
            dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
            integrationPoints: {
              upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
              downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
            },
            exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
          },
          techStackDeployment: [{ category: 'Language', technology: 'TypeScript' }],
          nonFunctionalRequirements: {
            performance: [
              { id: 'PERF-01', requirement: 'Task processing must complete within 5 seconds.', priority: 'High' },
            ],
          },
        };
        const validResult = taskSchema.safeParse(validTaskData);
        expect(validResult.success).toBe(true);
        // Verify that the schema shape only includes task-specific sections
        const schemaShape = taskSchema.shape;
        expect(schemaShape).toHaveProperty('targetArchitecture');
        expect(schemaShape).toHaveProperty('techStackDeployment');
        expect(schemaShape).toHaveProperty('nonFunctionalRequirements');
        expect(schemaShape).not.toHaveProperty('guidingPrinciples');
        expect(schemaShape).not.toHaveProperty('currentArchitecture');
      });
      it('should omit task-specific sections from plan schema', () => {
        const planSchema = createHighLevelDesignSchema('plan');
        // Test that validation passes with only plan-specific sections
        const validPlanData = {
          guidingPrinciples: ['All UI components must be stateless to allow for horizontal scaling.'],
          currentArchitecture: {
            dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
          },
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            },
            exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
          },
          techStackDeployment: [{ category: 'Language', technology: 'TypeScript' }],
          nonFunctionalRequirements: {
            performance: [{ id: 'PERF-01', requirement: 'API endpoints must respond in < 200ms.', priority: 'High' }],
          },
        };
        const validResult = planSchema.safeParse(validPlanData);
        expect(validResult.success).toBe(true);
        // Verify that the schema shape includes all plan-specific sections
        const schemaShape = planSchema.shape;
        expect(schemaShape).toHaveProperty('guidingPrinciples');
        expect(schemaShape).toHaveProperty('currentArchitecture');
        expect(schemaShape).toHaveProperty('targetArchitecture');
        expect(schemaShape).toHaveProperty('techStackDeployment');
        expect(schemaShape).toHaveProperty('nonFunctionalRequirements');
      });
    });
    describe('Convenience Functions', () => {
      it('should create task schema via convenience function', () => {
        const taskSchema = getHighLevelDesignTaskSchema();
        const validTaskData = {
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
            components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
            dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
            integrationPoints: {
              upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
              downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
            },
            exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
          },
          techStackDeployment: [{ category: 'Language', technology: 'TypeScript' }],
          nonFunctionalRequirements: {
            performance: [
              { id: 'PERF-01', requirement: 'Task processing must complete within 5 seconds.', priority: 'High' },
            ],
          },
        };
        const result = taskSchema.safeParse(validTaskData);
        expect(result.success).toBe(true);
      });
      it('should create plan schema via convenience function', () => {
        const planSchema = getHighLevelDesignPlanSchema();
        const validPlanData = {
          guidingPrinciples: ['All UI components must be stateless to allow for horizontal scaling.'],
          currentArchitecture: {
            dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
          },
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            },
            exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
          },
          techStackDeployment: [{ category: 'Language', technology: 'TypeScript' }],
          nonFunctionalRequirements: {
            performance: [{ id: 'PERF-01', requirement: 'API endpoints must respond in < 200ms.', priority: 'High' }],
          },
        };
        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Individual Section Tests', () => {
    const planSchema = createHighLevelDesignSchema('plan');
    const taskSchema = createHighLevelDesignSchema('task');

    describe('Plan-Specific Section Tests', () => {
      describe('Guiding Principles Schema (Plan)', () => {
        const guidingPrinciplesSchema = (planSchema.shape as any).guidingPrinciples;
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        it('should validate a complete guiding principles array', () => {
          const validGuidingPrinciples = [
            'All UI components must be stateless to allow for horizontal scaling.',
            'Communication between major components should be asynchronous and event-driven where possible.',
            'All services must be idempotent to ensure reliability.',
          ];

          const result = guidingPrinciplesSchema.safeParse(validGuidingPrinciples);
          expect(result.success).toBe(true);
          expect(byId['4.0'].safeParse(validGuidingPrinciples).success).toBe(true);
        });

        it('should reject guiding principles array with empty strings', () => {
          const invalidGuidingPrinciples = [
            'All UI components must be stateless.',
            '', // Empty string
            'All services must be idempotent.',
          ];

          const result = guidingPrinciplesSchema.safeParse(invalidGuidingPrinciples);
          expect(result.success).toBe(false);
          expect(byId['4.0'].safeParse(invalidGuidingPrinciples).success).toBe(false);
        });

        it('should reject empty guiding principles array', () => {
          const invalidGuidingPrinciples: any[] = [];

          const result = guidingPrinciplesSchema.safeParse(invalidGuidingPrinciples);
          expect(result.success).toBe(false);
          expect(byId['4.0'].safeParse(invalidGuidingPrinciples).success).toBe(false);
        });
      });

      describe('Current Architecture Schema (Plan)', () => {
        const currentArchitectureSchema = (planSchema.shape as any).currentArchitecture;
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        it('should validate a complete current architecture', () => {
          const validCurrentArchitecture = {
            dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
            components: { diagram: 'classDiagram\ndirection LR\nclass ClientLogger' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            },
          };

          const result = currentArchitectureSchema.safeParse(validCurrentArchitecture);
          expect(result.success).toBe(true);
          expect(byId['4.1'].safeParse(validCurrentArchitecture).success).toBe(true);
        });

        it('should validate current architecture with only some sections', () => {
          const validCurrentArchitecture = {
            dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
            components: { diagram: 'classDiagram\ndirection LR\nclass ClientLogger' },
          };

          const result = currentArchitectureSchema.safeParse(validCurrentArchitecture);
          expect(result.success).toBe(true);
          expect(byId['4.1'].safeParse(validCurrentArchitecture).success).toBe(true);
        });

        it('should reject current architecture with invalid diagram type', () => {
          const invalidCurrentArchitecture = {
            dataModels: { diagram: 'graph TD\nA --> B' }, // Wrong diagram type for data models
            components: { diagram: 'classDiagram\ndirection LR\nclass ClientLogger' },
          };

          const result = currentArchitectureSchema.safeParse(invalidCurrentArchitecture);
          expect(result.success).toBe(false);
          expect(byId['4.1'].safeParse(invalidCurrentArchitecture).success).toBe(false);
        });
      });
    });

    describe('Both Plan and Task Section Tests', () => {
      const targetArchitecturePlanSchema = (planSchema.shape as any).targetArchitecture;
      const targetArchitectureTaskSchema = (taskSchema.shape as any).targetArchitecture;
      const techStackPlanSchema = (planSchema.shape as any).techStackDeployment;
      const techStackTaskSchema = (taskSchema.shape as any).techStackDeployment;
      const nfrPlanSchema = (planSchema.shape as any).nonFunctionalRequirements;
      const nfrTaskSchema = (taskSchema.shape as any).nonFunctionalRequirements;

      describe('Target Architecture Schema (Plan)', () => {
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        it('should validate a complete target architecture for plan', () => {
          const validTargetArchitecture = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            },
            exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
          };

          const result = targetArchitecturePlanSchema.safeParse(validTargetArchitecture);
          expect(result.success).toBe(true);
          expect(byId['4.2'].safeParse(validTargetArchitecture).success).toBe(true);
        });

        it('should invalidate target architecture with only some sections', () => {
          const invalidTargetArchitecture = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          };

          const result = targetArchitecturePlanSchema.safeParse(invalidTargetArchitecture);
          expect(result.success).toBe(false);
          expect(byId['4.2'].safeParse(invalidTargetArchitecture).success).toBe(false);
        });

        it('should reject target architecture with invalid diagram type', () => {
          const invalidTargetArchitecture = {
            dataModels: { diagram: 'graph TD\nA --> B' }, // Wrong diagram type for data models
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          };

          const result = targetArchitecturePlanSchema.safeParse(invalidTargetArchitecture);
          expect(result.success).toBe(false);
          expect(byId['4.2'].safeParse(invalidTargetArchitecture).success).toBe(false);
        });
      });

      describe('Target Architecture Schema (Task)', () => {
        const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        it('should validate a complete target architecture for task', () => {
          const validTargetArchitecture = {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
            components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
            dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
            integrationPoints: {
              upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
              downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
            },
            exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
          };

          const result = targetArchitectureTaskSchema.safeParse(validTargetArchitecture);
          expect(result.success).toBe(true);
          expect(byIdTask['4.2'].safeParse(validTargetArchitecture).success).toBe(true);
        });

        it('should invalidate target architecture with only some sections for task', () => {
          const invalidTargetArchitecture = {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
            components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          };

          const result = targetArchitectureTaskSchema.safeParse(invalidTargetArchitecture);
          expect(result.success).toBe(false);
          expect(byIdTask['4.2'].safeParse(invalidTargetArchitecture).success).toBe(false);
        });
      });

      describe('Tech Stack & Deployment Schema (Plan)', () => {
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        it('should validate a complete tech stack deployment array', () => {
          const validTechStackDeployment = [
            { category: 'Language', technology: 'TypeScript' },
            { category: 'Framework', technology: 'Next.js' },
            { category: 'Deployment', technology: 'Vercel' },
            { category: 'Database', technology: 'PostgreSQL' },
          ];

          const result = techStackPlanSchema.safeParse(validTechStackDeployment);
          expect(result.success).toBe(true);
          expect(byId['4.3'].safeParse(validTechStackDeployment).success).toBe(true);
        });

        it('should reject tech stack deployment array with missing category', () => {
          const invalidTechStackDeployment = [
            { category: 'Language', technology: 'TypeScript' },
            { technology: 'Next.js' }, // Missing category
          ];

          const result = techStackPlanSchema.safeParse(invalidTechStackDeployment);
          expect(result.success).toBe(false);
          expect(byId['4.3'].safeParse(invalidTechStackDeployment).success).toBe(false);
        });

        it('should reject empty tech stack deployment array', () => {
          const invalidTechStackDeployment: any[] = [];

          const result = techStackPlanSchema.safeParse(invalidTechStackDeployment);
          expect(result.success).toBe(false);
          expect(byId['4.3'].safeParse(invalidTechStackDeployment).success).toBe(false);
        });
      });

      describe('Tech Stack & Deployment Schema (Task)', () => {
        const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        it('should validate a complete tech stack deployment array for task', () => {
          const validTechStackDeployment = [
            { category: 'Language', technology: 'TypeScript' },
            { category: 'Testing', technology: 'Vitest' },
            { category: 'Validation', technology: 'Zod' },
          ];

          const result = techStackTaskSchema.safeParse(validTechStackDeployment);
          expect(result.success).toBe(true);

          expect(byIdTask['4.3'].safeParse(validTechStackDeployment).success).toBe(true);
        });

        it('should reject tech stack deployment array with missing technology', () => {
          const invalidTechStackDeployment = [
            { category: 'Language', technology: 'TypeScript' },
            { category: 'Testing' }, // Missing technology
          ];

          const result = techStackTaskSchema.safeParse(invalidTechStackDeployment);
          expect(result.success).toBe(false);
          expect(byIdTask['4.3'].safeParse(invalidTechStackDeployment).success).toBe(false);
        });
      });

      describe('Non-Functional Requirements Schema (Plan)', () => {
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        it('should validate a complete non-functional requirements object', () => {
          const validNonFunctionalRequirements = {
            performance: [
              {
                id: 'PERF-01',
                requirement: 'API endpoints must respond in < 200ms (95th percentile).',
                priority: 'High',
              },
              {
                id: 'PERF-02',
                requirement: 'The system must support 100 concurrent users without degradation.',
                priority: 'Medium',
              },
            ],
            security: [
              {
                id: 'SEC-01',
                requirement: 'All sensitive user data must be encrypted at rest using AES-256.',
                priority: 'High',
              },
              {
                id: 'SEC-02',
                requirement: 'Access to admin endpoints must be restricted to users with Admin role.',
                priority: 'High',
              },
            ],
            reliability: [
              {
                id: 'REL-01',
                requirement: 'The service must maintain 99.9% uptime, measured monthly.',
                priority: 'High',
              },
              { id: 'REL-02', requirement: 'All database transactions must be atomic and durable.', priority: 'High' },
            ],
            permissionModel: [
              {
                role: 'Admin',
                permissions: ['Full CRUD access to all documents', 'Can assign roles'],
                notes: 'For system administrators only.',
              },
              {
                role: 'Analyst',
                permissions: ['Read/Write access to assigned documents', 'Cannot delete'],
                notes: 'The primary user role.',
              },
            ],
          };

          const result = nfrPlanSchema.safeParse(validNonFunctionalRequirements);
          expect(result.success).toBe(true);
          expect(byId['4.4'].safeParse(validNonFunctionalRequirements).success).toBe(true);
        });

        it('should validate non-functional requirements with only some sections', () => {
          const validNonFunctionalRequirements = {
            performance: [{ id: 'PERF-01', requirement: 'API endpoints must respond in < 200ms.', priority: 'High' }],
            security: [
              { id: 'SEC-01', requirement: 'All sensitive user data must be encrypted at rest.', priority: 'High' },
            ],
          };

          const result = nfrPlanSchema.safeParse(validNonFunctionalRequirements);
          expect(result.success).toBe(true);
          expect(byId['4.4'].safeParse(validNonFunctionalRequirements).success).toBe(true);
        });

        it('should reject non-functional requirements with invalid priority', () => {
          const invalidNonFunctionalRequirements = {
            performance: [
              { id: 'PERF-01', requirement: 'API endpoints must respond in < 200ms.', priority: 'Invalid' as any },
            ],
          };

          const result = nfrPlanSchema.safeParse(invalidNonFunctionalRequirements);
          expect(result.success).toBe(false);
          expect(byId['4.4'].safeParse(invalidNonFunctionalRequirements).success).toBe(false);
        });
      });

      describe('Non-Functional Requirements Schema (Task)', () => {
        const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        it('should validate a complete non-functional requirements object for task', () => {
          const validNonFunctionalRequirements = {
            performance: [
              { id: 'PERF-01', requirement: 'Task processing must complete within 5 seconds.', priority: 'High' },
            ],
            security: [{ id: 'SEC-01', requirement: 'Task data must be encrypted in transit.', priority: 'High' }],
            reliability: [{ id: 'REL-01', requirement: 'Task processing must be idempotent.', priority: 'High' }],
            permissionModel: [
              {
                role: 'Developer',
                permissions: ['Can create and modify tasks', 'Cannot delete tasks'],
                notes: 'For development team members.',
              },
            ],
          };

          const result = nfrTaskSchema.safeParse(validNonFunctionalRequirements);
          expect(result.success).toBe(true);
          expect(byIdTask['4.4'].safeParse(validNonFunctionalRequirements).success).toBe(true);
        });

        it('should reject non-functional requirements with missing required fields', () => {
          const invalidNonFunctionalRequirements = {
            performance: [
              { id: 'PERF-01', requirement: 'Task processing must complete within 5 seconds.' }, // Missing priority
            ],
          };

          const result = nfrTaskSchema.safeParse(invalidNonFunctionalRequirements);
          expect(result.success).toBe(false);
          expect(byIdTask['4.4'].safeParse(invalidNonFunctionalRequirements).success).toBe(false);
        });
      });

      describe('Target Architecture Subsection Tests', () => {
        describe('Data Models Schema (4.2.1)', () => {
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const targetArchPlanSchema = (planSchema.shape as any).targetArchitecture;
          const targetArchTaskSchema = (taskSchema.shape as any).targetArchitecture;

          it('should validate data models for plan', () => {
            const validData = { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' };
            expect(byId['4.2.1'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
              components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
              dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
              integrationPoints: {
                upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
                downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
            };
            expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid data models for plan', () => {
            const invalidData = { diagram: 'classDiagram A' }; // Wrong diagram type
            expect(byId['4.2.1'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { dataModels: { diagram: 'classDiagram A' } }; // Wrong diagram type
            expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate data models for task', () => {
            const validData = { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' };
            expect(byIdTask['4.2.1'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
              components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
              dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
              integrationPoints: {
                upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
                downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
            };
            expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid data models for task', () => {
            const invalidData = { diagram: 'graph TD A-->B' }; // Wrong diagram type
            expect(byIdTask['4.2.1'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { dataModels: { diagram: 'graph TD A-->B' } }; // Wrong diagram type
            expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Components Schema (4.2.2)', () => {
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const targetArchPlanSchema = (planSchema.shape as any).targetArchitecture;
          const targetArchTaskSchema = (taskSchema.shape as any).targetArchitecture;

          it('should validate components for plan', () => {
            const validData = { diagram: 'classDiagram\ndirection LR\nclass UserService' };
            expect(byId['4.2.2'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
              components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
              dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
              integrationPoints: {
                upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
                downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
            };
            expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid components for plan', () => {
            const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
            expect(byId['4.2.2'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { components: { diagram: 'erDiagram A' } }; // Wrong diagram type
            expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate components for task', () => {
            const validData = { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' };
            expect(byIdTask['4.2.2'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
              components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
              dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
              integrationPoints: {
                upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
                downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
            };
            expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid components for task', () => {
            const invalidData = { diagram: 'graph TD A-->B' }; // Wrong diagram type
            expect(byIdTask['4.2.2'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { components: { diagram: 'graph TD A-->B' } }; // Wrong diagram type
            expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Data Flow Schema (4.2.3)', () => {
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const targetArchPlanSchema = (planSchema.shape as any).targetArchitecture;
          const targetArchTaskSchema = (taskSchema.shape as any).targetArchitecture;

          it('should validate data flow for plan', () => {
            const validData = { diagram: 'graph TD\nA --> B\nB --> C' };
            expect(byId['4.2.3'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
              components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
              dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
              integrationPoints: {
                upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
                downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
            };
            expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid data flow for plan', () => {
            const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
            expect(byId['4.2.3'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { dataFlow: { diagram: 'erDiagram A' } }; // Wrong diagram type
            expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate data flow for task', () => {
            const validData = { diagram: 'graph TD\nInput --> Process --> Output' };
            expect(byIdTask['4.2.3'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
              components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
              dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
              integrationPoints: {
                upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
                downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
            };
            expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid data flow for task', () => {
            const invalidData = { diagram: 'classDiagram A' }; // Wrong diagram type
            expect(byIdTask['4.2.3'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { dataFlow: { diagram: 'classDiagram A' } }; // Wrong diagram type
            expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Control Flow Schema (4.2.4)', () => {
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const targetArchPlanSchema = (planSchema.shape as any).targetArchitecture;
          const targetArchTaskSchema = (taskSchema.shape as any).targetArchitecture;

          it('should validate control flow for plan', () => {
            const validData = { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' };
            expect(byId['4.2.4'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
              components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
              dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
              integrationPoints: {
                upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
                downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
            };
            expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid control flow for plan', () => {
            const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
            expect(byId['4.2.4'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { controlFlow: { diagram: 'erDiagram A' } }; // Wrong diagram type
            expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate control flow for task', () => {
            const validData = { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' };
            expect(byIdTask['4.2.4'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
              components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
              dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
              integrationPoints: {
                upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
                downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
              },
              exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
            };
            expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid control flow for task', () => {
            const invalidData = { diagram: 'graph TD A-->B' }; // Wrong diagram type
            expect(byIdTask['4.2.4'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = { controlFlow: { diagram: 'graph TD A-->B' } }; // Wrong diagram type
            expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Integration Points Schema (4.2.5)', () => {
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const targetArchPlanSchema = (planSchema.shape as any).targetArchitecture;
          const targetArchTaskSchema = (taskSchema.shape as any).targetArchitecture;

          it('should validate integration points for plan', () => {
            const validData = {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            };
            expect(byId['4.2.5'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
              components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
              dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
              integrationPoints: {
                upstream: [
                  {
                    trigger: 'User action via UI button click',
                    inputData: 'Receives documentId and userId from the client',
                  },
                ],
                downstream: [
                  {
                    trigger: 'Emits a DOCUMENT_PROCESSED event',
                    inputData: 'The event payload includes documentId and status',
                  },
                ],
              },
              exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
            };
            expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid integration points for plan', () => {
            const invalidData = {
              upstream: [{ trigger: '', inputData: 'Receives documentId and userId from the client' }], // Empty trigger
            };
            expect(byId['4.2.5'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              integrationPoints: {
                upstream: [{ trigger: '', inputData: 'Receives documentId and userId from the client' }], // Empty trigger
              },
            };
            expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate integration points for task', () => {
            const validData = {
              upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
              downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
            };
            expect(byIdTask['4.2.5'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
              components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
              dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
              controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
              integrationPoints: {
                upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
                downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
              },
              exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
            };
            expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid integration points for task', () => {
            const invalidData = {
              upstream: [{ trigger: 'Task creation event', inputData: '' }], // Empty inputData
            };
            expect(byIdTask['4.2.5'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              integrationPoints: {
                upstream: [{ trigger: 'Task creation event', inputData: '' }], // Empty inputData
              },
            };
            expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });
      });

      describe('Deep Nested Section Tests', () => {
        describe('Exposed API Schema (4.2.6)', () => {
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

          it('should validate exposed API via byId for plan', () => {
            const validData = 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID';
            expect(byId['4.2.6'].safeParse(validData).success).toBe(true);
          });

          it('should reject invalid exposed API via byId for plan', () => {
            const invalidData = ''; // Empty string
            expect(byId['4.2.6'].safeParse(invalidData).success).toBe(false);
          });

          it('should validate exposed API via byId for task', () => {
            const validData = 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task';
            expect(byIdTask['4.2.6'].safeParse(validData).success).toBe(true);
          });

          it('should reject invalid exposed API via byId for task', () => {
            const invalidData = ''; // Empty string
            expect(byIdTask['4.2.6'].safeParse(invalidData).success).toBe(false);
          });
        });

        describe('Integration Points Subsections', () => {
          describe('Upstream Integrations (4.1.5.1)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate upstream integrations via byId', () => {
              const validData = [{ trigger: 'User action', inputData: 'Receives userId' }];
              expect(byId['4.1.5.1'].safeParse(validData).success).toBe(true);
            });

            it('should reject invalid upstream integrations via byId', () => {
              const invalidData = [{ trigger: '', inputData: 'Receives userId' }]; // Empty trigger
              expect(byId['4.1.5.1'].safeParse(invalidData).success).toBe(false);
            });
          });

          describe('Downstream Integrations (4.1.5.2)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate downstream integrations via byId', () => {
              const validData = [{ trigger: 'Process complete', inputData: 'Emits result' }];
              expect(byId['4.1.5.2'].safeParse(validData).success).toBe(true);
            });

            it('should reject invalid downstream integrations via byId', () => {
              const invalidData = [{ trigger: 'Process complete', inputData: '' }]; // Empty inputData
              expect(byId['4.1.5.2'].safeParse(invalidData).success).toBe(false);
            });
          });

          describe('Target Upstream Integrations (4.2.5.1)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate target upstream integrations via byId for plan', () => {
              const validData = [{ trigger: 'User action', inputData: 'Receives userId' }];
              expect(byId['4.2.5.1'].safeParse(validData).success).toBe(true);
            });

            it('should validate target upstream integrations via byId for task', () => {
              const validData = [{ trigger: 'Task creation event', inputData: 'Receives taskId' }];
              expect(byIdTask['4.2.5.1'].safeParse(validData).success).toBe(true);
            });
          });

          describe('Target Downstream Integrations (4.2.5.2)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate target downstream integrations via byId for plan', () => {
              const validData = [{ trigger: 'Process complete', inputData: 'Emits result' }];
              expect(byId['4.2.5.2'].safeParse(validData).success).toBe(true);
            });

            it('should validate target downstream integrations via byId for task', () => {
              const validData = [{ trigger: 'Task completion event', inputData: 'Emits result' }];
              expect(byIdTask['4.2.5.2'].safeParse(validData).success).toBe(true);
            });
          });
        });

        describe('Non-Functional Requirements Subsections', () => {
          describe('Performance (4.4.1)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate performance requirements via byId for plan', () => {
              const validData = [{ id: 'PERF-01', requirement: 'API response < 200ms', priority: 'High' }];
              expect(byId['4.4.1'].safeParse(validData).success).toBe(true);
            });

            it('should validate performance requirements via byId for task', () => {
              const validData = [{ id: 'PERF-01', requirement: 'Task processing < 5 seconds', priority: 'High' }];
              expect(byIdTask['4.4.1'].safeParse(validData).success).toBe(true);
            });
          });

          describe('Security (4.4.2)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate security requirements via byId for plan', () => {
              const validData = [{ id: 'SEC-01', requirement: 'Encrypt data at rest', priority: 'High' }];
              expect(byId['4.4.2'].safeParse(validData).success).toBe(true);
            });

            it('should validate security requirements via byId for task', () => {
              const validData = [{ id: 'SEC-01', requirement: 'Encrypt task data in transit', priority: 'High' }];
              expect(byIdTask['4.4.2'].safeParse(validData).success).toBe(true);
            });
          });

          describe('Reliability (4.4.3)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate reliability requirements via byId for plan', () => {
              const validData = [{ id: 'REL-01', requirement: '99.9% uptime', priority: 'High' }];
              expect(byId['4.4.3'].safeParse(validData).success).toBe(true);
            });

            it('should validate reliability requirements via byId for task', () => {
              const validData = [{ id: 'REL-01', requirement: 'Task processing must be idempotent', priority: 'High' }];
              expect(byIdTask['4.4.3'].safeParse(validData).success).toBe(true);
            });
          });

          describe('Permission Model (4.4.4)', () => {
            const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

            it('should validate permission model via byId for plan', () => {
              const validData = [{ role: 'Admin', permissions: ['Full CRUD access'], notes: 'For administrators' }];
              expect(byId['4.4.4'].safeParse(validData).success).toBe(true);
            });

            it('should validate permission model via byId for task', () => {
              const validData = [{ role: 'Developer', permissions: ['Can create tasks'], notes: 'For developers' }];
              expect(byIdTask['4.4.4'].safeParse(validData).success).toBe(true);
            });
          });
        });
      });

      describe('Section Coverage Verification', () => {
        it('should log available byId sections for plan', () => {
          const planSchema = createHighLevelDesignSchema('plan') as any;
          const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;
          console.log('Available plan byId keys:', Object.keys(byId).sort());
        });

        it('should log available byId sections for task', () => {
          const taskSchema = createHighLevelDesignSchema('task') as any;
          const byId = taskSchema.__byId as Record<string, z.ZodTypeAny>;
          console.log('Available task byId keys:', Object.keys(byId).sort());
        });
      });
    });
  });

  describe('High-Level Design Schema (Complete Family)', () => {
    it('should validate a complete high-level design for a Plan', () => {
      const planSchema = createHighLevelDesignSchema('plan');
      const validPlanHighLevelDesign = {
        guidingPrinciples: [
          'All UI components must be stateless to allow for horizontal scaling.',
          'Communication between major components should be asynchronous and event-driven where possible.',
        ],
        currentArchitecture: {
          dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
          components: { diagram: 'classDiagram\ndirection LR\nclass ClientLogger' },
        },
        targetArchitecture: {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [
              {
                trigger: 'User action via UI button click',
                inputData: 'Receives documentId and userId from the client',
              },
            ],
            downstream: [
              {
                trigger: 'Emits a DOCUMENT_PROCESSED event',
                inputData: 'The event payload includes documentId and status',
              },
            ],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        },
        techStackDeployment: [
          { category: 'Language', technology: 'TypeScript' },
          { category: 'Framework', technology: 'Next.js' },
          { category: 'Deployment', technology: 'Vercel' },
        ],
        nonFunctionalRequirements: {
          performance: [
            {
              id: 'PERF-01',
              requirement: 'API endpoints must respond in < 200ms (95th percentile).',
              priority: 'High',
            },
          ],
          security: [
            {
              id: 'SEC-01',
              requirement: 'All sensitive user data must be encrypted at rest using AES-256.',
              priority: 'High',
            },
          ],
          reliability: [
            {
              id: 'REL-01',
              requirement: 'The service must maintain 99.9% uptime, measured monthly.',
              priority: 'High',
            },
          ],
          permissionModel: [
            {
              role: 'Admin',
              permissions: ['Full CRUD access to all documents', 'Can assign roles'],
              notes: 'For system administrators only.',
            },
          ],
        },
      };

      const result = planSchema.safeParse(validPlanHighLevelDesign);
      expect(result.success, result.success ? '' : JSON.stringify(result.error.issues, null, 2)).toBe(true);
    });

    it('should validate a complete high-level design for a Task', () => {
      const taskSchema = createHighLevelDesignSchema('task');
      const validTaskHighLevelDesign = {
        targetArchitecture: {
          dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
            downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
          },
          exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
        },
        techStackDeployment: [
          { category: 'Language', technology: 'TypeScript' },
          { category: 'Testing', technology: 'Vitest' },
        ],
        nonFunctionalRequirements: {
          performance: [
            { id: 'PERF-01', requirement: 'Task processing must complete within 5 seconds.', priority: 'High' },
          ],
          security: [{ id: 'SEC-01', requirement: 'Task data must be encrypted in transit.', priority: 'High' }],
        },
      };

      const result = taskSchema.safeParse(validTaskHighLevelDesign);
      expect(result.success, result.success ? '' : JSON.stringify(result.error.issues, null, 2)).toBe(true);
    });

    it('should reject high-level design with missing required sections for plan', () => {
      const planSchema = createHighLevelDesignSchema('plan');
      const invalidPlanHighLevelDesign = {
        // Missing required targetArchitecture
        guidingPrinciples: ['All UI components must be stateless to allow for horizontal scaling.'],
        currentArchitecture: {
          text: ['An existing system is in place.'],
        },
      };

      const result = planSchema.safeParse(invalidPlanHighLevelDesign);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('targetArchitecture');
      }
    });

    it('should reject high-level design with missing required sections for task', () => {
      const taskSchema = createHighLevelDesignSchema('task');
      const invalidTaskHighLevelDesign = {
        // Missing required targetArchitecture section
        techStackDeployment: [{ category: 'Language', technology: 'TypeScript' }],
      };

      const result = taskSchema.safeParse(invalidTaskHighLevelDesign);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('targetArchitecture');
      }
    });

    it('should reject high-level design with invalid diagram type', () => {
      const planSchema = createHighLevelDesignSchema('plan');
      const invalidHighLevelDesign = {
        guidingPrinciples: ['All UI components must be stateless to allow for horizontal scaling.'],
        currentArchitecture: {
          dataModels: { diagram: 'erDiagram\nLOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"' },
        },
        targetArchitecture: {
          dataModels: { diagram: 'graph TD\nA --> B' }, // Wrong diagram type for data models
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [
              {
                trigger: 'User action via UI button click',
                inputData: 'Receives documentId and userId from the client',
              },
            ],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        },
        techStackDeployment: [{ category: 'Language', technology: 'TypeScript' }],
        nonFunctionalRequirements: {
          performance: [{ id: 'PERF-01', requirement: 'API endpoints must respond in < 200ms.', priority: 'High' }],
        },
      };

      const result = planSchema.safeParse(invalidHighLevelDesign);
      expect(result.success).toBe(false);
      if (!result.success) {
        // The error should be in targetArchitecture.dataModels.diagram
        expect(result.error.issues[0].path).toEqual(['targetArchitecture', 'dataModels', 'diagram']);
      }
    });
  });

  describe('Individual Schema Tests (Backward Compatibility)', () => {
    describe('Guiding Principles Schema', () => {
      it('should validate a complete guiding principles array', () => {
        const validGuidingPrinciples = [
          'All UI components must be stateless to allow for horizontal scaling.',
          'Communication between major components should be asynchronous and event-driven where possible.',
          'All services must be idempotent to ensure reliability.',
        ];

        const result = (createHighLevelDesignSchema('plan').shape as any).guidingPrinciples.safeParse(
          validGuidingPrinciples
        );
        expect(result.success).toBe(true);
      });

      it('should reject guiding principles array with empty strings', () => {
        const invalidGuidingPrinciples = [
          'All UI components must be stateless.',
          '', // Empty string
          'All services must be idempotent.',
        ];

        const result = (createHighLevelDesignSchema('plan').shape as any).guidingPrinciples.safeParse(
          invalidGuidingPrinciples
        );
        expect(result.success).toBe(false);
      });

      it('should reject empty guiding principles array', () => {
        const invalidGuidingPrinciples: any[] = [];

        const result = (createHighLevelDesignSchema('plan').shape as any).guidingPrinciples.safeParse(
          invalidGuidingPrinciples
        );
        expect(result.success).toBe(false);
      });
    });

    describe('Integration Point Schema', () => {
      it('should validate a complete integration point via currentArchitecture section', () => {
        const validIntegrationPoint = {
          trigger: 'User action via UI button click',
          inputData: 'Receives documentId and userId from the client',
        };

        const currentArchitecture = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;
        const result = currentArchitecture.safeParse({ integrationPoints: { upstream: [validIntegrationPoint] } });
        expect(result.success).toBe(true);
      });

      it('should reject integration point with missing trigger via currentArchitecture section', () => {
        const invalidIntegrationPoint = {
          inputData: 'Receives documentId and userId from the client',
        } as any;

        const currentArchitecture = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;
        const result = currentArchitecture.safeParse({ integrationPoints: { upstream: [invalidIntegrationPoint] } });
        expect(result.success).toBe(false);
      });

      it('should reject integration point with empty inputData via currentArchitecture section', () => {
        const invalidIntegrationPoint = {
          trigger: 'User action via UI button click',
          inputData: '',
        };

        const currentArchitecture = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;
        const result = currentArchitecture.safeParse({ integrationPoints: { upstream: [invalidIntegrationPoint] } });
        expect(result.success).toBe(false);
      });
    });

    describe('Tech Stack Item Schema', () => {
      it('should validate a complete tech stack item', () => {
        const validTechStackItem = {
          category: 'Language',
          technology: 'TypeScript',
        };

        const result = (createHighLevelDesignSchema('plan').shape as any).techStackDeployment.element.safeParse(
          validTechStackItem
        );
        expect(result.success).toBe(true);
      });

      it('should reject tech stack item with missing category', () => {
        const invalidTechStackItem = {
          technology: 'TypeScript',
        };

        const result = (createHighLevelDesignSchema('plan').shape as any).techStackDeployment.element.safeParse(
          invalidTechStackItem as any
        );
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('category');
        }
      });

      it('should reject tech stack item with empty technology', () => {
        const invalidTechStackItem = {
          category: 'Language',
          technology: '',
        };

        const result = (createHighLevelDesignSchema('plan').shape as any).techStackDeployment.element.safeParse(
          invalidTechStackItem
        );
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('technology');
        }
      });
    });

    describe('Non-Functional Requirement Schema', () => {
      it('should validate a complete non-functional requirement', () => {
        const validNonFunctionalRequirement = {
          id: 'PERF-01',
          requirement: 'API endpoints must respond in < 200ms (95th percentile).',
          priority: 'High',
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ performance: [validNonFunctionalRequirement] });
        expect(result.success).toBe(true);
      });

      it('should reject non-functional requirement with missing ID', () => {
        const invalidNonFunctionalRequirement = {
          requirement: 'API endpoints must respond in < 200ms (95th percentile).',
          priority: 'High',
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ performance: [invalidNonFunctionalRequirement] });
        expect(result.success).toBe(false);
      });

      it('should reject non-functional requirement with invalid priority', () => {
        const invalidNonFunctionalRequirement = {
          id: 'PERF-01',
          requirement: 'API endpoints must respond in < 200ms (95th percentile).',
          priority: 'Invalid' as any,
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ performance: [invalidNonFunctionalRequirement] });
        expect(result.success).toBe(false);
      });
    });

    describe('Permission Role Schema', () => {
      it('should validate a complete permission role', () => {
        const validPermissionRole = {
          role: 'Admin',
          permissions: ['Full CRUD access to all documents', 'Can assign roles'],
          notes: 'For system administrators only.',
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ permissionModel: [validPermissionRole] });
        expect(result.success).toBe(true);
      });

      it('should validate permission role without notes', () => {
        const validPermissionRole = {
          role: 'Viewer',
          permissions: ['Read-only access to completed documents'],
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ permissionModel: [validPermissionRole] });
        expect(result.success).toBe(true);
      });

      it('should reject permission role with missing role', () => {
        const invalidPermissionRole = {
          permissions: ['Full CRUD access to all documents', 'Can assign roles'],
          notes: 'For system administrators only.',
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ permissionModel: [invalidPermissionRole as any] });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('role');
        }
      });

      it('should reject permission role with empty permissions array', () => {
        const invalidPermissionRole = {
          role: 'Admin',
          permissions: [], // Empty array
          notes: 'For system administrators only.',
        };

        const nfr = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
        const result = nfr.safeParse({ permissionModel: [invalidPermissionRole] });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('permissions');
        }
      });
    });
  });
});
