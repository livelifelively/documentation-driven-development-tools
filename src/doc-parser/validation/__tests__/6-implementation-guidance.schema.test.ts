import { describe, it, expect } from 'vitest';
import {
  createImplementationGuidanceSchema,
  getImplementationGuidancePlanSchema,
  getImplementationGuidanceTaskSchema,
} from '../6-implementation-guidance.schema';

describe('Implementation Guidance Schema Validation', () => {
  describe('Implementation Plan Schema', () => {
    it('should validate a complete implementation plan', () => {
      const validImplementationPlan = [
        'Phase 1: Set up project structure and basic configuration',
        'Phase 2: Implement core validation logic',
        'Phase 3: Add comprehensive test coverage',
        'Phase 4: Create integration tests and documentation',
      ];

      const planShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = planShape.implementationPlan.safeParse(validImplementationPlan);
      expect(result.success).toBe(true);
    });

    it('should reject empty implementation plan', () => {
      const planShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = planShape.implementationPlan.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject implementation plan with empty strings', () => {
      const invalidImplementationPlan = [
        'Phase 1: Set up project structure and basic configuration',
        '', // Invalid empty string
        'Phase 3: Add comprehensive test coverage',
      ];

      const planShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = planShape.implementationPlan.safeParse(invalidImplementationPlan);
      expect(result.success).toBe(false);
    });
  });

  describe('Implementation Log Steps Schema', () => {
    it('should validate a complete implementation log', () => {
      const validImplementationLog = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '[x] Implement `ConsoleTransport`.',
        '[ ] Implement `HttpTransport`.',
        '[ ] Write unit tests for transports.',
      ];

      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.implementationLogSteps.safeParse(validImplementationLog);
      expect(result.success).toBe(true);
    });

    it('should reject empty implementation log', () => {
      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.implementationLogSteps.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject implementation log with empty strings', () => {
      const invalidImplementationLog = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '', // Invalid empty string
        '[ ] Write unit tests for transports.',
      ];

      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.implementationLogSteps.safeParse(invalidImplementationLog);
      expect(result.success).toBe(false);
    });
  });

  describe('Initial Situation Schema', () => {
    it('should validate a complete initial situation', () => {
      const validInitialSituation =
        'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming. We need to implement an automated validation system using Zod schemas.';

      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.initialSituation.safeParse(validInitialSituation);
      expect(result.success).toBe(true);
    });

    it('should reject empty initial situation', () => {
      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.initialSituation.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject initial situation with only whitespace', () => {
      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.initialSituation.safeParse('   ');
      expect(result.success).toBe(false);
    });
  });

  describe('Files Change Log Schema', () => {
    it('should validate a complete files change log', () => {
      const validFilesChangeLog = `
Created:
- src/doc-parser/validation/1-meta-governance.schema.ts
- src/doc-parser/validation/__tests__/1-meta-governance.schema.test.ts

Modified:
- src/doc-parser/validation/index.ts (added exports)

Deleted:
- None
      `.trim();

      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.filesChangeLog.safeParse(validFilesChangeLog);
      expect(result.success).toBe(true);
    });

    it('should reject empty files change log', () => {
      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.filesChangeLog.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject files change log with only whitespace', () => {
      const taskShape = createImplementationGuidanceSchema('task').shape as any;
      const result = taskShape.filesChangeLog.safeParse('   ');
      expect(result.success).toBe(false);
    });
  });

  describe('Prompts Schema', () => {
    it('should validate a complete prompts collection', () => {
      const validPrompts = [
        {
          description: 'Generate a Vitest test for this function:',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
        {
          description: 'Create a Zod schema for this object:',
          code: 'interface User { id: string; name: string; email: string; }',
          language: 'typescript',
        },
      ];

      const anyShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = anyShape.promptsLlmReuse.safeParse(validPrompts);
      expect(result.success).toBe(true);
    });

    it('should validate prompts without language specification', () => {
      const validPrompts = [
        {
          description: 'Generate a simple function:',
          code: 'function greet(name) { return `Hello, ${name}!`; }',
        },
      ];

      const anyShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = anyShape.promptsLlmReuse.safeParse(validPrompts);
      expect(result.success).toBe(true);
    });

    it('should reject empty prompts collection', () => {
      const anyShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = anyShape.promptsLlmReuse.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject prompts with missing description', () => {
      const invalidPrompts = [
        {
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];

      const anyShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = anyShape.promptsLlmReuse.safeParse(invalidPrompts);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('description');
      }
    });

    it('should reject prompts with missing code', () => {
      const invalidPrompts = [
        {
          description: 'Generate a Vitest test for this function:',
          language: 'typescript',
        },
      ];

      const anyShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = anyShape.promptsLlmReuse.safeParse(invalidPrompts);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('code');
      }
    });

    it('should reject prompts with empty strings', () => {
      const invalidPrompts = [
        {
          description: '',
          code: 'export const add = (a: number, b: number): number => a + b;',
          language: 'typescript',
        },
      ];

      const anyShape = createImplementationGuidanceSchema('plan').shape as any;
      const result = anyShape.promptsLlmReuse.safeParse(invalidPrompts);
      expect(result.success).toBe(false);
    });
  });

  describe('Implementation Guidance Schema (Complete Family)', () => {
    it('should validate a complete implementation guidance for a Plan', () => {
      const validPlanImplementationGuidance = {
        implementationPlan: [
          'Phase 1: Set up project structure and basic configuration',
          'Phase 2: Implement core validation logic',
          'Phase 3: Add comprehensive test coverage',
          'Phase 4: Create integration tests and documentation',
        ],
        promptsLlmReuse: [
          {
            description: 'Generate a Zod schema for validation:',
            code: 'interface ValidationRule { field: string; type: string; required: boolean; }',
            language: 'typescript',
          },
        ],
      };

      const family = createImplementationGuidanceSchema('plan');
      const result = family.safeParse(validPlanImplementationGuidance);
      expect(result.success).toBe(true);
    });

    it('should validate a complete implementation guidance for a Task', () => {
      const validTaskImplementationGuidance = {
        implementationLogSteps: [
          '[x] Create `logger/types.ts` with core interfaces.',
          '[x] Implement `ConsoleTransport`.',
          '[ ] Implement `HttpTransport`.',
          '[ ] Write unit tests for transports.',
        ],
        initialSituation:
          'The project currently has no validation system in place. All documentation is manually reviewed.',
        filesChangeLog: `
Created:
- src/doc-parser/validation/1-meta-governance.schema.ts
- src/doc-parser/validation/__tests__/1-meta-governance.schema.test.ts

Modified:
- src/doc-parser/validation/index.ts (added exports)
        `.trim(),
        promptsLlmReuse: [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ],
      };

      const family = createImplementationGuidanceSchema('task');
      const result = family.safeParse(validTaskImplementationGuidance);
      expect(result.success).toBe(true);
    });

    it('should validate empty implementation guidance (all optional fields)', () => {
      const emptyImplementationGuidance = {};

      const family = createImplementationGuidanceSchema('plan');
      const result = family.safeParse(emptyImplementationGuidance);
      expect(result.success).toBe(false);
    });

    it('should reject implementation guidance with invalid implementation plan', () => {
      const invalidImplementationGuidance = {
        implementationPlan: [], // Invalid empty array
        prompts: [
          {
            description: 'Generate a Zod schema for validation:',
            code: 'interface ValidationRule { field: string; type: string; required: boolean; }',
            language: 'typescript',
          },
        ],
      };

      const family = createImplementationGuidanceSchema('plan');
      const result = family.safeParse(invalidImplementationGuidance);
      expect(result.success).toBe(false);
    });

    it('should reject implementation guidance with invalid implementation log steps', () => {
      const invalidImplementationGuidance = {
        implementationLogSteps: [
          '[x] Create `logger/types.ts` with core interfaces.',
          '', // Invalid empty string
          '[ ] Write unit tests for transports.',
        ],
      };

      const family = createImplementationGuidanceSchema('task');
      const result = family.safeParse(invalidImplementationGuidance);
      expect(result.success).toBe(false);
    });

    it('should reject implementation guidance with invalid initial situation', () => {
      const invalidImplementationGuidance = {
        initialSituation: '', // Invalid empty string
        filesChangeLog: 'Created: src/doc-parser/validation/1-meta-governance.schema.ts',
      };

      const family = createImplementationGuidanceSchema('task');
      const result = family.safeParse(invalidImplementationGuidance);
      expect(result.success).toBe(false);
    });

    it('should reject implementation guidance with invalid files change log', () => {
      const invalidImplementationGuidance = {
        initialSituation: 'The project currently has no validation system in place.',
        filesChangeLog: '', // Invalid empty string
      };

      const family = createImplementationGuidanceSchema('plan');
      const result = family.safeParse(invalidImplementationGuidance);
      expect(result.success).toBe(false);
    });

    it('should reject implementation guidance with invalid prompts', () => {
      const invalidImplementationGuidance = {
        prompts: [
          {
            description: '', // Invalid empty string
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ],
      };

      const family = createImplementationGuidanceSchema('plan');
      const result = family.safeParse(invalidImplementationGuidance);
      expect(result.success).toBe(false);
    });
  });

  describe('Family factory (docType-specific schemas)', () => {
    it('plan schema: requires implementationPlan, allows promptsLlmReuse, disallows task-only fields', () => {
      const planSchema = getImplementationGuidancePlanSchema();

      const validPlan = {
        implementationPlan: ['Phase 1: Setup', 'Phase 2: Execution'],
        promptsLlmReuse: [{ description: 'Generate tests', code: 'describe(...)' }],
      };
      expect(planSchema.safeParse(validPlan).success).toBe(true);

      // Missing required implementationPlan
      const invalidPlanMissing = { promptsLlmReuse: [{ description: 'x', code: 'y' }] };
      expect(planSchema.safeParse(invalidPlanMissing).success).toBe(false);

      // Disallow task-only fields (strict object)
      const invalidPlanWithTaskFields = {
        implementationPlan: ['Phase 1'],
        implementationLogSteps: ['[x] step'],
        initialSituation: 'state',
        filesChangeLog: 'Created: x',
      } as unknown as Record<string, unknown>;
      expect(planSchema.safeParse(invalidPlanWithTaskFields).success).toBe(false);
    });

    it('task schema: requires implementationLogSteps, initialSituation, filesChangeLog; allows promptsLlmReuse and optional implementationPlan', () => {
      const taskSchema = getImplementationGuidanceTaskSchema();

      const validTask = {
        implementationLogSteps: ['[x] Create file', '[ ] Add tests'],
        initialSituation: 'No system exists',
        filesChangeLog: 'Created: a.ts',
        promptsLlmReuse: [{ description: 'Refactor', code: 'apply refactor' }],
        implementationPlan: ['Optional high-level steps'],
      };
      expect(taskSchema.safeParse(validTask).success).toBe(true);

      // Missing a required task field
      const invalidTaskMissing = {
        implementationLogSteps: ['[x] step'],
        initialSituation: 'state',
        // filesChangeLog missing
      } as unknown as Record<string, unknown>;
      expect(taskSchema.safeParse(invalidTaskMissing).success).toBe(false);

      // Unknown keys should fail (strict)
      const invalidTaskUnknown = {
        implementationLogSteps: ['[x] step'],
        initialSituation: 'state',
        filesChangeLog: 'Created: x',
        unknownKey: true,
      } as unknown as Record<string, unknown>;
      expect(taskSchema.safeParse(invalidTaskUnknown).success).toBe(false);
    });
  });
});
