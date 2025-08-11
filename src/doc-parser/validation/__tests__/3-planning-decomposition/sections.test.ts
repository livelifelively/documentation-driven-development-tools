import { describe, it, expect } from 'vitest';
import { createPlanningDecompositionSchema } from '../../3-planning-decomposition.schema.js';
import { z } from 'zod';

describe('Planning & Decomposition Schema - Section Tests', () => {
  describe('Roadmap Section (3.1) - Plan Only', () => {
    it('should validate roadmap via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = [
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

      expect(byId['3.1'].safeParse(validData).success).toBe(true);
      expect(shape.roadmapInFocusItems.safeParse(validData).success).toBe(true);
    });

    it('should reject roadmap with missing required fields via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = [
        {
          id: 'P1',
          // Missing childPlanTask, priority, priorityDrivers, status, summary
          dependsOn: '—',
        },
      ];

      expect(byId['3.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty roadmap array via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyData: any[] = [];

      expect(byId['3.1'].safeParse(emptyData).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(emptyData).success).toBe(false);
    });
  });

  describe('Backlog Section (3.2) - Plan Only', () => {
    it('should validate backlog via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = [
        {
          name: 'Reporting Plan',
          reason: 'Deferred to Q4 due to dependency on new analytics service.',
        },
      ];

      expect(byId['3.2'].safeParse(validData).success).toBe(true);
      expect(shape.backlogIcebox.safeParse(validData).success).toBe(true);
    });

    it('should reject backlog with missing name via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = [
        {
          // Missing name
          reason: 'Deferred to Q4 due to dependency on new analytics service.',
        },
      ];

      expect(byId['3.2'].safeParse(invalidData).success).toBe(false);
      expect(shape.backlogIcebox.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty backlog array via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyData: any[] = [];

      expect(byId['3.2'].safeParse(emptyData).success).toBe(false);
      expect(shape.backlogIcebox.safeParse(emptyData).success).toBe(false);
    });
  });

  describe('Dependencies Section (3.3) - Plan and Task', () => {
    describe('Plan Dependencies', () => {
      it('should validate dependencies via byId and composed schema', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = [
          {
            id: 'D-1',
            dependencyOn: 'shared-ui-library v2.1+',
            type: 'External',
            status: 'Blocked',
            affectedPlansTasks: ['p1-frontend'],
            notes: 'Awaiting release from Platform team.',
          },
        ];

        expect(byId['3.3'].safeParse(validData).success).toBe(true);
        expect(shape.dependencies.safeParse(validData).success).toBe(true);
      });

      it('should reject dependencies with missing ID via byId and composed schema', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            // Missing id
            dependencyOn: 'shared-ui-library v2.1+',
            type: 'External',
            status: 'Blocked',
            affectedPlansTasks: ['p1-frontend'],
            notes: 'Awaiting release from Platform team.',
          },
        ];

        expect(byId['3.3'].safeParse(invalidData).success).toBe(false);
        expect(shape.dependencies.safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty dependencies array via byId and composed schema', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const emptyData: any[] = [];

        expect(byId['3.3'].safeParse(emptyData).success).toBe(false);
        expect(shape.dependencies.safeParse(emptyData).success).toBe(false);
      });
    });

    describe('Task Dependencies', () => {
      it('should validate dependencies via byId and composed schema', () => {
        const taskSchema = createPlanningDecompositionSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const validData = [
          {
            id: 'D-1',
            dependencyOn: 'p1.t28-define-schema-types.task.md',
            type: 'Internal',
            status: 'Complete',
            affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
            notes: 'Schema types must be defined before content validation schemas.',
          },
        ];

        expect(byId['3.3'].safeParse(validData).success).toBe(true);
        expect(shape.dependencies.safeParse(validData).success).toBe(true);
      });

      it('should reject dependencies with missing required fields via byId and composed schema', () => {
        const taskSchema = createPlanningDecompositionSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const invalidData = [
          {
            id: 'D-1',
            // Missing dependencyOn, type, status, affectedPlansTasks, notes
          },
        ];

        expect(byId['3.3'].safeParse(invalidData).success).toBe(false);
        expect(shape.dependencies.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Decomposition Graph Section (3.4) - Plan Only', () => {
    it('should validate decomposition graph via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = {
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
      };

      expect(byId['3.4'].safeParse(validData).success).toBe(true);
      expect(shape.decompositionGraph.safeParse(validData).success).toBe(true);
    });

    it('should validate decomposition graph with text via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = {
        text: ['This diagram shows the decomposition of our authentication system.'],
        diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };

      expect(byId['3.4'].safeParse(validData).success).toBe(true);
      expect(shape.decompositionGraph.safeParse(validData).success).toBe(true);
    });

    it('should reject decomposition graph with only text via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = {
        text: ['This diagram shows the decomposition of our authentication system.'],
        // Missing diagram
      };

      expect(byId['3.4'].safeParse(invalidData).success).toBe(false);
      expect(shape.decompositionGraph.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty decomposition graph via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyData = {};

      expect(byId['3.4'].safeParse(emptyData).success).toBe(false);
      expect(shape.decompositionGraph.safeParse(emptyData).success).toBe(false);
    });
  });
});
