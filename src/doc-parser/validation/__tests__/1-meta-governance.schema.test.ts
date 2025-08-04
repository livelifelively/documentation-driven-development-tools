import { describe, it, expect } from 'vitest';
import {
  MetaGovernanceFamilySchema,
  TaskStatusSchema,
  PlanStatusSchema,
  PriorityDriversSchema,
} from '../1-meta-governance.schema';

describe('Meta & Governance Schema Validation', () => {
  describe('Task Status Schema', () => {
    it('should validate a complete task status', () => {
      const validTaskStatus = {
        currentState: 'Not Started',
        priority: 'High',
        progress: 0,
        planningEstimate: 5,
        estVariance: 0,
        created: '2025-08-03 06:13',
        implementationStarted: '2025-08-03 10:00',
        completed: '2025-08-03 15:00',
        lastUpdated: '2025-08-03 21:35',
      };

      const result = TaskStatusSchema.safeParse(validTaskStatus);
      expect(result.success).toBe(true);
    });

    it('should validate a task status without optional fields', () => {
      const validTaskStatus = {
        currentState: 'Complete',
        priority: 'Medium',
        progress: 100,
        planningEstimate: 3,
        estVariance: 0,
        created: '2025-08-02 09:08',
        lastUpdated: '2025-08-02 10:05',
      };

      const result = TaskStatusSchema.safeParse(validTaskStatus);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status key', () => {
      const invalidTaskStatus = {
        currentState: 'Invalid Status',
        priority: 'High',
        progress: 0,
        planningEstimate: 5,
        estVariance: 0,
        created: '2025-08-03 06:13',
        lastUpdated: '2025-08-03 21:35',
      };

      const result = TaskStatusSchema.safeParse(invalidTaskStatus);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('currentState');
      }
    });

    it('should reject invalid priority level', () => {
      const invalidTaskStatus = {
        currentState: 'Not Started',
        priority: 'Invalid Priority',
        progress: 0,
        planningEstimate: 5,
        estVariance: 0,
        created: '2025-08-03 06:13',
        lastUpdated: '2025-08-03 21:35',
      };

      const result = TaskStatusSchema.safeParse(invalidTaskStatus);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('priority');
      }
    });

    it('should reject invalid date format', () => {
      const invalidTaskStatus = {
        currentState: 'Not Started',
        priority: 'High',
        progress: 0,
        planningEstimate: 5,
        estVariance: 0,
        created: '2025-08-03', // Invalid format - missing time
        lastUpdated: '2025-08-03 21:35',
      };

      const result = TaskStatusSchema.safeParse(invalidTaskStatus);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('created');
      }
    });

    it('should reject progress outside valid range', () => {
      const invalidTaskStatus = {
        currentState: 'Not Started',
        priority: 'High',
        progress: 150, // Invalid - exceeds 100
        planningEstimate: 5,
        estVariance: 0,
        created: '2025-08-03 06:13',
        lastUpdated: '2025-08-03 21:35',
      };

      const result = TaskStatusSchema.safeParse(invalidTaskStatus);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('progress');
      }
    });
  });

  describe('Plan Status Schema', () => {
    it('should validate a complete plan status', () => {
      const validPlanStatus = {
        created: '2025-07-24 16:20',
        lastUpdated: '2025-07-24 16:20',
      };

      const result = PlanStatusSchema.safeParse(validPlanStatus);
      expect(result.success).toBe(true);
    });

    it('should reject plan status with task-specific fields', () => {
      const invalidPlanStatus = {
        created: '2025-07-24 16:20',
        lastUpdated: '2025-07-24 16:20',
        currentState: 'Not Started',
      };

      const result = PlanStatusSchema.safeParse(invalidPlanStatus);
      expect(result.success).toBe(false);
    });
  });

  describe('Priority Drivers Schema', () => {
    it('should validate valid priority drivers', () => {
      const validPriorityDrivers = [
        'CBP-Break_Block_Revenue_Legal',
        'TEC-Prod_Stability_Blocker',
        'TEC-Dev_Productivity_Enhancement',
      ];

      const result = PriorityDriversSchema.safeParse(validPriorityDrivers);
      if (!result.success) {
        console.log('Priority drivers validation error:', JSON.stringify(result.error.issues, null, 2));
      }
      expect(result.success).toBe(true);
    });

    it('should reject invalid priority driver format', () => {
      const invalidPriorityDrivers = [
        'CBP-Break_Block_Revenue_Legal',
        'INVALID-FORMAT', // Invalid format
        'TEC-Prod_Stability_Blocker',
      ];

      const result = PriorityDriversSchema.safeParse(invalidPriorityDrivers);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain(1);
      }
    });

    it('should reject empty priority drivers array', () => {
      const result = PriorityDriversSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Meta Governance Schema (Complete Family)', () => {
    it('should validate a complete task meta governance', () => {
      const validTaskMetaGovernance = {
        status: {
          currentState: 'Not Started',
          priority: 'High',
          progress: 0,
          planningEstimate: 5,
          estVariance: 0,
          created: '2025-08-03 06:13',
          lastUpdated: '2025-08-03 21:35',
        },
        priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
      };

      const result = MetaGovernanceFamilySchema.safeParse(validTaskMetaGovernance);
      expect(result.success).toBe(true);
    });

    it('should validate a complete plan meta governance', () => {
      const validPlanMetaGovernance = {
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
        priorityDrivers: ['TEC-Dev_Productivity_Enhancement', 'TEC-Prod_Stability_Blocker'],
      };

      const result = MetaGovernanceFamilySchema.safeParse(validPlanMetaGovernance);
      expect(result.success).toBe(true);
    });

    it('should reject meta governance with missing status', () => {
      const invalidMetaGovernance = {
        priorityDrivers: ['TEC-Prod_Stability_Blocker'],
      };

      const result = MetaGovernanceFamilySchema.safeParse(invalidMetaGovernance);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('status');
      }
    });

    it('should reject meta governance with missing priority drivers', () => {
      const invalidMetaGovernance = {
        status: {
          created: '2025-07-24 16:20',
          lastUpdated: '2025-07-24 16:20',
        },
      };

      const result = MetaGovernanceFamilySchema.safeParse(invalidMetaGovernance);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('priorityDrivers');
      }
    });
  });
});
