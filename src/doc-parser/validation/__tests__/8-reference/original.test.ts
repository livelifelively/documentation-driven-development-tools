import { describe, it, expect } from 'vitest';
import { createReferenceSchema, getReferencePlanSchema, getReferenceTaskSchema } from '../../8-reference.schema.js';

describe('Reference Schema Validation', () => {
  describe('Appendices/Glossary Schema', () => {
    it('should validate a complete appendices/glossary section', () => {
      const validAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
          {
            term: 'SSO',
            definition: 'Single Sign-On.',
          },
        ],
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation for external integrations.',
          },
          {
            title: 'Configuration Guide',
            content: 'Step-by-step configuration instructions.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(validAppendicesGlossary);
      expect(result.success).toBe(true);
    });

    it('should validate appendices/glossary with only glossary', () => {
      const validAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(validAppendicesGlossary);
      expect(result.success).toBe(true);
    });

    it('should validate appendices/glossary with only appendices', () => {
      const validAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(validAppendicesGlossary);
      expect(result.success).toBe(true);
    });

    it('should reject appendices/glossary with empty glossary term', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: '',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('term');
      }
    });

    it('should reject appendices/glossary with empty glossary definition', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: '',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('definition');
      }
    });

    it('should reject appendices/glossary with missing glossary term', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('term');
      }
    });

    it('should reject appendices/glossary with missing glossary definition', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('definition');
      }
    });

    it('should reject appendices/glossary with empty appendix title', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: '',
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject appendices/glossary with empty appendix content', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
            content: '',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });

    it('should reject appendices/glossary with missing appendix title', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject appendices/glossary with missing appendix content', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });

    it('should reject appendices/glossary with non-string glossary term', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 123,
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('term');
      }
    });

    it('should reject appendices/glossary with non-string glossary definition', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: null,
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('definition');
      }
    });

    it('should reject appendices/glossary with non-string appendix title', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 456,
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject appendices/glossary with non-string appendix content', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
            content: undefined,
          },
        ],
      };

      const shape = createReferenceSchema('plan').shape as any;
      const result = shape.appendicesGlossary.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });
  });

  describe('Reference Schema (Main Schema)', () => {
    it('should validate a complete reference object', () => {
      const validReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: 'PII',
              definition: 'Personally Identifiable Information.',
            },
            {
              term: 'SSO',
              definition: 'Single Sign-On.',
            },
          ],
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
            {
              title: 'Configuration Guide',
              content: 'Step-by-step configuration instructions.',
            },
          ],
        },
      };

      const family = createReferenceSchema('plan');
      const result = family.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should validate reference with only glossary', () => {
      const validReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: 'PII',
              definition: 'Personally Identifiable Information.',
            },
          ],
        },
      };

      const family = createReferenceSchema('plan');
      const result = family.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should validate reference with only appendices', () => {
      const validReference = {
        appendicesGlossary: {
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        },
      };

      const family = createReferenceSchema('plan');
      const result = family.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should validate empty reference object', () => {
      const validReference = {};

      const family = createReferenceSchema('plan');
      const result = family.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should reject reference with invalid appendices/glossary', () => {
      const invalidReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: '',
              definition: 'Personally Identifiable Information.',
            },
          ],
        },
      };

      const family = createReferenceSchema('plan');
      const result = family.safeParse(invalidReference);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('appendicesGlossary');
      }
    });

    it('should reject reference with invalid glossary term', () => {
      const invalidReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: 123,
              definition: 'Personally Identifiable Information.',
            },
          ],
        },
      };

      const family = createReferenceSchema('plan');
      const result = family.safeParse(invalidReference);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('appendicesGlossary');
      }
    });

    it('should reject reference with invalid appendix title', () => {
      const invalidReference = {
        appendicesGlossary: {
          appendices: [
            {
              title: '',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        },
      };

      const family = createReferenceSchema('plan');
      const result = family.safeParse(invalidReference);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('appendicesGlossary');
      }
    });
  });

  describe('Family factory (docType-specific schemas)', () => {
    it('plan schema: optional appendicesGlossary accepted; strict object', () => {
      const planSchema = getReferencePlanSchema();

      const validPlan = {
        appendicesGlossary: {
          glossary: [{ term: 'PII', definition: 'Personally Identifiable Information.' }],
        },
      };
      expect(planSchema.safeParse(validPlan).success).toBe(true);

      const emptyPlan = {};
      expect(planSchema.safeParse(emptyPlan).success).toBe(true);

      const invalidPlanUnknown = { unknown: true } as unknown as Record<string, unknown>;
      expect(planSchema.safeParse(invalidPlanUnknown).success).toBe(false);
    });

    it('task schema: optional appendicesGlossary accepted; strict object', () => {
      const taskSchema = getReferenceTaskSchema();

      const validTask = {
        appendicesGlossary: {
          appendices: [{ title: 'API Reference', content: 'Docs' }],
        },
      };
      expect(taskSchema.safeParse(validTask).success).toBe(true);

      const emptyTask = {};
      expect(taskSchema.safeParse(emptyTask).success).toBe(true);

      const invalidTaskUnknown = { unknown: true } as unknown as Record<string, unknown>;
      expect(taskSchema.safeParse(invalidTaskUnknown).success).toBe(false);
    });

    it('should register byId index for independent section validation', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, any>;

      expect(byId).toBeDefined();
      expect(Object.keys(byId)).toContain('8.1');
      expect(byId['8.1']).toBeDefined();

      // Test independent validation via byId
      const validGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      expect(byId['8.1'].safeParse(validGlossary).success).toBe(true);
    });

    it('should register byId index for both plan and task schemas', () => {
      const planSchema = createReferenceSchema('plan');
      const taskSchema = createReferenceSchema('task');

      const planById = (planSchema as any).__byId as Record<string, any>;
      const taskById = (taskSchema as any).__byId as Record<string, any>;

      // Both should have byId registration
      expect(planById).toBeDefined();
      expect(taskById).toBeDefined();

      // Both should have section 8.1
      expect(Object.keys(planById)).toContain('8.1');
      expect(Object.keys(taskById)).toContain('8.1');

      // Both should have the same sections (only one section in this family)
      expect(Object.keys(planById)).toEqual(Object.keys(taskById));
      expect(Object.keys(planById)).toHaveLength(1);

      // Test independent validation for both
      const validAppendices = {
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation.',
          },
        ],
      };

      expect(planById['8.1'].safeParse(validAppendices).success).toBe(true);
      expect(taskById['8.1'].safeParse(validAppendices).success).toBe(true);
    });

    it('should register schemas with correct types', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, any>;

      // Section 8.1 should be a ZodOptional (since it's marked as optional in JSON)
      expect(byId['8.1']).toBeDefined();
      expect(byId['8.1'].constructor.name).toBe('ZodOptional');

      // The underlying schema should be a ZodObject
      const underlyingSchema = (byId['8.1'] as any)._def.innerType;
      expect(underlyingSchema.constructor.name).toBe('ZodObject');

      // The schema should have the expected shape
      const shape = underlyingSchema.shape;
      expect(shape).toBeDefined();
      expect(shape.glossary).toBeDefined();
      expect(shape.appendices).toBeDefined();
    });
  });
});
