import { describe, it, expect } from 'vitest';
import { createMetaGovernanceSchema } from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema - Priority Drivers Section Tests', () => {
  describe('Priority Drivers Section as a Whole', () => {
    describe('Plan Priority Drivers Section (1.3)', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const priorityDriversPlanSchema = (createMetaGovernanceSchema('plan').shape as any).priorityDrivers;

      it('should validate complete plan priority drivers via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate complete plan priority drivers via composed schema', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'];
        expect(priorityDriversPlanSchema.safeParse(validData).success).toBe(true);
      });

      it('should validate single priority driver via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate single priority driver via composed schema', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement'];
        expect(priorityDriversPlanSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty priority drivers array via byId', () => {
        const invalidData: string[] = [];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty priority drivers array via composed schema', () => {
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

      it('should reject mixed valid and invalid drivers via byId', () => {
        const invalidData = ['TEC-Dev_Productivity_Enhancement', 'Invalid-Driver-Format'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject mixed valid and invalid drivers via composed schema', () => {
        const invalidData = ['TEC-Dev_Productivity_Enhancement', 'Invalid-Driver-Format'];
        expect(priorityDriversPlanSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Priority Drivers Section (1.3)', () => {
      const byId = (createMetaGovernanceSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const priorityDriversTaskSchema = (createMetaGovernanceSchema('task').shape as any).priorityDrivers;

      it('should validate complete task priority drivers via byId', () => {
        const validData = ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate complete task priority drivers via composed schema', () => {
        const validData = ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'];
        expect(priorityDriversTaskSchema.safeParse(validData).success).toBe(true);
      });

      it('should validate single task priority driver via byId', () => {
        const validData = ['TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate single task priority driver via composed schema', () => {
        const validData = ['TEC-Prod_Stability_Blocker'];
        expect(priorityDriversTaskSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty task priority drivers array via byId', () => {
        const invalidData: string[] = [];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty task priority drivers array via composed schema', () => {
        const invalidData: string[] = [];
        expect(priorityDriversTaskSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid task priority driver format via byId', () => {
        const invalidData = ['Invalid-Driver-Format'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject invalid task priority driver format via composed schema', () => {
        const invalidData = ['Invalid-Driver-Format'];
        expect(priorityDriversTaskSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject mixed valid and invalid task drivers via byId', () => {
        const invalidData = ['TEC-Prod_Stability_Blocker', 'Invalid-Driver-Format'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject mixed valid and invalid task drivers via composed schema', () => {
        const invalidData = ['TEC-Prod_Stability_Blocker', 'Invalid-Driver-Format'];
        expect(priorityDriversTaskSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Individual Driver Validation', () => {
    describe('Valid Priority Driver Formats', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate TEC drivers via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate CBP drivers via byId', () => {
        const validData = ['CBP-Break_Block_Revenue_Legal'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate mixed driver types via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement', 'CBP-Break_Block_Revenue_Legal'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate multiple drivers of same type via byId', () => {
        const validData = [
          'TEC-Dev_Productivity_Enhancement',
          'TEC-Prod_Stability_Blocker',
          'TEC-Dev_Productivity_Blocker',
        ];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });
    });

    describe('Invalid Priority Driver Formats', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;

      it('should reject drivers without prefix via byId', () => {
        const invalidData = ['Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject drivers with invalid prefix via byId', () => {
        const invalidData = ['INVALID-Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject drivers with invalid format via byId', () => {
        const invalidData = ['TEC_Dev_Productivity_Enhancement']; // Wrong separator
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty string drivers via byId', () => {
        const invalidData = ['TEC-Dev_Productivity_Enhancement', ''];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject drivers with special characters via byId', () => {
        const invalidData = ['TEC-Dev@Productivity#Enhancement'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Array Validation', () => {
    describe('Array Structure Validation', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate array with single element via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate array with multiple elements via byId', () => {
        const validData = [
          'TEC-Dev_Productivity_Enhancement',
          'TEC-Prod_Stability_Blocker',
          'CBP-Break_Block_Revenue_Legal',
        ];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should reject non-array input via byId', () => {
        const invalidData = 'TEC-Dev_Productivity_Enhancement';
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject array with non-string elements via byId', () => {
        const invalidData = ['TEC-Dev_Productivity_Enhancement', 123, 'TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject array with null elements via byId', () => {
        const invalidData = ['TEC-Dev_Productivity_Enhancement', null, 'TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject array with undefined elements via byId', () => {
        const invalidData = ['TEC-Dev_Productivity_Enhancement', undefined, 'TEC-Prod_Stability_Blocker'];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Array Length Validation', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;

      it('should reject empty array via byId', () => {
        const invalidData: string[] = [];
        expect(byId['1.3'].safeParse(invalidData).success).toBe(false);
      });

      it('should validate array with one element via byId', () => {
        const validData = ['TEC-Dev_Productivity_Enhancement'];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });

      it('should validate array with many elements via byId', () => {
        const validData = [
          'TEC-Dev_Productivity_Enhancement',
          'TEC-Prod_Stability_Blocker',
          'CBP-Break_Block_Revenue_Legal',
          'TEC-Dev_Productivity_Blocker',
          'CBP-SLA_Breach',
        ];
        expect(byId['1.3'].safeParse(validData).success).toBe(true);
      });
    });
  });

  describe('Document Type Applicability', () => {
    it('should have same validation rules for plan and task', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const taskSchema = createMetaGovernanceSchema('task');

      const planShape = (planSchema.shape as any).priorityDrivers;
      const taskShape = (taskSchema.shape as any).priorityDrivers;

      // Both should be arrays with same validation rules
      expect(planShape).toBeDefined();
      expect(taskShape).toBeDefined();
    });

    it('should validate same driver formats for plan and task', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const taskSchema = createMetaGovernanceSchema('task');

      const validData = ['TEC-Dev_Productivity_Enhancement', 'CBP-Break_Block_Revenue_Legal'];

      const planResult = planSchema.safeParse({
        priorityDrivers: validData,
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
      });
      const taskResult = taskSchema.safeParse({
        priorityDrivers: validData,
        status: {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        },
      });

      expect(planResult.success).toBe(true);
      expect(taskResult.success).toBe(true);
    });

    it('should reject same invalid formats for plan and task', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const taskSchema = createMetaGovernanceSchema('task');

      const invalidData = ['Invalid-Driver-Format'];

      const planResult = planSchema.safeParse({ priorityDrivers: invalidData });
      const taskResult = taskSchema.safeParse({
        priorityDrivers: invalidData,
        status: {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        },
      });

      expect(planResult.success).toBe(false);
      expect(taskResult.success).toBe(false);
    });
  });

  describe('Integration with Complete Document', () => {
    it('should validate priority drivers in complete plan document', () => {
      const planSchema = createMetaGovernanceSchema('plan');

      const validPlanData = {
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
        priorityDrivers: ['TEC-Dev_Productivity_Enhancement', 'CBP-Break_Block_Revenue_Legal'],
      };

      const result = planSchema.safeParse(validPlanData);
      expect(result.success).toBe(true);
    });

    it('should validate priority drivers in complete task document', () => {
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
        priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
      };

      const result = taskSchema.safeParse(validTaskData);
      expect(result.success).toBe(true);
    });

    it('should reject complete document with invalid priority drivers', () => {
      const planSchema = createMetaGovernanceSchema('plan');

      const invalidPlanData = {
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
        priorityDrivers: ['Invalid-Driver-Format'],
      };

      const result = planSchema.safeParse(invalidPlanData);
      expect(result.success).toBe(false);
    });
  });
});
