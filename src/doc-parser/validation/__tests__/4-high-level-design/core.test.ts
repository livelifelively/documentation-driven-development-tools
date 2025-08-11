import { describe, it, expect } from 'vitest';
import {
  createHighLevelDesignSchema,
  getHighLevelDesignTaskSchema,
  getHighLevelDesignPlanSchema,
} from '../../4-high-level-design.schema.js';
import { z } from 'zod';

describe('High-Level Design Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createHighLevelDesignSchema', () => {
      it('should create a plan schema with all required sections', () => {
        const planSchema = createHighLevelDesignSchema('plan');
        const shape = planSchema.shape as any;

        expect(shape.guidingPrinciples).toBeDefined();
        expect(shape.currentArchitecture).toBeDefined();
        expect(shape.targetArchitecture).toBeDefined();
        expect(shape.techStackDeployment).toBeDefined();
        expect(shape.nonFunctionalRequirements).toBeDefined();
      });

      it('should create a task schema with only task-specific sections', () => {
        const taskSchema = createHighLevelDesignSchema('task');
        const shape = taskSchema.shape as any;

        expect(shape.guidingPrinciples).toBeUndefined();
        expect(shape.currentArchitecture).toBeUndefined();
        expect(shape.targetArchitecture).toBeDefined();
        expect(shape.techStackDeployment).toBeDefined();
        expect(shape.nonFunctionalRequirements).toBeDefined();
      });

      it('should register sections in byId index for plan', () => {
        const planSchema = createHighLevelDesignSchema('plan') as any;
        const byId = planSchema.__byId as Record<string, z.ZodTypeAny>;

        expect(byId['4.0']).toBeDefined(); // Guiding Principles
        expect(byId['4.1']).toBeDefined(); // Current Architecture
        expect(byId['4.2']).toBeDefined(); // Target Architecture
        expect(byId['4.3']).toBeDefined(); // Tech Stack & Deployment
        expect(byId['4.4']).toBeDefined(); // Non-Functional Requirements
      });

      it('should register sections in byId index for task', () => {
        const taskSchema = createHighLevelDesignSchema('task') as any;
        const byId = taskSchema.__byId as Record<string, z.ZodTypeAny>;

        expect(byId['4.0']).toBeUndefined(); // Guiding Principles (not for tasks)
        expect(byId['4.1']).toBeUndefined(); // Current Architecture (not for tasks)
        expect(byId['4.2']).toBeDefined(); // Target Architecture
        expect(byId['4.3']).toBeDefined(); // Tech Stack & Deployment
        expect(byId['4.4']).toBeDefined(); // Non-Functional Requirements
      });

      it('should validate complete plan document', () => {
        const planSchema = createHighLevelDesignSchema('plan');
        const validPlan = {
          guidingPrinciples: ['Principle 1', 'Principle 2'],
          currentArchitecture: {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
              downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
            },
          },
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
              downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
            },
            exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
          },
          techStackDeployment: [
            { category: 'Backend', technology: 'Node.js' },
            { category: 'Database', technology: 'PostgreSQL' },
            { category: 'Frontend', technology: 'React' },
          ],
          nonFunctionalRequirements: {
            performance: [{ id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' }],
            security: [{ id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' }],
            reliability: [{ id: 'REL-01', requirement: '99.9% uptime', priority: 'High' }],
            permissionModel: [{ role: 'Admin', permissions: ['Full access'], notes: 'System administrators' }],
          },
        };

        const result = planSchema.safeParse(validPlan);
        if (!result.success) {
          console.log('Plan validation errors:', result.error.issues);
        }
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const taskSchema = createHighLevelDesignSchema('task');
        const validTask = {
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
            components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
            dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
            integrationPoints: {
              upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
              downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
            },
            exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
          },
          techStackDeployment: [
            { category: 'Processing', technology: 'Python' },
            { category: 'Queue', technology: 'Redis' },
          ],
          nonFunctionalRequirements: {
            performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
            security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
            reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
            permissionModel: [
              { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
            ],
          },
        };

        const result = taskSchema.safeParse(validTask);
        if (!result.success) {
          console.log('Task validation errors:', result.error.issues);
        }
        expect(result.success).toBe(true);
      });

      it('should reject plan document with task-only sections', () => {
        const planSchema = createHighLevelDesignSchema('plan');
        const invalidPlan = {
          // Missing required plan sections
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          },
        };

        expect(planSchema.safeParse(invalidPlan).success).toBe(false);
      });

      it('should reject task document with plan-only sections', () => {
        const taskSchema = createHighLevelDesignSchema('task');
        const invalidTask = {
          guidingPrinciples: ['This should not be in tasks'], // Plan-only section
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          },
        };

        expect(taskSchema.safeParse(invalidTask).success).toBe(false);
      });
    });

    describe('Convenience Functions', () => {
      it('should provide getHighLevelDesignPlanSchema function', () => {
        const planSchema = getHighLevelDesignPlanSchema();
        expect(planSchema).toBeDefined();
        expect(typeof planSchema.safeParse).toBe('function');
      });

      it('should provide getHighLevelDesignTaskSchema function', () => {
        const taskSchema = getHighLevelDesignTaskSchema();
        expect(taskSchema).toBeDefined();
        expect(typeof taskSchema.safeParse).toBe('function');
      });

      it('should return equivalent schemas from convenience functions', () => {
        const planSchema1 = createHighLevelDesignSchema('plan');
        const planSchema2 = getHighLevelDesignPlanSchema();

        const taskSchema1 = createHighLevelDesignSchema('task');
        const taskSchema2 = getHighLevelDesignTaskSchema();

        // Test with same data
        const testData = {
          targetArchitecture: {
            dataModels: { diagram: 'erDiagram\nTEST' },
          },
        };

        expect(planSchema1.safeParse(testData).success).toBe(planSchema2.safeParse(testData).success);
        expect(taskSchema1.safeParse(testData).success).toBe(taskSchema2.safeParse(testData).success);
      });
    });
  });
});
