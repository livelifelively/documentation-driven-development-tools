import { describe, it, expect } from 'vitest';
import { createMetaGovernanceSchema } from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema - Section Tests', () => {
  describe('Plan-Specific Section Tests', () => {
    describe('Status Schema (Plan)', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const statusPlanSchema = (createMetaGovernanceSchema('plan').shape as any).status;

      it('should validate status via byId', () => {
        const validData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        };
        expect(byId['1.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate status via composed schema', () => {
        const validData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        };
        expect(statusPlanSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty status via byId', () => {
        const invalidData = {};
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty status via composed schema', () => {
        const invalidData = {};
        expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject status with task-only fields via byId', () => {
        const invalidData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
          currentState: 'Not Started', // Task-only field
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject status with task-only fields via composed schema', () => {
        const invalidData = {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
          currentState: 'Not Started', // Task-only field
        };
        expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Priority Drivers Schema (Plan)', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const priorityDriversPlanSchema = (createMetaGovernanceSchema('plan').shape as any).priorityDrivers;

      it('should validate priority drivers via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate priority drivers via composed schema', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'];
        expect(priorityDriversPlanSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty priority drivers via byId', () => {
        const invalidData: string[] = [];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty priority drivers via composed schema', () => {
        const invalidData: string[] = [];
        expect(priorityDriversPlanSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid priority driver format via byId', () => {
        const invalidData = ['Invalid-Driver-Format'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid priority driver format via composed schema', () => {
        const invalidData = ['Invalid-Driver-Format'];
        expect(priorityDriversPlanSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Task-Specific Section Tests', () => {
    describe('Status Schema (Task)', () => {
      const byId = (createMetaGovernanceSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const statusTaskSchema = (createMetaGovernanceSchema('task').shape as any).status;

      it('should validate status via byId', () => {
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

      it('should validate status via composed schema', () => {
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

      it('should reject status with missing required fields via byId', () => {
        const invalidData = {
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          // Missing required task fields
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject status with missing required fields via composed schema', () => {
        const invalidData = {
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
          // Missing required task fields
        };
        expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid status key via byId', () => {
        const invalidData = {
          currentState: 'Invalid Status',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid status key via composed schema', () => {
        const invalidData = {
          currentState: 'Invalid Status',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        };
        expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Priority Drivers Schema (Task)', () => {
      const byId = (createMetaGovernanceSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const priorityDriversTaskSchema = (createMetaGovernanceSchema('task').shape as any).priorityDrivers;

      it('should validate priority drivers via byId', () => {
        const validData = ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate priority drivers via composed schema', () => {
        const validData = ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'];
        expect(priorityDriversTaskSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty priority drivers via byId', () => {
        const invalidData: string[] = [];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty priority drivers via composed schema', () => {
        const invalidData: string[] = [];
        expect(priorityDriversTaskSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid priority driver format via byId', () => {
        const invalidData = ['Invalid-Driver-Format'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid priority driver format via composed schema', () => {
        const invalidData = ['Invalid-Driver-Format'];
        expect(priorityDriversTaskSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });
});
