import { describe, it, expect } from 'vitest';
import {
  PlanningDecompositionFamilySchema,
  RoadmapItemSchema,
  BacklogItemSchema,
  DependencySchema,
  DecompositionGraphSchema,
} from '../3-planning-decomposition.schema';

describe('Planning & Decomposition Schema Validation', () => {
  describe('Roadmap Item Schema', () => {
    it('should validate a complete roadmap item', () => {
      const validRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'High',
        priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
        status: 'Not Started',
        dependsOn: '—',
        summary: 'Core backend services and APIs.',
      };

      const result = RoadmapItemSchema.safeParse(validRoadmapItem);
      expect(result.success).toBe(true);
    });

    it('should validate roadmap item without dependsOn', () => {
      const validRoadmapItem = {
        id: 'T1',
        childPlanTask: '[Database Setup](p1.t1-database-setup.task.md)',
        priority: 'Medium',
        priorityDrivers: ['TEC-Prod_Stability_Blocker'],
        status: 'Not Started',
        summary: 'Configure production database.',
      };

      const result = RoadmapItemSchema.safeParse(validRoadmapItem);
      expect(result.success).toBe(true);
    });

    it('should reject roadmap item with missing ID', () => {
      const invalidRoadmapItem = {
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: {
          level: '🟥' as const,
          description: 'High',
        },
        priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
        status: {
          key: '💡' as const,
          description: 'Not Started',
        },
        summary: 'Core backend services and APIs.',
      };

      const result = RoadmapItemSchema.safeParse(invalidRoadmapItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('should reject roadmap item with invalid priority level', () => {
      const invalidRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'Invalid',
        priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
        status: 'Not Started',
        summary: 'Core backend services and APIs.',
      };

      const result = RoadmapItemSchema.safeParse(invalidRoadmapItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('priority');
      }
    });

    it('should reject roadmap item with empty priority drivers', () => {
      const invalidRoadmapItem = {
        id: 'P1',
        childPlanTask: '[Backend Plan](p1-backend.plan.md)',
        priority: 'High',
        priorityDrivers: [], // Empty array
        status: 'Not Started',
        summary: 'Core backend services and APIs.',
      };

      const result = RoadmapItemSchema.safeParse(invalidRoadmapItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('priorityDrivers');
      }
    });
  });

  describe('Backlog Item Schema', () => {
    it('should validate a complete backlog item', () => {
      const validBacklogItem = {
        name: 'Reporting Plan',
        reason: 'Deferred to Q4 due to dependency on new analytics service.',
      };

      const result = BacklogItemSchema.safeParse(validBacklogItem);
      expect(result.success).toBe(true);
    });

    it('should reject backlog item with missing name', () => {
      const invalidBacklogItem = {
        reason: 'Deferred to Q4 due to dependency on new analytics service.',
      };

      const result = BacklogItemSchema.safeParse(invalidBacklogItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject backlog item with empty reason', () => {
      const invalidBacklogItem = {
        name: 'Reporting Plan',
        reason: '',
      };

      const result = BacklogItemSchema.safeParse(invalidBacklogItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('reason');
      }
    });
  });

  describe('Dependency Schema', () => {
    it('should validate a complete dependency', () => {
      const validDependency = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External' as const,
        status: 'Blocked',
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const result = DependencySchema.safeParse(validDependency);
      expect(result.success).toBe(true);
    });

    it('should validate internal dependency', () => {
      const validInternalDependency = {
        id: 'D-2',
        dependencyOn: 'Plan p2-user-profiles',
        type: 'Internal' as const,
        status: 'Complete',
        affectedPlansTasks: ['p3-reporting'],
        notes: 'User schema is now finalized.',
      };

      const result = DependencySchema.safeParse(validInternalDependency);
      expect(result.success).toBe(true);
    });

    it('should reject dependency with missing ID', () => {
      const invalidDependency = {
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External' as const,
        status: 'Blocked',
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const result = DependencySchema.safeParse(invalidDependency);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('should reject dependency with invalid type', () => {
      const invalidDependency = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'Invalid' as any, // Invalid type
        status: 'Blocked',
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const result = DependencySchema.safeParse(invalidDependency);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('type');
      }
    });

    it('should reject dependency with invalid status', () => {
      const invalidDependency = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External' as const,
        status: 'Invalid', // Invalid status
        affectedPlansTasks: ['p1-frontend'],
        notes: 'Awaiting release from Platform team.',
      };

      const result = DependencySchema.safeParse(invalidDependency);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('status');
      }
    });

    it('should reject dependency with empty affected plans/tasks', () => {
      const invalidDependency = {
        id: 'D-1',
        dependencyOn: 'shared-ui-library v2.1+',
        type: 'External' as const,
        status: 'Blocked',
        affectedPlansTasks: [], // Empty array
        notes: 'Awaiting release from Platform team.',
      };

      const result = DependencySchema.safeParse(invalidDependency);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('affectedPlansTasks');
      }
    });
  });

  describe('Decomposition Graph Schema', () => {
    it('should validate a decomposition graph', () => {
      const validDecompositionGraph = `graph
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
    T3 --> T4`;

      const result = DecompositionGraphSchema.safeParse(validDecompositionGraph);
      expect(result.success).toBe(true);
    });

    it('should reject empty decomposition graph', () => {
      const result = DecompositionGraphSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('Planning & Decomposition Schema (Complete Family)', () => {
    it('should validate a complete planning decomposition for a Plan', () => {
      const validPlanningDecomposition = {
        roadmap: [
          {
            id: 'P1',
            childPlanTask: '[Backend Plan](p1-backend.plan.md)',
            priority: 'High',
            priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
            status: 'Not Started',
            dependsOn: '—',
            summary: 'Core backend services and APIs.',
          },
          {
            id: 'T1',
            childPlanTask: '[Database Setup](p1.t1-database-setup.task.md)',
            priority: 'Medium',
            priorityDrivers: ['TEC-Prod_Stability_Blocker'],
            status: 'Not Started',
            summary: 'Configure production database.',
          },
        ],
        backlog: [
          {
            name: 'Reporting Plan',
            reason: 'Deferred to Q4 due to dependency on new analytics service.',
          },
          {
            name: 'Real-time Collaboration Features',
            reason: 'Moved to Icebox as it is outside the scope of the current MVP.',
          },
        ],
        dependencies: [
          {
            id: 'D-1',
            dependencyOn: 'shared-ui-library v2.1+',
            type: 'External' as const,
            status: 'Blocked',
            affectedPlansTasks: ['p1-frontend'],
            notes: 'Awaiting release from Platform team.',
          },
          {
            id: 'D-2',
            dependencyOn: 'Plan p2-user-profiles',
            type: 'Internal' as const,
            status: 'Complete',
            affectedPlansTasks: ['p3-reporting'],
            notes: 'User schema is now finalized.',
          },
        ],
        decompositionGraph: `graph
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

      const result = PlanningDecompositionFamilySchema.safeParse(validPlanningDecomposition);
      expect(result.success).toBe(true);
    });

    it('should validate a complete planning decomposition for a Task', () => {
      const validTaskPlanningDecomposition = {
        dependencies: [
          {
            id: 'D-1',
            dependencyOn: 'p1.t28-define-schema-types.task.md',
            type: 'Internal' as const,
            status: 'Complete',
            affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
            notes: 'Schema types must be defined before content validation schemas.',
          },
        ],
      };

      const result = PlanningDecompositionFamilySchema.safeParse(validTaskPlanningDecomposition);
      expect(result.success).toBe(true);
    });

    it('should validate empty planning decomposition (all optional fields)', () => {
      const emptyPlanningDecomposition = {};

      const result = PlanningDecompositionFamilySchema.safeParse(emptyPlanningDecomposition);
      expect(result.success).toBe(true);
    });

    it('should reject planning decomposition with invalid roadmap item', () => {
      const invalidPlanningDecomposition = {
        roadmap: [
          {
            id: 'P1',
            // Missing required fields
            summary: 'Core backend services and APIs.',
          },
        ],
      };

      const result = PlanningDecompositionFamilySchema.safeParse(invalidPlanningDecomposition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('roadmap');
      }
    });

    it('should reject planning decomposition with invalid dependency', () => {
      const invalidPlanningDecomposition = {
        dependencies: [
          {
            id: 'D-1',
            dependencyOn: 'shared-ui-library v2.1+',
            type: 'Invalid' as any, // Invalid type
            status: 'Blocked',
            affectedPlansTasks: ['p1-frontend'],
            notes: 'Awaiting release from Platform team.',
          },
        ],
      };

      const result = PlanningDecompositionFamilySchema.safeParse(invalidPlanningDecomposition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('dependencies');
      }
    });
  });
});
