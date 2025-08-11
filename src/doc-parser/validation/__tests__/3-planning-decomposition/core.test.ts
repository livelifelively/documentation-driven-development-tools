import { describe, it, expect } from 'vitest';
import { createPlanningDecompositionSchema } from '../../3-planning-decomposition.schema.js';
import { z } from 'zod';

describe('Planning & Decomposition Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createPlanningDecompositionSchema', () => {
      it('should create plan schema with byId registration', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Verify byId registration
        expect(byId['3.1']).toBeDefined(); // Roadmap
        expect(byId['3.2']).toBeDefined(); // Backlog
        expect(byId['3.3']).toBeDefined(); // Dependencies
        expect(byId['3.4']).toBeDefined(); // Decomposition Graph

        // Verify schema structure
        const shape = planSchema.shape as any;
        expect(shape.roadmapInFocusItems).toBeDefined();
        expect(shape.backlogIcebox).toBeDefined();
        expect(shape.dependencies).toBeDefined();
        expect(shape.decompositionGraph).toBeDefined();
      });

      it('should create task schema with byId registration', () => {
        const taskSchema = createPlanningDecompositionSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Verify byId registration (only dependencies for task)
        expect(byId['3.3']).toBeDefined(); // Dependencies
        expect(byId['3.1']).toBeUndefined(); // Roadmap (plan only)
        expect(byId['3.2']).toBeUndefined(); // Backlog (plan only)
        expect(byId['3.4']).toBeUndefined(); // Decomposition Graph (plan only)

        // Verify schema structure
        const shape = taskSchema.shape as any;
        expect(shape.dependencies).toBeDefined();
        expect(shape.roadmapInFocusItems).toBeUndefined();
        expect(shape.backlogIcebox).toBeUndefined();
        expect(shape.decompositionGraph).toBeUndefined();
      });

      it('should validate complete plan document', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const validPlanData = {
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

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const taskSchema = createPlanningDecompositionSchema('task');
        const validTaskData = {
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

        const result = taskSchema.safeParse(validTaskData);
        expect(result.success).toBe(true);
      });

      describe('Convenience Functions', () => {
        it('should create plan schema via convenience function', () => {
          const planSchema = createPlanningDecompositionSchema('plan');
          const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
          expect(byId['3.1']).toBeDefined();
          expect(byId['3.2']).toBeDefined();
          expect(byId['3.3']).toBeDefined();
          expect(byId['3.4']).toBeDefined();
        });

        it('should create task schema via convenience function', () => {
          const taskSchema = createPlanningDecompositionSchema('task');
          const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
          expect(byId['3.3']).toBeDefined();
          expect(byId['3.1']).toBeUndefined();
          expect(byId['3.2']).toBeUndefined();
          expect(byId['3.4']).toBeUndefined();
        });
      });
    });

    describe('byId Index Verification', () => {
      it('should allow independent section validation via byId', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Test roadmap validation via byId
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

        const result = byId['3.1'].safeParse(roadmapData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid data via byId', () => {
        const planSchema = createPlanningDecompositionSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Test roadmap validation with invalid data
        const invalidRoadmapData = [
          {
            id: 'P1',
            // Missing required fields
            priority: 'High',
            status: 'Not Started',
          },
        ];

        const result = byId['3.1'].safeParse(invalidRoadmapData);
        expect(result.success).toBe(false);
      });
    });
  });
});
