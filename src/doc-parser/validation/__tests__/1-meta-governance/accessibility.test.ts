import { describe, it, expect } from 'vitest';
import { createMetaGovernanceSchema } from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all required sections in byId index for plan', () => {
      const schema = createMetaGovernanceSchema('plan');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all expected sections are registered
      expect(byId['1.2']).toBeDefined(); // Status
      expect(byId['1.3']).toBeDefined(); // Priority Drivers

      // Verify no unexpected sections
      const registeredIds = Object.keys(byId);
      expect(registeredIds).toHaveLength(2);
      expect(registeredIds).toContain('1.2');
      expect(registeredIds).toContain('1.3');
    });

    it('should register all required sections in byId index for task', () => {
      const schema = createMetaGovernanceSchema('task');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all expected sections are registered
      expect(byId['1.2']).toBeDefined(); // Status
      expect(byId['1.3']).toBeDefined(); // Priority Drivers

      // Verify no unexpected sections
      const registeredIds = Object.keys(byId);
      expect(registeredIds).toHaveLength(2);
      expect(registeredIds).toContain('1.2');
      expect(registeredIds).toContain('1.3');
    });

    it('should have consistent byId registration between plan and task', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const taskSchema = createMetaGovernanceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const planIds = Object.keys(planById);
      const taskIds = Object.keys(taskById);

      expect(planIds).toEqual(taskIds);
      expect(planIds).toHaveLength(2);
    });
  });

  describe('Schema Registration Verification', () => {
    it('should make Status section (1.2) accessible via byId for plan', () => {
      const schema = createMetaGovernanceSchema('plan');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      const statusSchema = byId['1.2'];
      expect(statusSchema).toBeDefined();
      expect(typeof statusSchema.safeParse).toBe('function');

      // Test that it can validate plan status data
      const validPlanStatus = {
        created: '2025-07-24 16:20',
        lastUpdated: '2025-07-24 16:20',
      };
      expect(statusSchema.safeParse(validPlanStatus).success).toBe(true);
    });

    it('should make Status section (1.2) accessible via byId for task', () => {
      const schema = createMetaGovernanceSchema('task');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      const statusSchema = byId['1.2'];
      expect(statusSchema).toBeDefined();
      expect(typeof statusSchema.safeParse).toBe('function');

      // Test that it can validate task status data
      const validTaskStatus = {
        currentState: 'Not Started',
        priority: 'High',
        progress: 0,
        planningEstimate: 5,
        estVariancePts: 0,
        created: '2025-08-03 06:13',
        lastUpdated: '2025-08-03 21:35',
      };
      expect(statusSchema.safeParse(validTaskStatus).success).toBe(true);
    });

    it('should make Priority Drivers section (1.3) accessible via byId for plan', () => {
      const schema = createMetaGovernanceSchema('plan');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      const priorityDriversSchema = byId['1.3'];
      expect(priorityDriversSchema).toBeDefined();
      expect(typeof priorityDriversSchema.safeParse).toBe('function');

      // Test that it can validate priority drivers data
      const validPriorityDrivers = ['TEC-Dev_Productivity_Enhancement', 'CBP-Break_Block_Revenue_Legal'];
      expect(priorityDriversSchema.safeParse(validPriorityDrivers).success).toBe(true);
    });

    it('should make Priority Drivers section (1.3) accessible via byId for task', () => {
      const schema = createMetaGovernanceSchema('task');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      const priorityDriversSchema = byId['1.3'];
      expect(priorityDriversSchema).toBeDefined();
      expect(typeof priorityDriversSchema.safeParse).toBe('function');

      // Test that it can validate priority drivers data
      const validPriorityDrivers = ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'];
      expect(priorityDriversSchema.safeParse(validPriorityDrivers).success).toBe(true);
    });
  });

  describe('Independent Section Validation', () => {
    it('should validate Status section independently via byId', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const statusSchema = byId['1.2'];

      // Valid plan status
      const validData = {
        created: '2025-07-24 16:20',
        lastUpdated: '2025-07-24 16:20',
      };
      expect(statusSchema.safeParse(validData).success).toBe(true);

      // Invalid plan status (missing required fields)
      const invalidData = {
        created: '2025-07-24 16:20',
        // Missing lastUpdated
      };
      expect(statusSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should validate Priority Drivers section independently via byId', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const priorityDriversSchema = byId['1.3'];

      // Valid priority drivers
      const validData = ['TEC-Dev_Productivity_Enhancement', 'CBP-Break_Block_Revenue_Legal'];
      expect(priorityDriversSchema.safeParse(validData).success).toBe(true);

      // Invalid priority drivers (empty array)
      const invalidData: string[] = [];
      expect(priorityDriversSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain schema consistency between byId and composed access', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const composedShape = planSchema.shape as any;

      // Status section consistency
      const statusById = byId['1.2'];
      const statusComposed = composedShape.status;

      const validStatusData = {
        created: '2025-07-24 16:20',
        lastUpdated: '2025-07-24 16:20',
      };

      const byIdResult = statusById.safeParse(validStatusData);
      const composedResult = statusComposed.safeParse(validStatusData);

      expect(byIdResult.success).toBe(composedResult.success);

      // Priority Drivers section consistency
      const priorityDriversById = byId['1.3'];
      const priorityDriversComposed = composedShape.priorityDrivers;

      const validPriorityDriversData = ['TEC-Dev_Productivity_Enhancement'];

      const byIdResult2 = priorityDriversById.safeParse(validPriorityDriversData);
      const composedResult2 = priorityDriversComposed.safeParse(validPriorityDriversData);

      expect(byIdResult2.success).toBe(composedResult2.success);
    });

    it('should maintain document type consistency in byId access', () => {
      const planSchema = createMetaGovernanceSchema('plan');
      const taskSchema = createMetaGovernanceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Status section should have different validation rules for plan vs task
      const planStatusSchema = planById['1.2'];
      const taskStatusSchema = taskById['1.2'];

      const planStatusData = {
        created: '2025-07-24 16:20',
        lastUpdated: '2025-07-24 16:20',
      };

      const taskStatusData = {
        currentState: 'Not Started',
        priority: 'High',
        progress: 0,
        planningEstimate: 5,
        estVariancePts: 0,
        created: '2025-08-03 06:13',
        lastUpdated: '2025-08-03 21:35',
      };

      // Plan status should accept plan data
      expect(planStatusSchema.safeParse(planStatusData).success).toBe(true);
      // Plan status should reject task data
      expect(planStatusSchema.safeParse(taskStatusData).success).toBe(false);

      // Task status should accept task data
      expect(taskStatusSchema.safeParse(taskStatusData).success).toBe(true);
      // Task status should reject plan data (missing required fields)
      expect(taskStatusSchema.safeParse(planStatusData).success).toBe(false);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const schema = createMetaGovernanceSchema('plan');
      const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

      // Non-existent section should be undefined
      expect(byId['1.1']).toBeUndefined();
      expect(byId['1.4']).toBeUndefined();
      expect(byId['2.1']).toBeUndefined();
    });

    it('should maintain byId index integrity across multiple schema creations', () => {
      // Create multiple schemas to ensure byId index is properly maintained
      const schema1 = createMetaGovernanceSchema('plan');
      const schema2 = createMetaGovernanceSchema('task');
      const schema3 = createMetaGovernanceSchema('plan');

      const byId1 = (schema1 as any).__byId as Record<string, z.ZodTypeAny>;
      const byId2 = (schema2 as any).__byId as Record<string, z.ZodTypeAny>;
      const byId3 = (schema3 as any).__byId as Record<string, z.ZodTypeAny>;

      // All should have the same section IDs
      expect(Object.keys(byId1)).toEqual(['1.2', '1.3']);
      expect(Object.keys(byId2)).toEqual(['1.2', '1.3']);
      expect(Object.keys(byId3)).toEqual(['1.2', '1.3']);

      // All should have valid schemas
      expect(byId1['1.2']).toBeDefined();
      expect(byId1['1.3']).toBeDefined();
      expect(byId2['1.2']).toBeDefined();
      expect(byId2['1.3']).toBeDefined();
      expect(byId3['1.2']).toBeDefined();
      expect(byId3['1.3']).toBeDefined();
    });
  });
});
