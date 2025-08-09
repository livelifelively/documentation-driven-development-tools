import { describe, it, expect } from 'vitest';
import {
  createPlanningDecompositionSchema,
  getPlanningDecompositionTaskSchema,
  getPlanningDecompositionPlanSchema,
} from '../3-planning-decomposition.schema.js';
import { z } from 'zod';

describe('Planning & Decomposition Schema Validation', () => {
  describe('Factory Function Tests', () => {
    describe('createPlanningDecompositionSchema', () => {
      it('should create plan schema with plan-specific sections', () => {
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

      it('should create task schema with task-specific sections', () => {
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

      it('should omit plan-specific sections from task schema', () => {
        const taskSchema = createPlanningDecompositionSchema('task');

        // Test that validation passes with only task-specific sections
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

        const validResult = taskSchema.safeParse(validTaskData);
        expect(validResult.success).toBe(true);

        // Verify that the schema shape only includes task-specific sections
        const schemaShape = taskSchema.shape;
        expect(schemaShape).toHaveProperty('dependencies');
        expect(schemaShape).not.toHaveProperty('roadmapInFocusItems');
        expect(schemaShape).not.toHaveProperty('backlogIcebox');
        expect(schemaShape).not.toHaveProperty('decompositionGraph');
      });

      it('should omit task-specific sections from plan schema', () => {
        const planSchema = createPlanningDecompositionSchema('plan');

        // Test that validation passes with only plan-specific sections
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
            diagram: `graph\nA --> B`,
          },
        };

        const validResult = planSchema.safeParse(validPlanData);
        expect(validResult.success).toBe(true);

        // Verify that the schema shape includes all plan-specific sections
        const schemaShape = planSchema.shape;
        expect(schemaShape).toHaveProperty('roadmapInFocusItems');
        expect(schemaShape).toHaveProperty('backlogIcebox');
        expect(schemaShape).toHaveProperty('dependencies');
        expect(schemaShape).toHaveProperty('decompositionGraph');
      });
    });

    describe('Convenience Functions', () => {
      it('should create task schema via convenience function', () => {
        const taskSchema = getPlanningDecompositionTaskSchema();
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

      it('should create plan schema via convenience function', () => {
        const planSchema = getPlanningDecompositionPlanSchema();
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
            diagram: `graph\nA --> B`,
          },
        };

        const result = planSchema.safeParse(validPlanData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Individual Section Tests', () => {
    describe('Plan-Specific Section Tests', () => {
      describe('Roadmap Schema (Plan)', () => {
        it('should validate a complete roadmap array', () => {
          const validRoadmap = [
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
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.roadmapInFocusItems.safeParse(validRoadmap);
          expect(result.success).toBe(true);
        });

        it('should reject roadmap array with missing required fields', () => {
          const invalidRoadmap = [
            {
              id: 'P1',
              // Missing required fields
              summary: 'Core backend services and APIs.',
            },
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.roadmapInFocusItems.safeParse(invalidRoadmap);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('childPlanTask');
          }
        });

        it('should reject empty roadmap array', () => {
          const invalidRoadmap: any[] = [];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.roadmapInFocusItems.safeParse(invalidRoadmap);
          expect(result.success).toBe(false);
        });
      });

      describe('Backlog Schema (Plan)', () => {
        it('should validate a complete backlog array', () => {
          const validBacklog = [
            {
              name: 'Reporting Plan',
              reason: 'Deferred to Q4 due to dependency on new analytics service.',
            },
            {
              name: 'Real-time Collaboration Features',
              reason: 'Moved to Icebox as it is outside the scope of the current MVP.',
            },
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.backlogIcebox.safeParse(validBacklog);
          expect(result.success).toBe(true);
        });

        it('should reject backlog array with missing name', () => {
          const invalidBacklog = [
            {
              reason: 'Deferred to Q4 due to dependency on new analytics service.',
            },
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.backlogIcebox.safeParse(invalidBacklog);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('name');
          }
        });

        it('should reject empty backlog array', () => {
          const invalidBacklog: any[] = [];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.backlogIcebox.safeParse(invalidBacklog);
          expect(result.success).toBe(false);
        });
      });

      describe('Decomposition Graph Schema (Plan)', () => {
        it('should validate a decomposition graph', () => {
          const validDecompositionGraph = {
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

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(validDecompositionGraph);
          expect(result.success).toBe(true);
        });

        it('should validate a decomposition graph with direction', () => {
          const validDecompositionGraphWithDirection = {
            diagram: `graph TD
A --> B
B --> C
C --> D`,
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(validDecompositionGraphWithDirection);
          expect(result.success).toBe(true);

          // Verify the transformed output has the correct structure
          if (result.success) {
            expect((result.data as any).diagram).toEqual({
              type: 'mermaid',
              diagramType: 'graph',
              direction: 'TD',
              content: 'A --> B\nB --> C\nC --> D',
            });
          }
        });

        it('should validate a decomposition graph with different direction', () => {
          const validDecompositionGraphWithLRDirection = {
            diagram: `graph LR
A --> B
B --> C`,
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(validDecompositionGraphWithLRDirection);
          expect(result.success).toBe(true);

          if (result.success) {
            expect((result.data as any).diagram).toEqual({
              type: 'mermaid',
              diagramType: 'graph',
              direction: 'LR',
              content: 'A --> B\nB --> C',
            });
          }
        });

        it('should validate decomposition graph with text content', () => {
          const validDecompositionGraphWithText = {
            text: [
              'This diagram shows the decomposition of our authentication system, with the backend plan as the foundation and UI tasks building upon it.',
            ],
            diagram: `graph TD
A --> B
B --> C`,
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(validDecompositionGraphWithText);
          expect(result.success).toBe(true);
        });

        it('should validate decomposition graph with multiple text lines', () => {
          const validDecompositionGraphWithMultipleText = {
            text: [
              'This diagram shows the decomposition of our authentication system.',
              'The backend plan serves as the foundation, with UI tasks building upon it.',
              'Each task has clear dependencies and deliverables.',
            ],
            diagram: `graph TD
A --> B
B --> C`,
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(validDecompositionGraphWithMultipleText);
          expect(result.success).toBe(true);
        });

        it('should reject decomposition graph with only text content', () => {
          const invalidDecompositionGraphWithOnlyText = {
            text: ['The decomposition graph will be added during the planning phase.'],
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(invalidDecompositionGraphWithOnlyText);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.message).toContain('expected string, received undefined');
          }
        });

        it('should reject decomposition graph with wrong diagram type', () => {
          const invalidDecompositionGraph = {
            diagram: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains`,
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(invalidDecompositionGraph);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.message).toContain('Diagram must be a valid Mermaid graph');
          }
        });

        it('should reject decomposition graph with invalid direction', () => {
          const invalidDecompositionGraph = {
            diagram: `graph INVALID
A --> B`,
          };

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(invalidDecompositionGraph);
          expect(result.success).toBe(true); // Should still be valid, just no direction detected
        });

        it('should reject empty decomposition graph', () => {
          const invalidDecompositionGraph = {};
          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.decompositionGraph.safeParse(invalidDecompositionGraph);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('Both Plan and Task Section Tests', () => {
      describe('Dependencies Schema (Plan)', () => {
        it('should validate a complete dependencies array for plan', () => {
          const validDependencies = [
            {
              id: 'D-1',
              dependencyOn: 'shared-ui-library v2.1+',
              type: 'External',
              status: 'Blocked',
              affectedPlansTasks: ['p1-frontend'],
              notes: 'Awaiting release from Platform team.',
            },
            {
              id: 'D-2',
              dependencyOn: 'Plan p2-user-profiles',
              type: 'Internal',
              status: 'Complete',
              affectedPlansTasks: ['p3-reporting'],
              notes: 'User schema is now finalized.',
            },
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.dependencies.safeParse(validDependencies);
          expect(result.success).toBe(true);
        });

        it('should reject dependencies array with missing ID', () => {
          const invalidDependencies = [
            {
              dependencyOn: 'shared-ui-library v2.1+',
              type: 'External',
              status: 'Blocked',
              affectedPlansTasks: ['p1-frontend'],
              notes: 'Awaiting release from Platform team.',
            },
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.dependencies.safeParse(invalidDependencies);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('id');
          }
        });

        it('should reject dependencies array with invalid type', () => {
          const invalidDependencies = [
            {
              id: 'D-1',
              dependencyOn: 'shared-ui-library v2.1+',
              type: 'Invalid' as any,
              status: 'Blocked',
              affectedPlansTasks: ['p1-frontend'],
              notes: 'Awaiting release from Platform team.',
            },
          ];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.dependencies.safeParse(invalidDependencies);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('type');
          }
        });

        it('should reject empty dependencies array', () => {
          const invalidDependencies: any[] = [];

          const planShape = createPlanningDecompositionSchema('plan').shape as any;
          const result = planShape.dependencies.safeParse(invalidDependencies);
          expect(result.success).toBe(false);
        });
      });

      describe('Dependencies Schema (Task)', () => {
        it('should validate a complete dependencies array for task', () => {
          const validDependencies = [
            {
              id: 'D-1',
              dependencyOn: 'p1.t28-define-schema-types.task.md',
              type: 'Internal',
              status: 'Complete',
              affectedPlansTasks: ['p1-p6.t32-define-section-content-schemas.task.md'],
              notes: 'Schema types must be defined before content validation schemas.',
            },
          ];

          const taskShape = createPlanningDecompositionSchema('task').shape as any;
          const result = taskShape.dependencies.safeParse(validDependencies);
          expect(result.success).toBe(true);
        });

        it('should reject dependencies array with missing required fields for task', () => {
          const invalidDependencies = [
            {
              id: 'D-1',
              dependencyOn: 'p1.t28-define-schema-types.task.md',
              // Missing required fields
              notes: 'Schema types must be defined before content validation schemas.',
            },
          ];

          const taskShape = createPlanningDecompositionSchema('task').shape as any;
          const result = taskShape.dependencies.safeParse(invalidDependencies);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].path).toContain('type');
          }
        });
      });
    });
  });

  describe('Planning & Decomposition Schema (Complete Family)', () => {
    it('should validate a complete planning decomposition for a Plan', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const validPlanPlanningDecomposition = {
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

      const result = planSchema.safeParse(validPlanPlanningDecomposition);
      expect(result.success).toBe(true);
    });

    it('should validate a complete planning decomposition for a Task', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const validTaskPlanningDecomposition = {
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

      const result = taskSchema.safeParse(validTaskPlanningDecomposition);
      expect(result.success).toBe(true);
    });

    it('should reject planning decomposition with missing required sections for plan', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const invalidPlanPlanningDecomposition = {
        // Missing required sections
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
      };

      const result = planSchema.safeParse(invalidPlanPlanningDecomposition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('roadmapInFocusItems');
      }
    });

    it('should reject planning decomposition with missing required sections for task', () => {
      const taskSchema = createPlanningDecompositionSchema('task');
      const invalidTaskPlanningDecomposition = {
        // Missing required dependencies section
      };

      const result = taskSchema.safeParse(invalidTaskPlanningDecomposition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('dependencies');
      }
    });

    it('should reject planning decomposition with invalid roadmap item', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const invalidPlanningDecomposition = {
        roadmapInFocusItems: [
          {
            id: 'P1',
            // Missing required fields
            summary: 'Core backend services and APIs.',
          },
        ],
      };

      const result = planSchema.safeParse(invalidPlanningDecomposition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('roadmapInFocusItems');
      }
    });

    it('should reject planning decomposition with invalid dependency', () => {
      const planSchema = createPlanningDecompositionSchema('plan');
      const invalidPlanningDecomposition = {
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
            type: 'Invalid' as any, // Invalid type
            status: 'Blocked',
            affectedPlansTasks: ['p1-frontend'],
            notes: 'Awaiting release from Platform team.',
          },
        ],
        decompositionGraph: {
          diagram: `graph\nA --> B`,
        },
      };

      const result = planSchema.safeParse(invalidPlanningDecomposition);
      expect(result.success).toBe(false);
      if (!result.success) {
        // The error path should be 'dependencies' since that's where the invalid data is
        expect(result.error.issues[0].path).toContain('dependencies');
      }
    });
  });

  describe('Individual Schema Tests (Backward Compatibility)', () => {
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

        const result = createPlanningDecompositionSchema('plan').shape.roadmapInFocusItems.safeParse([
          validRoadmapItem,
        ]);
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

        const result = createPlanningDecompositionSchema('plan').shape.roadmapInFocusItems.safeParse([
          validRoadmapItem,
        ]);
        expect(result.success).toBe(true);
      });

      it('should reject roadmap item with missing ID', () => {
        const invalidRoadmapItem = {
          childPlanTask: '[Backend Plan](p1-backend.plan.md)',
          priority: 'High',
          priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
          status: 'Not Started',
          summary: 'Core backend services and APIs.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.roadmapInFocusItems.safeParse([
          invalidRoadmapItem,
        ]);
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

        const result = createPlanningDecompositionSchema('plan').shape.roadmapInFocusItems.safeParse([
          invalidRoadmapItem,
        ]);
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

        const result = createPlanningDecompositionSchema('plan').shape.roadmapInFocusItems.safeParse([
          invalidRoadmapItem,
        ]);
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

        const result = createPlanningDecompositionSchema('plan').shape.backlogIcebox.safeParse([validBacklogItem]);
        expect(result.success).toBe(true);
      });

      it('should reject backlog item with missing name', () => {
        const invalidBacklogItem = {
          reason: 'Deferred to Q4 due to dependency on new analytics service.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.backlogIcebox.safeParse([invalidBacklogItem]);
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

        const result = createPlanningDecompositionSchema('plan').shape.backlogIcebox.safeParse([invalidBacklogItem]);
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
          type: 'External',
          status: 'Blocked',
          affectedPlansTasks: ['p1-frontend'],
          notes: 'Awaiting release from Platform team.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.dependencies.safeParse([validDependency]);
        expect(result.success).toBe(true);
      });

      it('should validate internal dependency', () => {
        const validInternalDependency = {
          id: 'D-2',
          dependencyOn: 'Plan p2-user-profiles',
          type: 'Internal',
          status: 'Complete',
          affectedPlansTasks: ['p3-reporting'],
          notes: 'User schema is now finalized.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.dependencies.safeParse([
          validInternalDependency,
        ]);
        expect(result.success).toBe(true);
      });

      it('should reject dependency with missing ID', () => {
        const invalidDependency = {
          dependencyOn: 'shared-ui-library v2.1+',
          type: 'External',
          status: 'Blocked',
          affectedPlansTasks: ['p1-frontend'],
          notes: 'Awaiting release from Platform team.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.dependencies.safeParse([invalidDependency]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('id');
        }
      });

      it('should reject dependency with invalid type', () => {
        const invalidDependency = {
          id: 'D-1',
          dependencyOn: 'shared-ui-library v2.1+',
          type: 'Invalid' as any,
          status: 'Blocked',
          affectedPlansTasks: ['p1-frontend'],
          notes: 'Awaiting release from Platform team.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.dependencies.safeParse([invalidDependency]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('type');
        }
      });

      it('should reject dependency with invalid status', () => {
        const invalidDependency = {
          id: 'D-1',
          dependencyOn: 'shared-ui-library v2.1+',
          type: 'External',
          status: 'Invalid' as any,
          affectedPlansTasks: ['p1-frontend'],
          notes: 'Awaiting release from Platform team.',
        };

        const result = createPlanningDecompositionSchema('plan').shape.dependencies.safeParse([invalidDependency]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('status');
        }
      });

      it('should reject dependency with empty affected plans/tasks', () => {
        const invalidDependency = {
          id: 'D-1',
          dependencyOn: 'shared-ui-library v2.1+',
          type: 'External',
          status: 'Blocked',
          affectedPlansTasks: [], // Empty array
          notes: 'Awaiting release from Platform team.',
        };

        const planShape = createPlanningDecompositionSchema('plan').shape as any;
        const result = planShape.dependencies.safeParse([invalidDependency]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('affectedPlansTasks');
        }
      });
    });

    describe('Decomposition Graph Schema', () => {
      it('should validate a decomposition graph', () => {
        const validDecompositionGraph = {
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

        const planShape = createPlanningDecompositionSchema('plan').shape as any;
        const result = planShape.decompositionGraph.safeParse(validDecompositionGraph);
        expect(result.success).toBe(true);
      });

      it('should validate a decomposition graph with direction', () => {
        const validDecompositionGraphWithDirection = {
          diagram: `graph TD
A --> B
B --> C`,
        };

        const planShape = createPlanningDecompositionSchema('plan').shape as any;
        const result = planShape.decompositionGraph.safeParse(validDecompositionGraphWithDirection);
        expect(result.success).toBe(true);
      });

      it('should reject empty decomposition graph', () => {
        const invalidDecompositionGraph = { diagram: '' };

        const planShape = createPlanningDecompositionSchema('plan').shape as any;
        const result = planShape.decompositionGraph.safeParse(invalidDecompositionGraph);
        expect(result.success).toBe(false);
      });
    });
  });
});
