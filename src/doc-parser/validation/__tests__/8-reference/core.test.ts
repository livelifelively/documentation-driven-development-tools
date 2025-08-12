import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createReferenceSchema, getReferencePlanSchema, getReferenceTaskSchema } from '../../8-reference.schema.js';

describe('Reference Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createReferenceSchema', () => {
      it('should create plan schema with byId registration', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(Object.keys(byId)).toContain('8.1'); // Appendices/Glossary
        expect(Object.keys(byId)).toHaveLength(1); // Only one section in this family
      });

      it('should create task schema with byId registration', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(Object.keys(byId)).toContain('8.1'); // Appendices/Glossary
        expect(Object.keys(byId)).toHaveLength(1); // Only one section in this family
      });

      it('should validate complete plan document with glossary', () => {
        const planSchema = createReferenceSchema('plan');
        const validPlan = {
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
          },
        };

        const result = planSchema.safeParse(validPlan);
        expect(result.success).toBe(true);
      });

      it('should validate complete plan document with appendices', () => {
        const planSchema = createReferenceSchema('plan');
        const validPlan = {
          appendicesGlossary: {
            appendices: [
              {
                title: 'API Reference',
                content: 'Detailed API documentation for external integrations.',
              },
              {
                title: 'Database Schema',
                content: 'Complete database schema documentation.',
              },
            ],
          },
        };

        const result = planSchema.safeParse(validPlan);
        expect(result.success).toBe(true);
      });

      it('should validate complete plan document with both glossary and appendices', () => {
        const planSchema = createReferenceSchema('plan');
        const validPlan = {
          appendicesGlossary: {
            glossary: [
              {
                term: 'PII',
                definition: 'Personally Identifiable Information.',
              },
            ],
            appendices: [
              {
                title: 'API Reference',
                content: 'Detailed API documentation.',
              },
            ],
          },
        };

        const result = planSchema.safeParse(validPlan);
        expect(result.success).toBe(true);
      });

      it('should validate empty plan document (optional section)', () => {
        const planSchema = createReferenceSchema('plan');
        const emptyPlan = {};

        const result = planSchema.safeParse(emptyPlan);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document with glossary', () => {
        const taskSchema = createReferenceSchema('task');
        const validTask = {
          appendicesGlossary: {
            glossary: [
              {
                term: 'API',
                definition: 'Application Programming Interface.',
              },
            ],
          },
        };

        const result = taskSchema.safeParse(validTask);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document with appendices', () => {
        const taskSchema = createReferenceSchema('task');
        const validTask = {
          appendicesGlossary: {
            appendices: [
              {
                title: 'Implementation Guide',
                content: 'Step-by-step implementation instructions.',
              },
            ],
          },
        };

        const result = taskSchema.safeParse(validTask);
        expect(result.success).toBe(true);
      });

      it('should validate empty task document (optional section)', () => {
        const taskSchema = createReferenceSchema('task');
        const emptyTask = {};

        const result = taskSchema.safeParse(emptyTask);
        expect(result.success).toBe(true);
      });
    });

    describe('Convenience Functions', () => {
      it('should create plan schema via convenience function', () => {
        const planSchema = getReferencePlanSchema();
        expect(planSchema).toBeDefined();
        expect(Object.keys((planSchema as any).__byId)).toContain('8.1');
      });

      it('should create task schema via convenience function', () => {
        const taskSchema = getReferenceTaskSchema();
        expect(taskSchema).toBeDefined();
        expect(Object.keys((taskSchema as any).__byId)).toContain('8.1');
      });
    });
  });

  describe('byId Index Verification', () => {
    it('should allow independent section validation via byId', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const validGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = byId['8.1'].safeParse(validGlossary);
      expect(result.success).toBe(true);
    });

    it('should reject invalid data via byId', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidGlossary = {
        glossary: [
          {
            term: '', // Empty string not allowed
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = byId['8.1'].safeParse(invalidGlossary);
      expect(result.success).toBe(false);
    });

    it('should reject empty glossary and appendices via byId', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidData = {
        glossary: [],
        appendices: [],
      };

      const result = byId['8.1'].safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

