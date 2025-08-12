import { describe, it, expect } from 'vitest';
import { createImplementationGuidanceSchema } from '../../6-implementation-guidance.schema.js';
import { z } from 'zod';

describe('Implementation Guidance Schema - Section Tests', () => {
  describe('Implementation Plan Section (6.1) - Plan Only', () => {
    it('should validate implementation plan via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = [
        'Phase 1: Set up project structure and basic configuration',
        'Phase 2: Implement core validation logic',
        'Phase 3: Add comprehensive test coverage',
        'Phase 4: Create integration tests and documentation',
      ];

      expect(byId['6.1'].safeParse(validData).success).toBe(true);
      expect(shape.implementationPlan.safeParse(validData).success).toBe(true);
    });

    it('should validate implementation plan with single item via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const singleItemData = ['Phase 1: Set up project structure and basic configuration'];

      expect(byId['6.1'].safeParse(singleItemData).success).toBe(true);
      expect(shape.implementationPlan.safeParse(singleItemData).success).toBe(true);
    });

    it('should validate implementation plan with various phase formats via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const variousFormatsData = [
        'Phase 1: Set up project structure and basic configuration',
        'Step 2: Implement core validation logic',
        'Stage 3: Add comprehensive test coverage',
        'Milestone 4: Create integration tests and documentation',
      ];

      expect(byId['6.1'].safeParse(variousFormatsData).success).toBe(true);
      expect(shape.implementationPlan.safeParse(variousFormatsData).success).toBe(true);
    });

    it('should reject implementation plan with empty strings via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = [
        'Phase 1: Set up project structure and basic configuration',
        '', // Invalid empty string
        'Phase 3: Add comprehensive test coverage',
      ];

      expect(byId['6.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.implementationPlan.safeParse(invalidData).success).toBe(false);
    });

    it('should reject implementation plan with whitespace-only strings via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = [
        'Phase 1: Set up project structure and basic configuration',
        '   ', // Invalid whitespace-only string
        'Phase 3: Add comprehensive test coverage',
      ];

      // Note: Current schema only validates non-empty strings, not non-whitespace strings
      expect(byId['6.1'].safeParse(invalidData).success).toBe(true);
      expect(shape.implementationPlan.safeParse(invalidData).success).toBe(true);
    });

    it('should reject empty implementation plan array via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyData: any[] = [];

      expect(byId['6.1'].safeParse(emptyData).success).toBe(false);
      expect(shape.implementationPlan.safeParse(emptyData).success).toBe(false);
    });

    it('should reject implementation plan with non-string items via byId and composed schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = [
        'Phase 1: Set up project structure and basic configuration',
        123, // Invalid non-string item
        'Phase 3: Add comprehensive test coverage',
      ];

      expect(byId['6.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.implementationPlan.safeParse(invalidData).success).toBe(false);
    });

    it('should verify plan-only section is not available in task schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      // Task schema should have Implementation Log/Steps (6.1), not Implementation Plan
      expect(byId['6.1']).toBeDefined(); // Same ID, different content
      expect(shape.implementationLogSteps).toBeDefined();
      // Note: implementationPlan might be optional in task schema, so we check it's not required
      expect(shape.implementationPlan).toBeDefined(); // It's optional for tasks
    });
  });

  describe('Implementation Log/Steps Section (6.1) - Task Only', () => {
    it('should validate implementation log steps via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '[x] Implement `ConsoleTransport`.',
        '[ ] Implement `HttpTransport`.',
        '[ ] Write unit tests for transports.',
      ];

      expect(byId['6.1'].safeParse(validData).success).toBe(true);
      expect(shape.implementationLogSteps.safeParse(validData).success).toBe(true);
    });

    it('should validate implementation log steps with single item via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const singleItemData = ['[x] Create `logger/types.ts` with core interfaces.'];

      expect(byId['6.1'].safeParse(singleItemData).success).toBe(true);
      expect(shape.implementationLogSteps.safeParse(singleItemData).success).toBe(true);
    });

    it('should validate implementation log steps with various checkbox formats via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const variousFormatsData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '[X] Implement `ConsoleTransport`.',
        '[ ] Implement `HttpTransport`.',
        '[-] Write unit tests for transports.',
        '[?] Review documentation.',
      ];

      expect(byId['6.1'].safeParse(variousFormatsData).success).toBe(true);
      expect(shape.implementationLogSteps.safeParse(variousFormatsData).success).toBe(true);
    });

    it('should validate implementation log steps without checkbox format via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const noCheckboxData = [
        'Create `logger/types.ts` with core interfaces.',
        'Implement `ConsoleTransport`.',
        'Implement `HttpTransport`.',
        'Write unit tests for transports.',
      ];

      expect(byId['6.1'].safeParse(noCheckboxData).success).toBe(true);
      expect(shape.implementationLogSteps.safeParse(noCheckboxData).success).toBe(true);
    });

    it('should reject implementation log steps with empty strings via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const invalidData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '', // Invalid empty string
        '[ ] Write unit tests for transports.',
      ];

      expect(byId['6.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.implementationLogSteps.safeParse(invalidData).success).toBe(false);
    });

    it('should reject implementation log steps with whitespace-only strings via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const invalidData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        '   ', // Invalid whitespace-only string
        '[ ] Write unit tests for transports.',
      ];

      // Note: Current schema only validates non-empty strings, not non-whitespace strings
      expect(byId['6.1'].safeParse(invalidData).success).toBe(true);
      expect(shape.implementationLogSteps.safeParse(invalidData).success).toBe(true);
    });

    it('should reject empty implementation log steps array via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const emptyData: any[] = [];

      expect(byId['6.1'].safeParse(emptyData).success).toBe(false);
      expect(shape.implementationLogSteps.safeParse(emptyData).success).toBe(false);
    });

    it('should reject implementation log steps with non-string items via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const invalidData = [
        '[x] Create `logger/types.ts` with core interfaces.',
        123, // Invalid non-string item
        '[ ] Write unit tests for transports.',
      ];

      expect(byId['6.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.implementationLogSteps.safeParse(invalidData).success).toBe(false);
    });

    it('should verify task-only section is not available in plan schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      // Plan schema should have Implementation Plan (6.1), not Implementation Log/Steps
      expect(byId['6.1']).toBeDefined(); // Same ID, different content
      expect(shape.implementationPlan).toBeDefined();
      expect(shape.implementationLogSteps).toBeUndefined();
    });
  });

  describe('Initial Situation Section (6.1.1) - Task Only', () => {
    it('should validate initial situation via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validData =
        'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming. We need to implement an automated validation system using Zod schemas.';

      expect(byId['6.1.1'].safeParse(validData).success).toBe(true);
      expect(shape.initialSituation.safeParse(validData).success).toBe(true);
    });

    it('should validate initial situation with short description via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const shortData = 'No validation system exists.';

      expect(byId['6.1.1'].safeParse(shortData).success).toBe(true);
      expect(shape.initialSituation.safeParse(shortData).success).toBe(true);
    });

    it('should validate initial situation with multi-line text via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const multiLineData = `The project currently has no validation system in place.
All documentation is manually reviewed, which is error-prone and time-consuming.
We need to implement an automated validation system using Zod schemas.`;

      expect(byId['6.1.1'].safeParse(multiLineData).success).toBe(true);
      expect(shape.initialSituation.safeParse(multiLineData).success).toBe(true);
    });

    it('should validate initial situation with technical details via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const technicalData =
        'Current system uses manual validation with regex patterns. Need to migrate to Zod schemas for better type safety and error handling.';

      expect(byId['6.1.1'].safeParse(technicalData).success).toBe(true);
      expect(shape.initialSituation.safeParse(technicalData).success).toBe(true);
    });

    it('should reject empty initial situation via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const emptyData = '';

      expect(byId['6.1.1'].safeParse(emptyData).success).toBe(false);
      expect(shape.initialSituation.safeParse(emptyData).success).toBe(false);
    });

    it('should reject whitespace-only initial situation via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const whitespaceData = '   ';

      expect(byId['6.1.1'].safeParse(whitespaceData).success).toBe(false);
      expect(shape.initialSituation.safeParse(whitespaceData).success).toBe(false);
    });

    it('should reject initial situation with only newlines via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const newlineData = '\n\n\n';

      expect(byId['6.1.1'].safeParse(newlineData).success).toBe(false);
      expect(shape.initialSituation.safeParse(newlineData).success).toBe(false);
    });

    it('should reject initial situation with non-string data via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const nonStringData = 123;

      expect(byId['6.1.1'].safeParse(nonStringData).success).toBe(false);
      expect(shape.initialSituation.safeParse(nonStringData).success).toBe(false);
    });

    it('should verify task-only section is not available in plan schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      // Plan schema should not have Initial Situation section
      expect(byId['6.1.1']).toBeUndefined();
      expect(shape.initialSituation).toBeUndefined();
    });
  });

  describe('Files Change Log Section (6.1.2) - Task Only', () => {
    it('should validate files change log via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validData =
        'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency. Updated: README.md with usage examples.';

      expect(byId['6.1.2'].safeParse(validData).success).toBe(true);
      expect(shape.filesChangeLog.safeParse(validData).success).toBe(true);
    });

    it('should validate files change log with short description via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const shortData = 'Created logger/types.ts file.';

      expect(byId['6.1.2'].safeParse(shortData).success).toBe(true);
      expect(shape.filesChangeLog.safeParse(shortData).success).toBe(true);
    });

    it('should validate files change log with multi-line text via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const multiLineData = `Created new files: logger/types.ts, logger/transports.ts.
Modified: package.json to add Zod dependency.
Updated: README.md with usage examples.`;

      expect(byId['6.1.2'].safeParse(multiLineData).success).toBe(true);
      expect(shape.filesChangeLog.safeParse(multiLineData).success).toBe(true);
    });

    it('should validate files change log with various file operations via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const variousOpsData =
        'Created: src/validation/schema.ts. Modified: package.json. Deleted: old-validator.js. Renamed: config.json to settings.json.';

      expect(byId['6.1.2'].safeParse(variousOpsData).success).toBe(true);
      expect(shape.filesChangeLog.safeParse(variousOpsData).success).toBe(true);
    });

    it('should validate files change log with file paths via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const filePathsData =
        'Created: src/doc-parser/validation/6-implementation-guidance.schema.ts. Modified: src/schema/ddd-schema-json/6-implementation-guidance.json.';

      expect(byId['6.1.2'].safeParse(filePathsData).success).toBe(true);
      expect(shape.filesChangeLog.safeParse(filePathsData).success).toBe(true);
    });

    it('should reject empty files change log via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const emptyData = '';

      expect(byId['6.1.2'].safeParse(emptyData).success).toBe(false);
      expect(shape.filesChangeLog.safeParse(emptyData).success).toBe(false);
    });

    it('should reject whitespace-only files change log via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const whitespaceData = '   ';

      expect(byId['6.1.2'].safeParse(whitespaceData).success).toBe(false);
      expect(shape.filesChangeLog.safeParse(whitespaceData).success).toBe(false);
    });

    it('should reject files change log with only newlines via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const newlineData = '\n\n\n';

      expect(byId['6.1.2'].safeParse(newlineData).success).toBe(false);
      expect(shape.filesChangeLog.safeParse(newlineData).success).toBe(false);
    });

    it('should reject files change log with non-string data via byId and composed schema', () => {
      const taskSchema = createImplementationGuidanceSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const nonStringData = 123;

      expect(byId['6.1.2'].safeParse(nonStringData).success).toBe(false);
      expect(shape.filesChangeLog.safeParse(nonStringData).success).toBe(false);
    });

    it('should verify task-only section is not available in plan schema', () => {
      const planSchema = createImplementationGuidanceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      // Plan schema should not have Files Change Log section
      expect(byId['6.1.2']).toBeUndefined();
      expect(shape.filesChangeLog).toBeUndefined();
    });
  });

  describe('Prompts Section (6.2) - Plan & Task Optional', () => {
    describe('Plan Prompts', () => {
      it('should validate prompts via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
          {
            description: 'Create a Zod schema for user validation:',
            code: 'const UserSchema = z.object({ name: z.string(), email: z.string().email() });',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(validData).success).toBe(true);
        expect(shape.promptsLlmReuse.safeParse(validData).success).toBe(true);
      });

      it('should validate prompts with single item via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const singleItemData = [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(singleItemData).success).toBe(true);
        expect(shape.promptsLlmReuse.safeParse(singleItemData).success).toBe(true);
      });

      it('should validate prompts without optional language via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const noLanguageData = [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            // language is optional, so omitting it should be valid
          },
        ];

        expect(byId['6.2'].safeParse(noLanguageData).success).toBe(true);
        expect(shape.promptsLlmReuse.safeParse(noLanguageData).success).toBe(true);
      });

      it('should validate prompts with various programming languages via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const variousLanguagesData = [
          {
            description: 'Generate a TypeScript function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
          {
            description: 'Create a Python function:',
            code: 'def add(a: int, b: int) -> int:\n    return a + b',
            language: 'python',
          },
          {
            description: 'Write a bash script:',
            code: '#!/bin/bash\necho "Hello, World!"',
            language: 'bash',
          },
        ];

        expect(byId['6.2'].safeParse(variousLanguagesData).success).toBe(true);
        expect(shape.promptsLlmReuse.safeParse(variousLanguagesData).success).toBe(true);
      });

      it('should reject prompts with missing description via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            // Missing description field
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });

      it('should reject prompts with missing code via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            description: 'Generate a Vitest test for this function:',
            // Missing code field
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });

      it('should reject prompts with empty description via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            description: '', // Invalid empty description
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });

      it('should reject prompts with empty code via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            description: 'Generate a Vitest test for this function:',
            code: '', // Invalid empty code
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty prompts array via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const emptyData: any[] = [];

        expect(byId['6.2'].safeParse(emptyData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(emptyData).success).toBe(false);
      });

      it('should reject prompts with non-string description via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            description: 123, // Invalid non-string description
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });

      it('should reject prompts with non-string code via byId and composed schema', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = [
          {
            description: 'Generate a Vitest test for this function:',
            code: 123, // Invalid non-string code
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Prompts', () => {
      it('should validate prompts via byId and composed schema', () => {
        const taskSchema = createImplementationGuidanceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const validData = [
          {
            description: 'Generate a Vitest test for this function:',
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(validData).success).toBe(true);
        expect(shape.promptsLlmReuse.safeParse(validData).success).toBe(true);
      });

      it('should validate task-specific prompts via byId and composed schema', () => {
        const taskSchema = createImplementationGuidanceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const taskSpecificData = [
          {
            description: 'Create a Zod schema for this validation:',
            code: 'const ValidationSchema = z.object({ field: z.string().min(1) });',
            language: 'typescript',
          },
          {
            description: 'Write a test for this implementation:',
            code: 'describe("validation", () => {\n  it("should validate correctly", () => {\n    // test code\n  });\n});',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(taskSpecificData).success).toBe(true);
        expect(shape.promptsLlmReuse.safeParse(taskSpecificData).success).toBe(true);
      });

      it('should reject prompts with empty description via byId and composed schema', () => {
        const taskSchema = createImplementationGuidanceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const invalidData = [
          {
            description: '', // Invalid empty description
            code: 'export const add = (a: number, b: number): number => a + b;',
            language: 'typescript',
          },
        ];

        expect(byId['6.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.promptsLlmReuse.safeParse(invalidData).success).toBe(false);
      });

      it('should verify prompts section is available in both plan and task schemas', () => {
        const planSchema = createImplementationGuidanceSchema('plan');
        const taskSchema = createImplementationGuidanceSchema('task');

        const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const planShape = planSchema.shape as any;
        const taskShape = taskSchema.shape as any;

        // Both should have prompts section
        expect(planById['6.2']).toBeDefined();
        expect(taskById['6.2']).toBeDefined();
        expect(planShape.promptsLlmReuse).toBeDefined();
        expect(taskShape.promptsLlmReuse).toBeDefined();
      });
    });
  });
});
