import { describe, it, expect } from 'vitest';
import {
  createHighLevelDesignSchema,
  getHighLevelDesignTaskSchema,
  getHighLevelDesignPlanSchema,
} from '../../4-high-level-design.schema.js';
import { z } from 'zod';

describe('High-Level Design Schema - Section Tests', () => {
  describe('Plan-Specific Section Tests', () => {
    describe('Guiding Principles Schema (Plan)', () => {
      const planSchema = createHighLevelDesignSchema('plan') as any;
      const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;
      const guidingPrinciplesSchema = (planSchema.shape as any).guidingPrinciples;

      it('should validate guiding principles via byId', () => {
        const validData = ['Principle 1', 'Principle 2', 'Principle 3'];
        expect(byId['4.0'].safeParse(validData).success).toBe(true);
      });

      it('should validate guiding principles via composed schema', () => {
        const validData = ['Principle 1', 'Principle 2', 'Principle 3'];
        expect(guidingPrinciplesSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty guiding principles via byId', () => {
        const invalidData: string[] = [];
        expect(byId['4.0'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty guiding principles via composed schema', () => {
        const invalidData: string[] = [];
        expect(guidingPrinciplesSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject guiding principles with empty strings via byId', () => {
        const invalidData = ['Principle 1', '', 'Principle 3'];
        expect(byId['4.0'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject guiding principles with empty strings via composed schema', () => {
        const invalidData = ['Principle 1', '', 'Principle 3'];
        expect(guidingPrinciplesSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Current Architecture Schema (Plan)', () => {
      const planSchema = createHighLevelDesignSchema('plan') as any;
      const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;
      const currentArchSchema = (planSchema.shape as any).currentArchitecture;

      it('should validate current architecture with subsections via byId', () => {
        const validData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
            downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
          },
        };
        expect(byId['4.1'].safeParse(validData).success).toBe(true);
      });

      it('should validate current architecture with subsections via composed schema', () => {
        const validData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
            downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
          },
        };
        expect(currentArchSchema.safeParse(validData).success).toBe(true);
      });

      it('should validate current architecture with text only via byId', () => {
        const validData = { text: ['This is a greenfield project.'] };
        expect(byId['4.1'].safeParse(validData).success).toBe(true);
      });

      it('should validate current architecture with text only via composed schema', () => {
        const validData = { text: ['This is a greenfield project.'] };
        expect(currentArchSchema.safeParse(validData).success).toBe(true);
      });

      it('should validate current architecture with both text and subsections via byId', () => {
        const validData = {
          text: ['Describing the existing system.'],
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
        };
        expect(byId['4.1'].safeParse(validData).success).toBe(true);
      });

      it('should validate current architecture with both text and subsections via composed schema', () => {
        const validData = {
          text: ['Describing the existing system.'],
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
        };
        expect(currentArchSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty current architecture via byId', () => {
        const invalidData = {};
        expect(byId['4.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty current architecture via composed schema', () => {
        const invalidData = {};
        expect(currentArchSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Both Plan and Task Section Tests', () => {
    describe('Target Architecture Schema (Plan)', () => {
      const planSchema = createHighLevelDesignSchema('plan') as any;
      const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;
      const targetArchSchema = (planSchema.shape as any).targetArchitecture;

      it('should validate target architecture with subsections via byId', () => {
        const validData = {
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
        expect(byId['4.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target architecture with subsections via composed schema', () => {
        const validData = {
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
        expect(targetArchSchema.safeParse(validData).success).toBe(true);
      });

      it('should validate target architecture with text only via byId', () => {
        const validData = { text: ['This is the target architecture.'] };
        expect(byId['4.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target architecture with text only via composed schema', () => {
        const validData = { text: ['This is the target architecture.'] };
        expect(targetArchSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty target architecture via byId', () => {
        const invalidData = {};
        expect(byId['4.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty target architecture via composed schema', () => {
        const invalidData = {};
        expect(targetArchSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Target Architecture Schema (Task)', () => {
      const taskSchema = createHighLevelDesignSchema('task') as any;
      const byId = taskSchema.__byId as Record<string, z.ZodTypeAny>;
      const targetArchSchema = (taskSchema.shape as any).targetArchitecture;

      it('should validate target architecture with subsections via byId', () => {
        const validData = {
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
        expect(byId['4.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target architecture with subsections via composed schema', () => {
        const validData = {
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
        expect(targetArchSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject invalid target architecture via byId', () => {
        const invalidData = { invalidField: 'should not be here' };
        expect(byId['4.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid target architecture via composed schema', () => {
        const invalidData = { invalidField: 'should not be here' };
        expect(targetArchSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Tech Stack & Deployment Schema (Plan)', () => {
      const planSchema = createHighLevelDesignSchema('plan') as any;
      const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;
      const techStackSchema = (planSchema.shape as any).techStackDeployment;

      it('should validate tech stack and deployment via byId', () => {
        const validData = [
          { category: 'Backend', technology: 'Node.js' },
          { category: 'Database', technology: 'PostgreSQL' },
          { category: 'Frontend', technology: 'React' },
        ];
        expect(byId['4.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate tech stack and deployment via composed schema', () => {
        const validData = [
          { category: 'Backend', technology: 'Node.js' },
          { category: 'Database', technology: 'PostgreSQL' },
          { category: 'Frontend', technology: 'React' },
        ];
        expect(techStackSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject tech stack with empty category via byId', () => {
        const invalidData = {
          techStack: [{ category: '', technology: 'Node.js' }],
          deployment: {
            environment: 'AWS',
            infrastructure: 'ECS with Fargate',
            scaling: 'Auto-scaling based on CPU usage',
          },
        };
        expect(byId['4.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject tech stack with empty category via composed schema', () => {
        const invalidData = [{ category: '', technology: 'Node.js' }];
        expect(techStackSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Tech Stack & Deployment Schema (Task)', () => {
      const taskSchema = createHighLevelDesignSchema('task') as any;
      const byId = taskSchema.__byId as Record<string, z.ZodTypeAny>;
      const techStackSchema = (taskSchema.shape as any).techStackDeployment;

      it('should validate tech stack and deployment via byId', () => {
        const validData = [
          { category: 'Processing', technology: 'Python' },
          { category: 'Queue', technology: 'Redis' },
        ];
        expect(byId['4.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate tech stack and deployment via composed schema', () => {
        const validData = [
          { category: 'Processing', technology: 'Python' },
          { category: 'Queue', technology: 'Redis' },
        ];
        expect(techStackSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject deployment with missing required fields via byId', () => {
        const invalidData = [
          { category: '', technology: 'Python' }, // Empty category
        ];
        expect(byId['4.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject deployment with missing required fields via composed schema', () => {
        const invalidData = [
          { category: '', technology: 'Python' }, // Empty category
        ];
        expect(techStackSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Non-Functional Requirements Schema (Plan)', () => {
      const planSchema = createHighLevelDesignSchema('plan') as any;
      const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;
      const nonFuncSchema = (planSchema.shape as any).nonFunctionalRequirements;

      it('should validate non-functional requirements via byId', () => {
        const validData = {
          performance: [
            { id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' },
            { id: 'PERF-02', requirement: 'Database query time < 50ms', priority: 'Medium' },
          ],
          security: [
            { id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' },
            { id: 'SEC-02', requirement: 'JWT token expiration < 1 hour', priority: 'High' },
          ],
          reliability: [
            { id: 'REL-01', requirement: '99.9% uptime', priority: 'High' },
            { id: 'REL-02', requirement: 'Graceful degradation on failures', priority: 'Medium' },
          ],
          permissionModel: [
            { role: 'Admin', permissions: ['Full access'], notes: 'System administrators' },
            { role: 'User', permissions: ['Read', 'Write'], notes: 'Regular users' },
          ],
        };
        expect(byId['4.4'].safeParse(validData).success).toBe(true);
      });

      it('should validate non-functional requirements via composed schema', () => {
        const validData = {
          performance: [
            { id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' },
            { id: 'PERF-02', requirement: 'Database query time < 50ms', priority: 'Medium' },
          ],
          security: [
            { id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' },
            { id: 'SEC-02', requirement: 'JWT token expiration < 1 hour', priority: 'High' },
          ],
          reliability: [
            { id: 'REL-01', requirement: '99.9% uptime', priority: 'High' },
            { id: 'REL-02', requirement: 'Graceful degradation on failures', priority: 'Medium' },
          ],
          permissionModel: [
            { role: 'Admin', permissions: ['Full access'], notes: 'System administrators' },
            { role: 'User', permissions: ['Read', 'Write'], notes: 'Regular users' },
          ],
        };
        expect(nonFuncSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject non-functional requirements with invalid priority via byId', () => {
        const invalidData = {
          performance: [{ id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'Invalid' }],
        };
        expect(byId['4.4'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject non-functional requirements with invalid priority via composed schema', () => {
        const invalidData = {
          performance: [{ id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'Invalid' }],
        };
        expect(nonFuncSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Non-Functional Requirements Schema (Task)', () => {
      const taskSchema = createHighLevelDesignSchema('task') as any;
      const byId = taskSchema.__byId as Record<string, z.ZodTypeAny>;
      const nonFuncSchema = (taskSchema.shape as any).nonFunctionalRequirements;

      it('should validate non-functional requirements via byId', () => {
        const validData = {
          performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
          security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
          reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
          permissionModel: [
            { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
          ],
        };
        expect(byId['4.4'].safeParse(validData).success).toBe(true);
      });

      it('should validate non-functional requirements via composed schema', () => {
        const validData = {
          performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
          security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
          reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
          permissionModel: [
            { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
          ],
        };
        expect(nonFuncSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject non-functional requirements with empty id via byId', () => {
        const invalidData = {
          performance: [{ id: '', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
        };
        expect(byId['4.4'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject non-functional requirements with empty id via composed schema', () => {
        const invalidData = {
          performance: [{ id: '', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
        };
        expect(nonFuncSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });
});
