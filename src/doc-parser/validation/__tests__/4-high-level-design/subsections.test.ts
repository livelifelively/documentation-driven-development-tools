import { describe, it, expect } from 'vitest';
import {
  createHighLevelDesignSchema,
  getHighLevelDesignTaskSchema,
  getHighLevelDesignPlanSchema,
} from '../../4-high-level-design.schema.js';
import { z } from 'zod';

describe('High-Level Design Schema - Subsection Tests', () => {
  describe('Target Architecture Subsection Tests', () => {
    describe('Data Models Schema (4.2.1)', () => {
      const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
      const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

      it('should validate data models for plan', () => {
        const validData = { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' };
        expect(byId['4.2.1'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
            downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        };
        expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid data models for plan', () => {
        const invalidData = { diagram: 'classDiagram A' }; // Wrong diagram type
        expect(byId['4.2.1'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { dataModels: { diagram: 'classDiagram A' } }; // Wrong diagram type
        expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
      });

      it('should validate data models for task', () => {
        const validData = { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' };
        expect(byIdTask['4.2.1'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
            downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
        };
        expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid data models for task', () => {
        const invalidData = { diagram: 'graph TD A-->B' }; // Wrong diagram type
        expect(byIdTask['4.2.1'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { dataModels: { diagram: 'graph TD A-->B' } }; // Wrong diagram type
        expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
      });
    });

    describe('Components Schema (4.2.2)', () => {
      const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
      const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

      it('should validate components for plan', () => {
        const validData = { diagram: 'classDiagram\ndirection LR\nclass UserService' };
        expect(byId['4.2.2'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
            downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        };
        expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid components for plan', () => {
        const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
        expect(byId['4.2.2'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { components: { diagram: 'erDiagram A' } }; // Wrong diagram type
        expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
      });

      it('should validate components for task', () => {
        const validData = { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' };
        expect(byIdTask['4.2.2'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
            downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
        };
        expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid components for task', () => {
        const invalidData = { diagram: 'graph TD A-->B' }; // Wrong diagram type
        expect(byIdTask['4.2.2'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { components: { diagram: 'graph TD A-->B' } }; // Wrong diagram type
        expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
      });
    });

    describe('Data Flow Schema (4.2.3)', () => {
      const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
      const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

      it('should validate data flow for plan', () => {
        const validData = { diagram: 'graph TD\nA --> B\nB --> C' };
        expect(byId['4.2.3'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
            downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        };
        expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid data flow for plan', () => {
        const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
        expect(byId['4.2.3'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { dataFlow: { diagram: 'erDiagram A' } }; // Wrong diagram type
        expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
      });

      it('should validate data flow for task', () => {
        const validData = { diagram: 'graph TD\nInput --> Process --> Output' };
        expect(byIdTask['4.2.3'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
            downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
        };
        expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid data flow for task', () => {
        const invalidData = { diagram: 'classDiagram A' }; // Wrong diagram type
        expect(byIdTask['4.2.3'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { dataFlow: { diagram: 'classDiagram A' } }; // Wrong diagram type
        expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
      });
    });

    describe('Control Flow Schema (4.2.4)', () => {
      const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
      const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

      it('should validate control flow for plan', () => {
        const validData = { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' };
        expect(byId['4.2.4'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
            downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        };
        expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid control flow for plan', () => {
        const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
        expect(byId['4.2.4'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { controlFlow: { diagram: 'erDiagram A' } }; // Wrong diagram type
        expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
      });

      it('should validate control flow for task', () => {
        const validData = { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' };
        expect(byIdTask['4.2.4'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId' }],
            downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
          },
          exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
        };
        expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid control flow for task', () => {
        const invalidData = { diagram: 'graph TD A-->B' }; // Wrong diagram type
        expect(byIdTask['4.2.4'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = { controlFlow: { diagram: 'graph TD A-->B' } }; // Wrong diagram type
        expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
      });
    });

    describe('Integration Points Schema (4.2.5)', () => {
      const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
      const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

      it('should validate integration points for plan', () => {
        const validData = {
          upstream: [
            {
              trigger: 'User action via UI button click',
              inputData: 'Receives documentId and userId from the client',
            },
          ],
          downstream: [
            {
              trigger: 'Emits a DOCUMENT_PROCESSED event',
              inputData: 'The event payload includes documentId and status',
            },
          ],
        };
        expect(byId['4.2.5'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
          components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
          dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
          integrationPoints: {
            upstream: [
              {
                trigger: 'User action via UI button click',
                inputData: 'Receives documentId and userId from the client',
              },
            ],
            downstream: [
              {
                trigger: 'Emits a DOCUMENT_PROCESSED event',
                inputData: 'The event payload includes documentId and status',
              },
            ],
          },
          exposedAPI: 'paths:\n  /users/{userId}:\n    get:\n      summary: Get user by ID',
        };
        expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid integration points for plan', () => {
        const invalidData = {
          upstream: [{ trigger: '', inputData: 'Receives documentId and userId from the client' }], // Empty trigger
        };
        expect(byId['4.2.5'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = {
          integrationPoints: {
            upstream: [{ trigger: '', inputData: 'Receives documentId and userId from the client' }], // Empty trigger
          },
        };
        expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
      });

      it('should validate integration points for task', () => {
        const validData = {
          upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
          downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
        };
        expect(byIdTask['4.2.5'].safeParse(validData).success).toBe(true);

        const validComposedData = {
          dataModels: { diagram: 'erDiagram\nTASK ||--o{ SUBTASK : contains' },
          components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
          dataFlow: { diagram: 'graph TD\nInput --> Process --> Output' },
          controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: 'Receives taskId and parameters' }],
            downstream: [{ trigger: 'Task completion event', inputData: 'Emits result and status' }],
          },
          exposedAPI: 'paths:\n  /tasks/{taskId}:\n    post:\n      summary: Process task',
        };
        expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
      });

      it('should reject invalid integration points for task', () => {
        const invalidData = {
          upstream: [{ trigger: 'Task creation event', inputData: '' }], // Empty inputData
        };
        expect(byIdTask['4.2.5'].safeParse(invalidData).success).toBe(false);

        const invalidComposedData = {
          integrationPoints: {
            upstream: [{ trigger: 'Task creation event', inputData: '' }], // Empty inputData
          },
        };
        expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
      });
    });

    describe('Current Architecture Subsection Tests', () => {
      describe('Data Models Schema (4.1.1)', () => {
        const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
        const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

        it('should validate data models for plan', () => {
          const validData = { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' };
          expect(byId['4.1.1'].safeParse(validData).success).toBe(true);

          const validComposedData = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
              downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
            },
          };
          expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
        });

        it('should reject invalid data models for plan', () => {
          const invalidData = { diagram: 'classDiagram A' }; // Wrong diagram type
          expect(byId['4.1.1'].safeParse(invalidData).success).toBe(false);

          const invalidComposedData = { dataModels: { diagram: 'classDiagram A' } }; // Wrong diagram type
          expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
        });
      });

      describe('Components Schema (4.1.2)', () => {
        const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
        const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

        it('should validate components for plan', () => {
          const validData = { diagram: 'classDiagram\ndirection LR\nclass UserService' };
          expect(byId['4.1.2'].safeParse(validData).success).toBe(true);

          const validComposedData = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
              downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
            },
          };
          expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
        });

        it('should reject invalid components for plan', () => {
          const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
          expect(byId['4.1.2'].safeParse(invalidData).success).toBe(false);

          const invalidComposedData = { components: { diagram: 'erDiagram A' } }; // Wrong diagram type
          expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
        });
      });

      describe('Data Flow Schema (4.1.3)', () => {
        const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
        const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

        it('should validate data flow for plan', () => {
          const validData = { diagram: 'graph TD\nA --> B\nB --> C' };
          expect(byId['4.1.3'].safeParse(validData).success).toBe(true);

          const validComposedData = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
              downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
            },
          };
          expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
        });

        it('should reject invalid data flow for plan', () => {
          const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
          expect(byId['4.1.3'].safeParse(invalidData).success).toBe(false);

          const invalidComposedData = { dataFlow: { diagram: 'erDiagram A' } }; // Wrong diagram type
          expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
        });
      });

      describe('Control Flow Schema (4.1.4)', () => {
        const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
        const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

        it('should validate control flow for plan', () => {
          const validData = { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' };
          expect(byId['4.1.4'].safeParse(validData).success).toBe(true);

          const validComposedData = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
              downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
            },
          };
          expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
        });

        it('should reject invalid control flow for plan', () => {
          const invalidData = { diagram: 'erDiagram A' }; // Wrong diagram type
          expect(byId['4.1.4'].safeParse(invalidData).success).toBe(false);

          const invalidComposedData = { controlFlow: { diagram: 'erDiagram A' } }; // Wrong diagram type
          expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
        });
      });

      describe('Integration Points Schema (4.1.5)', () => {
        const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
        const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

        it('should validate integration points for plan', () => {
          const validData = {
            upstream: [
              {
                trigger: 'User action via UI button click',
                inputData: 'Receives documentId and userId from the client',
              },
            ],
            downstream: [
              {
                trigger: 'Emits a DOCUMENT_PROCESSED event',
                inputData: 'The event payload includes documentId and status',
              },
            ],
          };
          expect(byId['4.1.5'].safeParse(validData).success).toBe(true);

          const validComposedData = {
            dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
            components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
            dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
            controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
            integrationPoints: {
              upstream: [
                {
                  trigger: 'User action via UI button click',
                  inputData: 'Receives documentId and userId from the client',
                },
              ],
              downstream: [
                {
                  trigger: 'Emits a DOCUMENT_PROCESSED event',
                  inputData: 'The event payload includes documentId and status',
                },
              ],
            },
          };
          expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
        });

        it('should reject invalid integration points for plan', () => {
          const invalidData = {
            upstream: [{ trigger: '', inputData: 'Receives documentId and userId from the client' }], // Empty trigger
          };
          expect(byId['4.1.5'].safeParse(invalidData).success).toBe(false);

          const invalidComposedData = {
            integrationPoints: {
              upstream: [{ trigger: '', inputData: 'Receives documentId and userId from the client' }], // Empty trigger
            },
          };
          expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
        });
      });

      describe('Non-Functional Requirements Subsection Tests', () => {
        describe('Performance Schema (4.4.1)', () => {
          const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
          const nonFuncPlanSchema = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
          const nonFuncTaskSchema = (createHighLevelDesignSchema('task').shape as any).nonFunctionalRequirements;

          it('should validate performance requirements for plan', () => {
            const validData = [
              { id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' },
              { id: 'PERF-02', requirement: 'Database query time < 50ms', priority: 'Medium' },
            ];
            expect(byId['4.4.1'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [
                { id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' },
                { id: 'PERF-02', requirement: 'Database query time < 50ms', priority: 'Medium' },
              ],
              security: [{ id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' }],
              reliability: [{ id: 'REL-01', requirement: '99.9% uptime', priority: 'High' }],
              permissionModel: [{ role: 'Admin', permissions: ['Full access'], notes: 'System administrators' }],
            };
            expect(nonFuncPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid performance requirements for plan', () => {
            const invalidData = [
              { id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'Invalid' }, // Invalid priority
            ];
            expect(byId['4.4.1'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              performance: [
                { id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'Invalid' }, // Invalid priority
              ],
            };
            expect(nonFuncPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate performance requirements for task', () => {
            const validData = [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }];
            expect(byIdTask['4.4.1'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
              security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
              reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
              permissionModel: [
                { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
              ],
            };
            expect(nonFuncTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid performance requirements for task', () => {
            const invalidData = [
              { id: '', requirement: 'Task processing < 5 minutes', priority: 'Medium' }, // Empty id
            ];
            expect(byIdTask['4.4.1'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              performance: [
                { id: '', requirement: 'Task processing < 5 minutes', priority: 'Medium' }, // Empty id
              ],
            };
            expect(nonFuncTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Security Schema (4.4.2)', () => {
          const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
          const nonFuncPlanSchema = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
          const nonFuncTaskSchema = (createHighLevelDesignSchema('task').shape as any).nonFunctionalRequirements;

          it('should validate security requirements for plan', () => {
            const validData = [
              { id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' },
              { id: 'SEC-02', requirement: 'JWT token expiration < 1 hour', priority: 'High' },
            ];
            expect(byId['4.4.2'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' }],
              security: [
                { id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' },
                { id: 'SEC-02', requirement: 'JWT token expiration < 1 hour', priority: 'High' },
              ],
              reliability: [{ id: 'REL-01', requirement: '99.9% uptime', priority: 'High' }],
              permissionModel: [{ role: 'Admin', permissions: ['Full access'], notes: 'System administrators' }],
            };
            expect(nonFuncPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid security requirements for plan', () => {
            const invalidData = [
              { id: 'SEC-01', requirement: '', priority: 'High' }, // Empty requirement
            ];
            expect(byId['4.4.2'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              security: [
                { id: 'SEC-01', requirement: '', priority: 'High' }, // Empty requirement
              ],
            };
            expect(nonFuncPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate security requirements for task', () => {
            const validData = [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }];
            expect(byIdTask['4.4.2'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
              security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
              reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
              permissionModel: [
                { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
              ],
            };
            expect(nonFuncTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid security requirements for task', () => {
            const invalidData = [
              { id: 'SEC-01', requirement: 'Task data isolation', priority: 'Invalid' }, // Invalid priority
            ];
            expect(byIdTask['4.4.2'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              security: [
                { id: 'SEC-01', requirement: 'Task data isolation', priority: 'Invalid' }, // Invalid priority
              ],
            };
            expect(nonFuncTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Reliability Schema (4.4.3)', () => {
          const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
          const nonFuncPlanSchema = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
          const nonFuncTaskSchema = (createHighLevelDesignSchema('task').shape as any).nonFunctionalRequirements;

          it('should validate reliability requirements for plan', () => {
            const validData = [
              { id: 'REL-01', requirement: '99.9% uptime', priority: 'High' },
              { id: 'REL-02', requirement: 'Graceful degradation on failures', priority: 'Medium' },
            ];
            expect(byId['4.4.3'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' }],
              security: [{ id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' }],
              reliability: [
                { id: 'REL-01', requirement: '99.9% uptime', priority: 'High' },
                { id: 'REL-02', requirement: 'Graceful degradation on failures', priority: 'Medium' },
              ],
              permissionModel: [{ role: 'Admin', permissions: ['Full access'], notes: 'System administrators' }],
            };
            expect(nonFuncPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid reliability requirements for plan', () => {
            const invalidData = [
              { id: 'REL-01', requirement: '99.9% uptime', priority: 'Low' }, // Valid priority but testing rejection
            ];
            expect(byId['4.4.3'].safeParse(invalidData).success).toBe(true); // This should pass, so let's test with invalid data
            const invalidData2 = [
              { id: '', requirement: '99.9% uptime', priority: 'High' }, // Empty id
            ];
            expect(byId['4.4.3'].safeParse(invalidData2).success).toBe(false);

            const invalidComposedData = {
              reliability: [
                { id: '', requirement: '99.9% uptime', priority: 'High' }, // Empty id
              ],
            };
            expect(nonFuncPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate reliability requirements for task', () => {
            const validData = [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }];
            expect(byIdTask['4.4.3'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
              security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
              reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
              permissionModel: [
                { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
              ],
            };
            expect(nonFuncTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid reliability requirements for task', () => {
            const invalidData = [
              { id: 'REL-01', requirement: '', priority: 'High' }, // Empty requirement
            ];
            expect(byIdTask['4.4.3'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              reliability: [
                { id: 'REL-01', requirement: '', priority: 'High' }, // Empty requirement
              ],
            };
            expect(nonFuncTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });

        describe('Permission Model Schema (4.4.4)', () => {
          const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
          const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
          const nonFuncPlanSchema = (createHighLevelDesignSchema('plan').shape as any).nonFunctionalRequirements;
          const nonFuncTaskSchema = (createHighLevelDesignSchema('task').shape as any).nonFunctionalRequirements;

          it('should validate permission model for plan', () => {
            const validData = [
              { role: 'Admin', permissions: ['Full access'], notes: 'System administrators' },
              { role: 'User', permissions: ['Read', 'Write'], notes: 'Regular users' },
            ];
            expect(byId['4.4.4'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'API response time < 200ms', priority: 'High' }],
              security: [{ id: 'SEC-01', requirement: 'All data encrypted in transit', priority: 'High' }],
              reliability: [{ id: 'REL-01', requirement: '99.9% uptime', priority: 'High' }],
              permissionModel: [
                { role: 'Admin', permissions: ['Full access'], notes: 'System administrators' },
                { role: 'User', permissions: ['Read', 'Write'], notes: 'Regular users' },
              ],
            };
            expect(nonFuncPlanSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid permission model for plan', () => {
            const invalidData = [
              { role: '', permissions: ['Full access'], notes: 'System administrators' }, // Empty role
            ];
            expect(byId['4.4.4'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              permissionModel: [
                { role: '', permissions: ['Full access'], notes: 'System administrators' }, // Empty role
              ],
            };
            expect(nonFuncPlanSchema.safeParse(invalidComposedData).success).toBe(false);
          });

          it('should validate permission model for task', () => {
            const validData = [
              { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
            ];
            expect(byIdTask['4.4.4'].safeParse(validData).success).toBe(true);

            const validComposedData = {
              performance: [{ id: 'PERF-01', requirement: 'Task processing < 5 minutes', priority: 'Medium' }],
              security: [{ id: 'SEC-01', requirement: 'Task data isolation', priority: 'High' }],
              reliability: [{ id: 'REL-01', requirement: 'Task retry mechanism', priority: 'High' }],
              permissionModel: [
                { role: 'Developer', permissions: ['Create tasks', 'View results'], notes: 'Development team' },
              ],
            };
            expect(nonFuncTaskSchema.safeParse(validComposedData).success).toBe(true);
          });

          it('should reject invalid permission model for task', () => {
            const invalidData = [
              { role: 'Developer', permissions: [], notes: 'Development team' }, // Empty permissions array
            ];
            expect(byIdTask['4.4.4'].safeParse(invalidData).success).toBe(false);

            const invalidComposedData = {
              permissionModel: [
                { role: 'Developer', permissions: [], notes: 'Development team' }, // Empty permissions array
              ],
            };
            expect(nonFuncTaskSchema.safeParse(invalidComposedData).success).toBe(false);
          });
        });
      });

      describe('Deep Nested Integration Tests', () => {
        describe('Current Architecture Integration Points Subsections', () => {
          describe('Upstream Integrations Schema (4.1.5.1)', () => {
            const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
            const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

            it('should validate upstream integrations for plan', () => {
              const validData = [
                { trigger: 'User action', inputData: 'Receives userId' },
                { trigger: 'System event', inputData: 'Receives event data' },
              ];
              expect(byId['4.1.5.1'].safeParse(validData).success).toBe(true);

              const validComposedData = {
                integrationPoints: {
                  upstream: [
                    { trigger: 'User action', inputData: 'Receives userId' },
                    { trigger: 'System event', inputData: 'Receives event data' },
                  ],
                  downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
                },
              };
              expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
            });

            it('should reject invalid upstream integrations for plan', () => {
              const invalidData = [
                { trigger: '', inputData: 'Receives userId' }, // Empty trigger
              ];
              expect(byId['4.1.5.1'].safeParse(invalidData).success).toBe(false);

              const invalidComposedData = {
                integrationPoints: {
                  upstream: [
                    { trigger: '', inputData: 'Receives userId' }, // Empty trigger
                  ],
                },
              };
              expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
            });
          });

          describe('Downstream Integrations Schema (4.1.5.2)', () => {
            const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
            const currentArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).currentArchitecture;

            it('should validate downstream integrations for plan', () => {
              const validData = [
                { trigger: 'Process complete', inputData: 'Emits result' },
                { trigger: 'Data update', inputData: 'Emits updated data' },
              ];
              expect(byId['4.1.5.2'].safeParse(validData).success).toBe(true);

              const validComposedData = {
                integrationPoints: {
                  upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
                  downstream: [
                    { trigger: 'Process complete', inputData: 'Emits result' },
                    { trigger: 'Data update', inputData: 'Emits updated data' },
                  ],
                },
              };
              expect(currentArchPlanSchema.safeParse(validComposedData).success).toBe(true);
            });

            it('should reject invalid downstream integrations for plan', () => {
              const invalidData = [
                { trigger: 'Process complete', inputData: '' }, // Empty inputData
              ];
              expect(byId['4.1.5.2'].safeParse(invalidData).success).toBe(false);

              const invalidComposedData = {
                integrationPoints: {
                  downstream: [
                    { trigger: 'Process complete', inputData: '' }, // Empty inputData
                  ],
                },
              };
              expect(currentArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
            });
          });
        });

        describe('Target Architecture Integration Points Subsections', () => {
          describe('Upstream Integrations Schema (4.2.5.1)', () => {
            const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
            const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
            const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

            it('should validate target upstream integrations for plan', () => {
              const validData = [
                { trigger: 'User action', inputData: 'Receives userId' },
                { trigger: 'API call', inputData: 'Receives request data' },
              ];
              expect(byId['4.2.5.1'].safeParse(validData).success).toBe(true);

              const validComposedData = {
                dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
                components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
                dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
                controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
                integrationPoints: {
                  upstream: [
                    { trigger: 'User action', inputData: 'Receives userId' },
                    { trigger: 'API call', inputData: 'Receives request data' },
                  ],
                  downstream: [{ trigger: 'Process complete', inputData: 'Emits result' }],
                },
                exposedAPI: 'OpenAPI specification content',
              };
              expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
            });

            it('should reject invalid target upstream integrations for plan', () => {
              const invalidData = [
                { trigger: '', inputData: 'Receives userId' }, // Empty trigger
              ];
              expect(byId['4.2.5.1'].safeParse(invalidData).success).toBe(false);

              const invalidComposedData = {
                integrationPoints: {
                  upstream: [
                    { trigger: '', inputData: 'Receives userId' }, // Empty trigger
                  ],
                },
              };
              expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
            });

            it('should validate target upstream integrations for task', () => {
              const validData = [{ trigger: 'Task creation event', inputData: 'Receives task data' }];
              expect(byIdTask['4.2.5.1'].safeParse(validData).success).toBe(true);

              const validComposedData = {
                dataModels: { diagram: 'erDiagram\nTASK ||--o{ RESULT : produces' },
                components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
                dataFlow: { diagram: 'graph TD\nTask --> Processor\nProcessor --> Result' },
                controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
                integrationPoints: {
                  upstream: [{ trigger: 'Task creation event', inputData: 'Receives task data' }],
                  downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
                },
                exposedAPI: 'Task API specification',
              };
              expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
            });

            it('should reject invalid target upstream integrations for task', () => {
              const invalidData = [
                { trigger: 'Task creation event', inputData: '' }, // Empty inputData
              ];
              expect(byIdTask['4.2.5.1'].safeParse(invalidData).success).toBe(false);

              const invalidComposedData = {
                integrationPoints: {
                  upstream: [
                    { trigger: 'Task creation event', inputData: '' }, // Empty inputData
                  ],
                },
              };
              expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
            });
          });

          describe('Downstream Integrations Schema (4.2.5.2)', () => {
            const byId = (createHighLevelDesignSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
            const byIdTask = (createHighLevelDesignSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
            const targetArchPlanSchema = (createHighLevelDesignSchema('plan').shape as any).targetArchitecture;
            const targetArchTaskSchema = (createHighLevelDesignSchema('task').shape as any).targetArchitecture;

            it('should validate target downstream integrations for plan', () => {
              const validData = [
                { trigger: 'Process complete', inputData: 'Emits result' },
                { trigger: 'Data update', inputData: 'Emits updated data' },
              ];
              expect(byId['4.2.5.2'].safeParse(validData).success).toBe(true);

              const validComposedData = {
                dataModels: { diagram: 'erDiagram\nUSER ||--o{ ORDER : places' },
                components: { diagram: 'classDiagram\ndirection LR\nclass UserService' },
                dataFlow: { diagram: 'graph TD\nA --> B\nB --> C' },
                controlFlow: { diagram: 'sequenceDiagram\nparticipant User\nparticipant API' },
                integrationPoints: {
                  upstream: [{ trigger: 'User action', inputData: 'Receives userId' }],
                  downstream: [
                    { trigger: 'Process complete', inputData: 'Emits result' },
                    { trigger: 'Data update', inputData: 'Emits updated data' },
                  ],
                },
                exposedAPI: 'OpenAPI specification content',
              };
              expect(targetArchPlanSchema.safeParse(validComposedData).success).toBe(true);
            });

            it('should reject invalid target downstream integrations for plan', () => {
              const invalidData = [
                { trigger: '', inputData: 'Emits result' }, // Empty trigger
              ];
              expect(byId['4.2.5.2'].safeParse(invalidData).success).toBe(false);

              const invalidComposedData = {
                integrationPoints: {
                  downstream: [
                    { trigger: '', inputData: 'Emits result' }, // Empty trigger
                  ],
                },
              };
              expect(targetArchPlanSchema.safeParse(invalidComposedData).success).toBe(false);
            });

            it('should validate target downstream integrations for task', () => {
              const validData = [{ trigger: 'Task completion event', inputData: 'Emits result' }];
              expect(byIdTask['4.2.5.2'].safeParse(validData).success).toBe(true);

              const validComposedData = {
                dataModels: { diagram: 'erDiagram\nTASK ||--o{ RESULT : produces' },
                components: { diagram: 'classDiagram\ndirection LR\nclass TaskProcessor' },
                dataFlow: { diagram: 'graph TD\nTask --> Processor\nProcessor --> Result' },
                controlFlow: { diagram: 'sequenceDiagram\nparticipant Task\nparticipant Processor' },
                integrationPoints: {
                  upstream: [{ trigger: 'Task creation event', inputData: 'Receives task data' }],
                  downstream: [{ trigger: 'Task completion event', inputData: 'Emits result' }],
                },
                exposedAPI: 'Task API specification',
              };
              expect(targetArchTaskSchema.safeParse(validComposedData).success).toBe(true);
            });

            it('should reject invalid target downstream integrations for task', () => {
              const invalidData = [
                { trigger: 'Task completion event', inputData: '' }, // Empty inputData
              ];
              expect(byIdTask['4.2.5.2'].safeParse(invalidData).success).toBe(false);

              const invalidComposedData = {
                integrationPoints: {
                  downstream: [
                    { trigger: 'Task completion event', inputData: '' }, // Empty inputData
                  ],
                },
              };
              expect(targetArchTaskSchema.safeParse(invalidComposedData).success).toBe(false);
            });
          });
        });
      });
    });
  });
});
