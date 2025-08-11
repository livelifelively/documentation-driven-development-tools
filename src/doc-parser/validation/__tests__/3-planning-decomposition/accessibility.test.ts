import { describe, it, expect } from 'vitest';
import { createPlanningDecompositionSchema } from '../../3-planning-decomposition.schema.js';
import { z } from 'zod';

describe('Planning & Decomposition Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan should have all 4 sections
      expect(byId['3.1']).toBeDefined(); // Roadmap
      expect(byId['3.2']).toBeDefined(); // Backlog
      expect(byId['3.3']).toBeDefined(); // Dependencies
      expect(byId['3.4']).toBeDefined(); // Decomposition Graph

      expect(Object.keys(byId)).toHaveLength(4);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Task should have only 1 section
      expect(byId['3.3']).toBeDefined(); // Dependencies

      expect(Object.keys(byId)).toHaveLength(1);
    });

    it('should not register plan-only sections in task byId index', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan-only sections should not be present in task
      expect(byId['3.1']).toBeUndefined(); // Roadmap
      expect(byId['3.2']).toBeUndefined(); // Backlog
      expect(byId['3.4']).toBeUndefined(); // Decomposition Graph
    });

    it('should not register task-only sections in plan byId index', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All sections should be present in plan (no task-only sections)
      expect(byId['3.1']).toBeDefined(); // Roadmap
      expect(byId['3.2']).toBeDefined(); // Backlog
      expect(byId['3.3']).toBeDefined(); // Dependencies
      expect(byId['3.4']).toBeDefined(); // Decomposition Graph
    });
  });

  describe('Schema Registration Verification', () => {
    it('should register schemas with correct types for plan', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all schemas are Zod types
      expect(typeof byId['3.1'].safeParse).toBe('function');
      expect(typeof byId['3.2'].safeParse).toBe('function');
      expect(typeof byId['3.3'].safeParse).toBe('function');
      expect(typeof byId['3.4'].safeParse).toBe('function');
    });

    it('should register schemas with correct types for task', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify schema is Zod type
      expect(typeof byId['3.3'].safeParse).toBe('function');
    });
  });

  describe('Independent Section Validation', () => {
    it('should validate plan sections independently via byId', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test roadmap validation
      const roadmapData = [
        {
          id: 'P1',
          childPlanTask: '[Backend Plan](p1-backend.plan.md)',
          priority: 'High',
          priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
          status: 'Not Started',
          dependsOn: '—',
          summary: 'Core backend services and APIs.',
        },
      ];
      expect(byId['3.1'].safeParse(roadmapData).success).toBe(true);

      // Test backlog validation
      const backlogData = [
        {
          name: 'Reporting Plan',
          reason: 'Deferred to Q4 due to dependency on new analytics service.',
        },
      ];
      expect(byId['3.2'].safeParse(backlogData).success).toBe(true);

      // Test dependencies validation
      const dependenciesData = [
        {
          id: 'D-1',
          dependencyOn: 'shared-ui-library v2.1+',
          type: 'External',
          status: 'Blocked',
          affectedPlansTasks: ['p1-frontend'],
          notes: 'Awaiting release from Platform team.',
        },
      ];
      expect(byId['3.3'].safeParse(dependenciesData).success).toBe(true);

      // Test decomposition graph validation
      const graphData = {
        diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };
      expect(byId['3.4'].safeParse(graphData).success).toBe(true);
    });

    it('should validate task sections independently via byId', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test dependencies validation for task
      const dependenciesData = [
        {
          id: 'D-1',
          dependencyOn: 'p1.t28-define-schema-types.task.md',
          type: 'Internal',
          status: 'Complete',
          affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
          notes: 'Schema types must be defined before content validation schemas.',
        },
      ];
      expect(byId['3.3'].safeParse(dependenciesData).success).toBe(true);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain consistent validation between byId and composed schema for plan', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const roadmapData = [
        {
          id: 'P1',
          childPlanTask: '[Backend Plan](p1-backend.plan.md)',
          priority: 'High',
          priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
          status: 'Not Started',
          dependsOn: '—',
          summary: 'Core backend services and APIs.',
        },
      ];

      const byIdResult = byId['3.1'].safeParse(roadmapData);
      const composedResult = shape.roadmapInFocusItems.safeParse(roadmapData);

      expect(byIdResult.success).toBe(composedResult.success);
    });

    it('should maintain consistent validation between byId and composed schema for task', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const dependenciesData = [
        {
          id: 'D-1',
          dependencyOn: 'p1.t28-define-schema-types.task.md',
          type: 'Internal',
          status: 'Complete',
          affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
          notes: 'Schema types must be defined before content validation schemas.',
        },
      ];

      const byIdResult = byId['3.3'].safeParse(dependenciesData);
      const composedResult = shape.dependencies.safeParse(dependenciesData);

      expect(byIdResult.success).toBe(composedResult.success);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Non-existent section should be undefined
      expect(byId['3.5']).toBeUndefined();
      expect(byId['invalid']).toBeUndefined();
    });

    it('should handle byId access on invalid schema gracefully', () => {
      // Test with invalid schema
      const invalidSchema = {} as any;
      expect(invalidSchema.__byId).toBeUndefined();
    });

    it('should validate that byId schemas are actual Zod schemas', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All byId schemas should have safeParse method
      expect(typeof byId['3.1'].safeParse).toBe('function');
      expect(typeof byId['3.2'].safeParse).toBe('function');
      expect(typeof byId['3.3'].safeParse).toBe('function');
      expect(typeof byId['3.4'].safeParse).toBe('function');
    });
  });
});
