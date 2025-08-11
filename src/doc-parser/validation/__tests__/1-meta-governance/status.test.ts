import { describe, it, expect } from 'vitest';
import { createMetaGovernanceSchema } from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema - Status Section Tests', () => {
  describe('Status Section as a Whole', () => {
    describe('Plan Status Section (1.2)', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const statusPlanSchema = (createMetaGovernanceSchema('plan').shape as any).status;

      it('should validate complete plan status via byId', () => {
        const validData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        };
        expect(byId['1.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate complete plan status via composed schema', () => {
        const validData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        };
        expect(statusPlanSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject plan status with missing required fields via byId', () => {
        const invalidData = {
          created: '2025-07-24 16:20',
          // Missing lastUpdated
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject plan status with missing required fields via composed schema', () => {
        const invalidData = {
          created: '2025-07-24 16:20',
          // Missing lastUpdated
        };
        expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject plan status with task-only fields via byId', () => {
        const invalidData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
          currentState: 'Not Started', // Task-only field
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject plan status with task-only fields via composed schema', () => {
        const invalidData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
          currentState: 'Not Started', // Task-only field
        };
        expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject plan status with invalid date formats via byId', () => {
        const invalidData = {
          created: 'invalid-date',
          lastUpdated: '2025-07-24 16:20',
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject plan status with invalid date formats via composed schema', () => {
        const invalidData = {
          created: 'invalid-date',
          lastUpdated: '2025-07-24 16:20',
        };
        expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Status Section (1.2)', () => {
      const byId = (createMetaGovernanceSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const statusTaskSchema = (createMetaGovernanceSchema('task').shape as any).status;

      it('should validate complete task status via byId', () => {
        const validData = {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        expect(byId['1.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate complete task status via composed schema', () => {
        const validData = {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        expect(statusTaskSchema.safeParse(validData).success).toBe(true);
      });

      it('should validate task status with optional fields via byId', () => {
        const validData = {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          implementationStarted: '2025-08-03 10:00', // Optional field
          completed: '2025-08-03 18:00', // Optional field
        };
        expect(byId['1.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate task status with optional fields via composed schema', () => {
        const validData = {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          implementationStarted: '2025-08-03 10:00', // Optional field
          completed: '2025-08-03 18:00', // Optional field
        };
        expect(statusTaskSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject task status with missing required fields via byId', () => {
        const invalidData = {
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          // Missing required task fields: currentState, priority, progress, planningEstimate, estVariancePts
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject task status with missing required fields via composed schema', () => {
        const invalidData = {
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          // Missing required task fields: currentState, priority, progress, planningEstimate, estVariancePts
        };
        expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject task status with invalid field values via byId', () => {
        const invalidData = {
          currentState: 'Invalid Status',
          priority: 'Invalid Priority',
          progress: 150, // > 100
          planningEstimate: -1, // < 0
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject task status with invalid field values via composed schema', () => {
        const invalidData = {
          currentState: 'Invalid Status',
          priority: 'Invalid Priority',
          progress: 150, // > 100
          planningEstimate: -1, // < 0
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Document Type Applicability Tests', () => {
    it('should have different field requirements for plan vs task', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const taskSchema = createMetaGovernanceSchema('task');

      const planShape = (planSchema.shape as any).status.shape;
      const taskShape = (taskSchema.shape as any).status.shape;

      // Plan should only have created and lastUpdated
      expect(planShape.created).toBeDefined();
      expect(planShape.lastUpdated).toBeDefined();
      expect(planShape.currentState).toBeUndefined();
      expect(planShape.priority).toBeUndefined();
      expect(planShape.progress).toBeUndefined();

      // Task should have all fields
      expect(taskShape.created).toBeDefined();
      expect(taskShape.lastUpdated).toBeDefined();
      expect(taskShape.currentState).toBeDefined();
      expect(taskShape.priority).toBeDefined();
      expect(taskShape.progress).toBeDefined();
      expect(taskShape.planningEstimate).toBeDefined();
      expect(taskShape.estVariancePts).toBeDefined();
    });

    it('should validate plan-specific data structure', () => {
      const planSchema = createMetaGovernanceSchema('plan');

      const validPlanData = {
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
        priorityDrivers: ['TEC-Dev_Productivity_Enhancement'],
      };

      const result = planSchema.safeParse(validPlanData);
      expect(result.success).toBe(true);
    });

    it('should validate task-specific data structure', () => {
      const taskSchema = createMetaGovernanceSchema('task');

      const validTaskData = {
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

      const result = taskSchema.safeParse(validTaskData);
      expect(result.success).toBe(true);
    });
  });

  describe('Field-Level Validation Context', () => {
    describe('Plan Field Validation', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate created field in plan context', () => {
        const validData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        };
        const result = byId['1.2'].safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should validate lastUpdated field in plan context', () => {
        const validData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        };
        const result = byId['1.2'].safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid date format in plan context', () => {
        const invalidData = {
          created: 'invalid-date',
          lastUpdated: '2025-07-24 16:20',
        };
        const result = byId['1.2'].safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('Task Field Validation', () => {
      const byId = (createMetaGovernanceSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate all required task fields in context', () => {
        const validData = {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        const result = byId['1.2'].safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should validate optional task fields in context', () => {
        const validData = {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          implementationStarted: '2025-08-03 10:00',
          completed: '2025-08-03 18:00',
        };
        const result = byId['1.2'].safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid field combinations in task context', () => {
        const invalidData = {
          currentState: 'Invalid Status',
          priority: 'Invalid Priority',
          progress: 150,
          planningEstimate: -1,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        const result = byId['1.2'].safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });
});
