import { describe, it, expect } from 'vitest';
import { createMetaGovernanceSchema } from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema Validation', () => {
  describe('Factory Function Tests', () => {
    describe('createMetaGovernanceSchema', () => {
      it('should create task schema with task-specific sections', () => {
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

      it('should create plan schema with plan-specific sections', () => {
        const planSchema = createMetaGovernanceSchema('plan');
        const validPlanData = {
          status: {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          },
          priorityDrivers: ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'],
        };

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });

      it('should omit plan-specific fields from task schema', () => {
        const taskSchema = createMetaGovernanceSchema('task');

        // Test that validation passes with only task-specific fields
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

        const validResult = taskSchema.safeParse(validTaskData);
        expect(validResult.success).toBe(true);

        // Verify that the schema shape only includes task-specific fields
        const statusShape = (taskSchema.shape.status as z.ZodObject<any>).shape;
        expect(statusShape).toHaveProperty('currentState');
        expect(statusShape).toHaveProperty('priority');
        expect(statusShape).toHaveProperty('progress');
        expect(statusShape).toHaveProperty('planningEstimate');
        expect(statusShape).toHaveProperty('estVariancePts');
      });

      it('should omit task-specific fields from plan schema', () => {
        const planSchema = createMetaGovernanceSchema('plan');

        // Test that validation passes with only plan-specific fields
        const validPlanData = {
          status: {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          },
          priorityDrivers: ['TEC-Dev_Productivity_Enhancement'],
        };

        const validResult = planSchema.safeParse(validPlanData);
        expect(validResult.success).toBe(true);

        // Verify that the schema shape only includes plan-specific fields
        const statusShape = (planSchema.shape.status as z.ZodObject<any>).shape;
        expect(statusShape).toHaveProperty('created');
        expect(statusShape).toHaveProperty('lastUpdated');
        expect(statusShape).not.toHaveProperty('currentState');
        expect(statusShape).not.toHaveProperty('priority');
        expect(statusShape).not.toHaveProperty('progress');
      });
    });
  });

  describe('Individual Section Tests', () => {
    describe('Plan-Specific Section Tests', () => {
      // Use a single shape variable for brevity
      const planShape = createMetaGovernanceSchema('plan').shape as any;

      describe('Status Schema (Plan)', () => {
        const planStatusSchema = planShape.status;

        it('should validate a valid plan status object', () => {
          const validPlanStatus = {
            created: '2025-08-01 12:00',
            lastUpdated: '2025-08-02 14:00',
          };
          const result = planStatusSchema.safeParse(validPlanStatus);
          expect(result.success).toBe(true);
        });

        it('should reject a plan status object with task-only fields', () => {
          const invalidPlanStatus = {
            created: '2025-08-01 12:00',
            lastUpdated: '2025-08-02 14:00',
            priority: 'High', // Invalid field for a plan
          };
          const result = planStatusSchema.safeParse(invalidPlanStatus);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].message).toContain('Unrecognized key');
          }
        });

        it('should reject invalid date format for plan', () => {
          const invalidPlanStatus = {
            created: '2025-08-01', // Invalid format - missing time
            lastUpdated: '2025-08-02 14:00',
          };
          const result = planStatusSchema.safeParse(invalidPlanStatus);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('created');
          }
        });
      });

      describe('Priority Drivers Schema (Plan)', () => {
        const planPriorityDriversSchema = planShape.priorityDrivers;

        it('should validate valid priority drivers for plan', () => {
          const validPriorityDrivers = [
            'CBP-Break_Block_Revenue_Legal',
            'TEC-Prod_Stability_Blocker',
            'TEC-Dev_Productivity_Enhancement',
          ];

          const result = planPriorityDriversSchema.safeParse(validPriorityDrivers);
          expect(result.success).toBe(true);
        });

        it('should reject invalid priority driver format for plan', () => {
          const invalidPriorityDrivers = [
            'CBP-Break_Block_Revenue_Legal',
            'INVALID-FORMAT', // Invalid format
            'TEC-Prod_Stability_Blocker',
          ];

          const result = planPriorityDriversSchema.safeParse(invalidPriorityDrivers);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain(1);
          }
        });

        it('should reject empty priority drivers array for plan', () => {
          const result = planPriorityDriversSchema.safeParse([]);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('Task-Specific Section Tests', () => {
      const taskShape = createMetaGovernanceSchema('task').shape as any;

      describe('Status Schema (Task)', () => {
        const taskStatusSchema = taskShape.status;

        it('should validate a complete task status', () => {
          const validTaskStatus = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            implementationStarted: '2025-08-03 10:00',
            completed: '2025-08-03 15:00',
            lastUpdated: '2025-08-03 21:35',
          };

          const result = taskStatusSchema.safeParse(validTaskStatus);
          expect(result.success).toBe(true);
        });

        it('should validate a task status without optional fields', () => {
          const validTaskStatus = {
            currentState: 'Complete',
            priority: 'Medium',
            progress: 100,
            planningEstimate: 3,
            estVariancePts: 0,
            created: '2025-08-02 09:08',
            lastUpdated: '2025-08-02 10:05',
          };

          const result = taskStatusSchema.safeParse(validTaskStatus);
          expect(result.success).toBe(true);
        });

        it('should reject invalid status key for task', () => {
          const invalidTaskStatus = {
            currentState: 'Invalid Status',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };

          const result = taskStatusSchema.safeParse(invalidTaskStatus);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('currentState');
          }
        });

        it('should reject invalid priority level for task', () => {
          const invalidTaskStatus = {
            currentState: 'Not Started',
            priority: 'Invalid Priority',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };

          const result = taskStatusSchema.safeParse(invalidTaskStatus);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('priority');
          }
        });

        it('should reject invalid date format for task', () => {
          const invalidTaskStatus = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03', // Invalid format - missing time
            lastUpdated: '2025-08-03 21:35',
          };

          const result = taskStatusSchema.safeParse(invalidTaskStatus);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('created');
          }
        });

        it('should reject progress outside valid range for task', () => {
          const invalidTaskStatus = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 150, // Invalid - exceeds 100
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };

          const result = taskStatusSchema.safeParse(invalidTaskStatus);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('progress');
          }
        });
      });

      describe('Priority Drivers Schema (Task)', () => {
        const taskPriorityDriversSchema = taskShape.priorityDrivers;

        it('should validate valid priority drivers for task', () => {
          const validPriorityDrivers = [
            'CBP-Break_Block_Revenue_Legal',
            'TEC-Prod_Stability_Blocker',
            'TEC-Dev_Productivity_Enhancement',
          ];

          const result = taskPriorityDriversSchema.safeParse(validPriorityDrivers);
          expect(result.success).toBe(true);
        });

        it('should reject invalid priority driver format for task', () => {
          const invalidPriorityDrivers = [
            'CBP-Break_Block_Revenue_Legal',
            'INVALID-FORMAT', // Invalid format
            'TEC-Prod_Stability_Blocker',
          ];

          const result = taskPriorityDriversSchema.safeParse(invalidPriorityDrivers);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain(1);
          }
        });

        it('should reject empty priority drivers array for task', () => {
          const result = taskPriorityDriversSchema.safeParse([]);
          expect(result.success).toBe(false);
        });
      });
    });
  });

  describe('Meta Governance Schema (Complete Family)', () => {
    it('should validate a complete meta governance for a Plan', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const validPlanMetaGovernance = {
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
        priorityDrivers: ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'],
      };

      const result = planSchema.safeParse(validPlanMetaGovernance);
      expect(result.success).toBe(true);
    });

    it('should validate a complete meta governance for a Task', () => {
      const taskSchema = createMetaGovernanceSchema('task');
      const validTaskMetaGovernance = {
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

      const result = taskSchema.safeParse(validTaskMetaGovernance);
      expect(result.success).toBe(true);
    });

    it('should reject meta governance with missing status', () => {
      const taskSchema = createMetaGovernanceSchema('task');
      const invalidMetaGovernance = {
        priorityDrivers: ['TEC-Prod_Stability_Blocker'],
      };

      const result = taskSchema.safeParse(invalidMetaGovernance);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('status');
      }
    });

    it('should reject meta governance with missing priority drivers', () => {
      const taskSchema = createMetaGovernanceSchema('task');
      const invalidMetaGovernance = {
        status: {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariancePts: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        },
      };

      const result = taskSchema.safeParse(invalidMetaGovernance);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('priorityDrivers');
      }
    });
  });
});
