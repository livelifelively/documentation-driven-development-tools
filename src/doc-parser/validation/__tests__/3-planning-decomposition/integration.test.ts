import { describe, it, expect } from 'vitest';
import { createPlanningDecompositionSchema } from '../../3-planning-decomposition.schema.js';
import { z } from 'zod';

describe('Planning & Decomposition Schema - Integration Tests', () => {
  describe('byId Index Completeness Verification', () => {
    it('should register all 4 sections in byId index for plan', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify all 4 sections are registered
      expect(byId['3.1']).toBeDefined(); // Roadmap
      expect(byId['3.2']).toBeDefined(); // Backlog
      expect(byId['3.3']).toBeDefined(); // Dependencies
      expect(byId['3.4']).toBeDefined(); // Decomposition Graph

      // Verify no extra sections
      expect(Object.keys(byId)).toHaveLength(4);
      expect(Object.keys(byId).sort()).toEqual(['3.1', '3.2', '3.3', '3.4']);
    });

    it('should register only task sections in byId index for task', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Verify only dependencies section is registered for task
      expect(byId['3.3']).toBeDefined(); // Dependencies

      // Verify plan-only sections are not present
      expect(byId['3.1']).toBeUndefined(); // Roadmap (plan only)
      expect(byId['3.2']).toBeUndefined(); // Backlog (plan only)
      expect(byId['3.4']).toBeUndefined(); // Decomposition Graph (plan only)

      // Verify only 1 section total
      expect(Object.keys(byId)).toHaveLength(1);
      expect(Object.keys(byId)).toEqual(['3.3']);
    });

    it('should verify byId schemas are actual Zod schemas', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All byId schemas should have safeParse method
      expect(typeof byId['3.1'].safeParse).toBe('function');
      expect(typeof byId['3.2'].safeParse).toBe('function');
      expect(typeof byId['3.3'].safeParse).toBe('function');
      expect(typeof byId['3.4'].safeParse).toBe('function');
    });
  });

  describe('Schema Registration Verification', () => {
    it('should verify all sections are properly accessible via byId', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test that each section can validate appropriate data
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

      const backlogData = [
        {
          name: 'Reporting Plan',
          reason: 'Deferred to Q4 due to dependency on new analytics service.',
        },
      ];

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

      const graphData = {
        diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };

      // Verify each section validates correctly
      expect(byId['3.1'].safeParse(roadmapData).success).toBe(true);
      expect(byId['3.2'].safeParse(backlogData).success).toBe(true);
      expect(byId['3.3'].safeParse(dependenciesData).success).toBe(true);
      expect(byId['3.4'].safeParse(graphData).success).toBe(true);
    });

    it('should verify task schema only has dependencies section accessible', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

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

      // Verify dependencies section validates correctly
      expect(byId['3.3'].safeParse(dependenciesData).success).toBe(true);

      // Verify other sections are not accessible
      expect(byId['3.1']).toBeUndefined();
      expect(byId['3.2']).toBeUndefined();
      expect(byId['3.4']).toBeUndefined();
    });
  });

  describe('Cross-Family Consistency Verification', () => {
    it('should follow same byId pattern as Family 1 (Meta Governance)', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Family 1 has sections 1.2 and 1.3
      // Family 3 should have sections 3.1, 3.2, 3.3, 3.4
      // Both should use the same byId pattern
      expect(typeof byId).toBe('object');
      expect(byId).not.toBeNull();
      expect(Object.keys(byId).length).toBeGreaterThan(0);

      // Verify all keys are strings (section IDs)
      Object.keys(byId).forEach((key) => {
        expect(typeof key).toBe('string');
        expect(key).toMatch(/^\d+\.\d+$/); // Format: X.Y
      });
    });

    it('should follow same byId pattern as Family 2 (Business Scope)', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Family 2 has sections 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
      // Family 3 should have sections 3.1, 3.2, 3.3, 3.4
      // Both should use the same byId pattern
      expect(typeof byId).toBe('object');
      expect(byId).not.toBeNull();
      expect(Object.keys(byId).length).toBeGreaterThan(0);

      // Verify all values are Zod schemas
      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
      });
    });

    it('should maintain consistent schema structure across document types', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const taskSchema = createPlanningDecompositionSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Both should have byId property
      expect(planById).toBeDefined();
      expect(taskById).toBeDefined();

      // Both should be objects
      expect(typeof planById).toBe('object');
      expect(typeof taskById).toBe('object');

      // Plan should have more sections than task
      expect(Object.keys(planById).length).toBeGreaterThan(Object.keys(taskById).length);

      // Shared sections should have same schema type
      expect(typeof planById['3.3'].safeParse).toBe('function');
      expect(typeof taskById['3.3'].safeParse).toBe('function');
    });
  });

  describe('Complete Document Validation', () => {
    it('should validate complete plan document with all sections', () => {
      const planSchema = createPlanningDecompositionSchema('plan');

      const completePlanData = {
        roadmapInFocusItems: [
          {
            id: 'P1',
            childPlanTask: '[Backend Plan](p1-backend.plan.md)',
            priority: 'High',
            priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
            status: 'Not Started',
            dependsOn: '—',
            summary: 'Core backend services and APIs.',
          },
        ],
        backlogIcebox: [
          {
            name: 'Reporting Plan',
            reason: 'Deferred to Q4 due to dependency on new analytics service.',
          },
        ],
        dependencies: [
          {
            id: 'D-1',
            dependencyOn: 'shared-ui-library v2.1+',
            type: 'External',
            status: 'Blocked',
            affectedPlansTasks: ['p1-frontend'],
            notes: 'Awaiting release from Platform team.',
          },
        ],
        decompositionGraph: {
          diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
        T2["Task: Implement validation"]
        T3["Task: Add API endpoint"]
        T4["Task: Write integration tests"]
    end
    P1 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> T4`,
        },
      };

      const result = planSchema.safeParse(completePlanData);
      expect(result.success).toBe(true);
    });

    it('should validate complete task document with dependencies only', () => {
      const taskSchema = createPlanningDecompositionSchema('task');

      const completeTaskData = {
        dependencies: [
          {
            id: 'D-1',
            dependencyOn: 'p1.t28-define-schema-types.task.md',
            type: 'Internal',
            status: 'Complete',
            affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
            notes: 'Schema types must be defined before content validation schemas.',
          },
        ],
      };

      const result = taskSchema.safeParse(completeTaskData);
      expect(result.success).toBe(true);
    });

    it('should reject plan document with missing required sections', () => {
      const planSchema = createPlanningDecompositionSchema('plan');

      const incompletePlanData = {
        // Missing roadmapInFocusItems, backlogIcebox, dependencies, decompositionGraph
      };

      const result = planSchema.safeParse(incompletePlanData);
      expect(result.success).toBe(false);
    });

    it('should reject task document with plan-only sections', () => {
      const taskSchema = createPlanningDecompositionSchema('task');

      const invalidTaskData = {
        roadmapInFocusItems: [
          {
            id: 'P1',
            childPlanTask: '[Backend Plan](p1-backend.plan.md)',
            priority: 'High',
            priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
            status: 'Not Started',
            dependsOn: '—',
            summary: 'Core backend services and APIs.',
          },
        ],
        dependencies: [
          {
            id: 'D-1',
            dependencyOn: 'p1.t28-define-schema-types.task.md',
            type: 'Internal',
            status: 'Complete',
            affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
            notes: 'Schema types must be defined before content validation schemas.',
          },
        ],
      };

      const result = taskSchema.safeParse(invalidTaskData);
      expect(result.success).toBe(false);
    });
  });

  describe('Schema Factory Pattern Consistency', () => {
    it('should use consistent factory pattern across all sections', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // All sections should be created using the same factory pattern
      // Each section should be a Zod schema with safeParse method
      Object.values(byId).forEach((schema) => {
        expect(typeof schema.safeParse).toBe('function');
        expect(typeof schema.parse).toBe('function');
        expect(typeof schema.refine).toBe('function');
      });
    });

    it('should maintain consistent error handling across sections', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test error handling consistency
      const invalidData = {};

      Object.entries(byId).forEach(([sectionId, schema]) => {
        const result = schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeDefined();
          expect(Array.isArray(result.error.issues)).toBe(true);
        }
      });
    });
  });
});
