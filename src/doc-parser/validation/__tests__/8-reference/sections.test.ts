import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createReferenceSchema } from '../../8-reference.schema.js';

describe('Reference Schema - Section Tests', () => {
  describe('Appendices/Glossary Section (8.1) - Plan and Task', () => {
    describe('Plan Document Type', () => {
      it('should validate appendices glossary with glossary only via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
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
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate appendices glossary with appendices only via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
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
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate appendices glossary with both glossary and appendices via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
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
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should reject appendices glossary with empty glossary via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices glossary with empty appendices via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices glossary with empty glossary and appendices via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [],
          appendices: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices glossary with missing glossary and appendices via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {};

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Document Type', () => {
      it('should validate appendices glossary with glossary only via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const validData = {
          glossary: [
            {
              term: 'API',
              definition: 'Application Programming Interface.',
            },
            {
              term: 'REST',
              definition: 'Representational State Transfer.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate appendices glossary with appendices only via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const validData = {
          appendices: [
            {
              title: 'Implementation Guide',
              content: 'Step-by-step implementation instructions.',
            },
            {
              title: 'Testing Procedures',
              content: 'Comprehensive testing procedures and guidelines.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate appendices glossary with both glossary and appendices via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const validData = {
          glossary: [
            {
              term: 'API',
              definition: 'Application Programming Interface.',
            },
          ],
          appendices: [
            {
              title: 'Implementation Guide',
              content: 'Step-by-step implementation instructions.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should reject appendices glossary with empty glossary via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const invalidData = {
          glossary: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices glossary with empty appendices via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const invalidData = {
          appendices: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices glossary with empty glossary and appendices via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const invalidData = {
          glossary: [],
          appendices: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices glossary with missing glossary and appendices via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const invalidData = {};

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });
  });
});

