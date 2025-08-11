import { describe, it, expect } from 'vitest';
import {
  createMetaGovernanceSchema,
  getMetaGovernancePlanSchema,
  getMetaGovernanceTaskSchema,
} from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createMetaGovernanceSchema', () => {
      it('should create a plan schema with all required sections', () => {
        const schema = createMetaGovernanceSchema('plan');
        const shape = schema.shape as any;

        expect(shape.status).toBeDefined();
        expect(shape.priorityDrivers).toBeDefined();
      });

      it('should create a task schema with all required sections', () => {
        const schema = createMetaGovernanceSchema('task');
        const shape = schema.shape as any;

        expect(shape.status).toBeDefined();
        expect(shape.priorityDrivers).toBeDefined();
      });

      it('should register sections in byId index for plan', () => {
        const schema = createMetaGovernanceSchema('plan');
        const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId['1.2']).toBeDefined(); // Status
        expect(byId['1.3']).toBeDefined(); // Priority Drivers
      });

      it('should register sections in byId index for task', () => {
        const schema = createMetaGovernanceSchema('task');
        const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId['1.2']).toBeDefined(); // Status
        expect(byId['1.3']).toBeDefined(); // Priority Drivers
      });

      it('should validate complete plan document', () => {
        const schema = createMetaGovernanceSchema('plan');
        const validPlan = {
          status: {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          },
          priorityDrivers: ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'],
        };

        const result = schema.safeParse(validPlan);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const schema = createMetaGovernanceSchema('task');
        const validTask = {
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
        };

        const result = schema.safeParse(validTask);
        expect(result.success).toBe(true);
      });

      it('should reject plan document with task-only fields', () => {
        const schema = createMetaGovernanceSchema('plan');
        const invalidPlan = {
          status: {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
            currentState: 'Not Started', // Task-only field
          },
          priorityDrivers: ['TEC-Dev_Productivity_Enhancement'],
        };

        const result = schema.safeParse(invalidPlan);
        expect(result.success).toBe(false);
      });

      it('should reject task document with missing required fields', () => {
        const schema = createMetaGovernanceSchema('task');
        const invalidTask = {
          status: {
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
            // Missing required task fields
          },
          priorityDrivers: ['TEC-Prod_Stability_Blocker'],
        };

        const result = schema.safeParse(invalidTask);
        expect(result.success).toBe(false);
      });
    });

    describe('Convenience Functions', () => {
      it('should provide getMetaGovernancePlanSchema function', () => {
        const planSchema = getMetaGovernancePlanSchema();
        expect(planSchema).toBeDefined();

        const validPlan = {
          status: {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          },
          priorityDrivers: ['TEC-Dev_Productivity_Enhancement'],
        };

        const result = planSchema.safeParse(validPlan);
        expect(result.success).toBe(true);
      });

      it('should provide getMetaGovernanceTaskSchema function', () => {
        const taskSchema = getMetaGovernanceTaskSchema();
        expect(taskSchema).toBeDefined();

        const validTask = {
          status: {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          },
          priorityDrivers: ['TEC-Prod_Stability_Blocker'],
        };

        const result = taskSchema.safeParse(validTask);
        expect(result.success).toBe(true);
      });

      it('should return equivalent schemas from convenience functions', () => {
        const directPlanSchema = createMetaGovernanceSchema('plan');
        const conveniencePlanSchema = getMetaGovernancePlanSchema();

        const directTaskSchema = createMetaGovernanceSchema('task');
        const convenienceTaskSchema = getMetaGovernanceTaskSchema();

        // Test that they produce the same validation results
        const validPlan = {
          status: {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          },
          priorityDrivers: ['TEC-Dev_Productivity_Enhancement'],
        };

        const directResult = directPlanSchema.safeParse(validPlan);
        const convenienceResult = conveniencePlanSchema.safeParse(validPlan);

        expect(directResult.success).toBe(convenienceResult.success);
      });
    });
  });
});
