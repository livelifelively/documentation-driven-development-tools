import { describe, it, expect } from 'vitest';
import { createPlanningDecompositionSchema } from '../../3-planning-decomposition.schema.js';
import { z } from 'zod';

describe('Planning & Decomposition Schema - Complex Object Validation Tests', () => {
  describe('Roadmap Item Validation', () => {
    it('should validate complete roadmap item via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'High',
        priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
        status: 'Not Started',
        dependsOn: '—',
        summary: 'Core backend services and APIs.',
      };

      const roadmapArray = [validRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(true);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(true);
    });

    it('should validate roadmap item without optional dependsOn via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validRoadmapItem = {
        id: 'T1',
        childPlanTask: '[Database Setup](p1.t1-database-setup.task.md)',
        priority: 'Medium',
        priorityDrivers: ['TEC-Prod_Stability_Blocker'],
        status: 'Not Started',
        // dependsOn is optional, so omitting it should be valid
        summary: 'Configure production database.',
      };

      const roadmapArray = [validRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(true);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(true);
    });

    it('should reject roadmap item with missing required fields via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidRoadmapItem = {
        id: 'P1',
        // Missing childPlanTask, priority, priorityDrivers, status, summary
        dependsOn: '—',
      };

      const roadmapArray = [invalidRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(false);
    });

    it('should reject roadmap item with invalid priority level via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'InvalidPriority', // Invalid priority level
        priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
        status: 'Not Started',
        dependsOn: '—',
        summary: 'Core backend services and APIs.',
      };

      const roadmapArray = [invalidRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(false);
    });

    it('should reject roadmap item with invalid status via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'High',
        priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
        status: 'InvalidStatus', // Invalid status
        dependsOn: '—',
        summary: 'Core backend services and APIs.',
      };

      const roadmapArray = [invalidRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(false);
    });

    it('should reject roadmap item with invalid priority driver via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'High',
        priorityDrivers: ['Invalid-Priority-Driver'], // Invalid priority driver
        status: 'Not Started',
        dependsOn: '—',
        summary: 'Core backend services and APIs.',
      };

      const roadmapArray = [invalidRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(false);
    });

    it('should reject roadmap item with empty priority drivers array via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'High',
        priorityDrivers: [], // Empty array
        status: 'Not Started',
        dependsOn: '—',
        summary: 'Core backend services and APIs.',
      };

      const roadmapArray = [invalidRoadmapItem];

      expect(byId['3.1'].safeParse(roadmapArray).success).toBe(false);
      expect(shape.roadmapInFocusItems.safeParse(roadmapArray).success).toBe(false);
    });
  });

  describe('Dependency Item Validation', () => {
    it('should validate complete dependency item via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validDependencyItem = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External',
        status: 'Blocked',
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const dependencyArray = [validDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(true);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(true);
    });

    it('should validate internal dependency item via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validDependencyItem = {
        id: 'D-2',
        dependencyOn: 'Plan p2-user-profiles',
        type: 'Internal',
        status: 'Complete',
        affectedPlansTasks: ['p3-reporting'],
        notes: 'User schema is now finalized.',
      };

      const dependencyArray = [validDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(true);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(true);
    });

    it('should reject dependency item with missing required fields via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidDependencyItem = {
        id: 'D-1',
        // Missing dependencyOn, type, status, affectedPlansTasks, notes
      };

      const dependencyArray = [invalidDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(false);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(false);
    });

    it('should reject dependency item with invalid type via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidDependencyItem = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'InvalidType', // Invalid type
        status: 'Blocked',
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const dependencyArray = [invalidDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(false);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(false);
    });

    it('should reject dependency item with invalid status via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidDependencyItem = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External',
        status: 'InvalidStatus', // Invalid status
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const dependencyArray = [invalidDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(false);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(false);
    });

    it('should reject dependency item with empty affected plans/tasks array via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidDependencyItem = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External',
        status: 'Blocked',
        affectedPlansTasks: [], // Empty array
        notes: 'Awaiting release from Platform team.',
      };

      const dependencyArray = [invalidDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(false);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(false);
    });

    it('should validate dependency item for task document type via byId and composed schema', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validDependencyItem = {
        id: 'D-1',
        dependencyOn: 'p1.t28-define-schema-types.task.md',
        type: 'Internal',
        status: 'Complete',
        affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
        notes: 'Schema types must be defined before content validation schemas.',
      };

      const dependencyArray = [validDependencyItem];

      expect(byId['3.3'].safeParse(dependencyArray).success).toBe(true);
      expect(shape.dependencies.safeParse(dependencyArray).success).toBe(true);
    });
  });

  describe('Backlog Item Validation', () => {
    it('should validate complete backlog item via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validBacklogItem = {
        name: 'Reporting Plan',
        reason: 'Deferred to Q4 due to dependency on new analytics service.',
      };

      const backlogArray = [validBacklogItem];

      expect(byId['3.2'].safeParse(backlogArray).success).toBe(true);
      expect(shape.backlogIcebox.safeParse(backlogArray).success).toBe(true);
    });

    it('should reject backlog item with missing name via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidBacklogItem = {
        // Missing name
        reason: 'Deferred to Q4 due to dependency on new analytics service.',
      };

      const backlogArray = [invalidBacklogItem];

      expect(byId['3.2'].safeParse(backlogArray).success).toBe(false);
      expect(shape.backlogIcebox.safeParse(backlogArray).success).toBe(false);
    });

    it('should reject backlog item with missing reason via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidBacklogItem = {
        name: 'Reporting Plan',
        // Missing reason
      };

      const backlogArray = [invalidBacklogItem];

      expect(byId['3.2'].safeParse(backlogArray).success).toBe(false);
      expect(shape.backlogIcebox.safeParse(backlogArray).success).toBe(false);
    });

    it('should reject backlog item with empty name via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidBacklogItem = {
        name: '', // Empty name
        reason: 'Deferred to Q4 due to dependency on new analytics service.',
      };

      const backlogArray = [invalidBacklogItem];

      expect(byId['3.2'].safeParse(backlogArray).success).toBe(false);
      expect(shape.backlogIcebox.safeParse(backlogArray).success).toBe(false);
    });

    it('should reject backlog item with empty reason via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidBacklogItem = {
        name: 'Reporting Plan',
        reason: '', // Empty reason
      };

      const backlogArray = [invalidBacklogItem];

      expect(byId['3.2'].safeParse(backlogArray).success).toBe(false);
      expect(shape.backlogIcebox.safeParse(backlogArray).success).toBe(false);
    });
  });

  describe('Mermaid Diagram Validation', () => {
    it('should validate decomposition graph with diagram only via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validGraphData = {
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

      expect(byId['3.4'].safeParse(validGraphData).success).toBe(true);
      expect(shape.decompositionGraph.safeParse(validGraphData).success).toBe(true);
    });

    it('should validate decomposition graph with text and diagram via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validGraphData = {
        text: ['This diagram shows the decomposition of our authentication system.'],
        diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };

      expect(byId['3.4'].safeParse(validGraphData).success).toBe(true);
      expect(shape.decompositionGraph.safeParse(validGraphData).success).toBe(true);
    });

    it('should validate decomposition graph with multiple text lines via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validGraphData = {
        text: [
          'This diagram shows the decomposition of our authentication system.',
          'The backend plan serves as the foundation for all UI tasks.',
          'Each task builds upon the previous one in a logical sequence.',
        ],
        diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };

      expect(byId['3.4'].safeParse(validGraphData).success).toBe(true);
      expect(shape.decompositionGraph.safeParse(validGraphData).success).toBe(true);
    });

    it('should reject decomposition graph with only text via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidGraphData = {
        text: ['This diagram shows the decomposition of our authentication system.'],
        // Missing diagram
      };

      expect(byId['3.4'].safeParse(invalidGraphData).success).toBe(false);
      expect(shape.decompositionGraph.safeParse(invalidGraphData).success).toBe(false);
    });

    it('should reject decomposition graph with wrong diagram type via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidGraphData = {
        diagram: `erDiagram
    USER ||--o{ AUTH : has
    AUTH ||--o{ SESSION : creates`,
      };

      expect(byId['3.4'].safeParse(invalidGraphData).success).toBe(false);
      expect(shape.decompositionGraph.safeParse(invalidGraphData).success).toBe(false);
    });

    it('should reject decomposition graph with wrong diagram type via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidGraphData = {
        diagram: `flowchart
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };

      expect(byId['3.4'].safeParse(invalidGraphData).success).toBe(false);
      expect(shape.decompositionGraph.safeParse(invalidGraphData).success).toBe(false);
    });

    it('should reject empty decomposition graph via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyGraphData = {};

      expect(byId['3.4'].safeParse(emptyGraphData).success).toBe(false);
      expect(shape.decompositionGraph.safeParse(emptyGraphData).success).toBe(false);
    });

    it('should validate decomposition graph with empty text array via byId and composed schema', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validGraphData = {
        text: [], // Empty text array is allowed since text is optional
        diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
      };

      expect(byId['3.4'].safeParse(validGraphData).success).toBe(true);
      expect(shape.decompositionGraph.safeParse(validGraphData).success).toBe(true);
    });
  });
});
