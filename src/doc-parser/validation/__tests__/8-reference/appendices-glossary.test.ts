import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createReferenceSchema } from '../../8-reference.schema.js';

describe('Reference Schema - Appendices/Glossary Section Tests (8.1)', () => {
  describe('Glossary Validation Tests', () => {
    describe('Valid Glossary Entries', () => {
      it('should validate single glossary entry via byId and composed schema', () => {
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
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate multiple glossary entries via byId and composed schema', () => {
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

      it('should validate glossary with complex terms and definitions via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
          glossary: [
            {
              term: 'Domain-Driven Design (DDD)',
              definition:
                'A software development approach that connects the implementation to an evolving model of the core business concepts.',
            },
            {
              term: 'Bounded Context',
              definition: 'A boundary within which a particular model is defined and applicable.',
            },
            {
              term: 'Ubiquitous Language',
              definition:
                'A language structured around the domain model and used by all team members to connect all the activities of the team with the software.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });
    });

    describe('Invalid Glossary Entries', () => {
      it('should reject glossary with missing term via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              definition: 'Personally Identifiable Information.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with missing definition via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 'PII',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with empty term via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: '',
              definition: 'Personally Identifiable Information.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with empty definition via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 'PII',
              definition: '',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with whitespace-only term via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: '   ',
              definition: 'Personally Identifiable Information.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with whitespace-only definition via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 'PII',
              definition: '   ',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with invalid term type via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 123,
              definition: 'Personally Identifiable Information.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with invalid definition type via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 'PII',
              definition: 456,
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Mixed Valid/Invalid Glossary Entries', () => {
      it('should reject glossary with mixed valid and invalid entries via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 'PII',
              definition: 'Personally Identifiable Information.',
            },
            {
              term: '', // Invalid: empty term
              definition: 'Single Sign-On.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject glossary with some missing fields via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [
            {
              term: 'PII',
              definition: 'Personally Identifiable Information.',
            },
            {
              term: 'SSO',
              // Missing definition
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Empty Glossary Array Validation', () => {
      it('should reject empty glossary array via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          glossary: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Appendices Validation Tests', () => {
    describe('Valid Appendix Entries', () => {
      it('should validate single appendix entry via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate multiple appendix entries via byId and composed schema', () => {
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
            {
              title: 'Deployment Guide',
              content: 'Step-by-step deployment instructions.',
            },
            {
              title: 'Troubleshooting Guide',
              content: 'Common issues and their solutions.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate appendices with complex titles and content via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
          appendices: [
            {
              title: 'Domain Model Documentation',
              content:
                'Comprehensive documentation of the domain model including entities, value objects, aggregates, and domain services.',
            },
            {
              title: 'Integration Patterns & Best Practices',
              content:
                'Documentation of integration patterns used in the system, including event-driven architecture, CQRS, and saga patterns.',
            },
            {
              title: 'Performance Optimization Guidelines',
              content:
                'Guidelines for optimizing system performance including caching strategies, database optimization, and monitoring approaches.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });
    });

    describe('Invalid Appendix Entries', () => {
      it('should reject appendices with missing title via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with missing content via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 'API Reference',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with empty title via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: '',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with empty content via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 'API Reference',
              content: '',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with whitespace-only title via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: '   ',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with whitespace-only content via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 'API Reference',
              content: '   ',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with invalid title type via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 123,
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with invalid content type via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 'API Reference',
              content: 456,
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Mixed Valid/Invalid Appendix Entries', () => {
      it('should reject appendices with mixed valid and invalid entries via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
            {
              title: '', // Invalid: empty title
              content: 'Database schema documentation.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });

      it('should reject appendices with some missing fields via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
            {
              title: 'Database Schema',
              // Missing content
            },
          ],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Empty Appendices Array Validation', () => {
      it('should reject empty appendices array via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const invalidData = {
          appendices: [],
        };

        expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
        expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Combined Validation Tests', () => {
    it('should validate both glossary and appendices present via byId and composed schema', () => {
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

    it('should validate only glossary present via byId and composed schema', () => {
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
      };

      expect(byId['8.1'].safeParse(validData).success).toBe(true);
      expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
    });

    it('should validate only appendices present via byId and composed schema', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validData = {
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      expect(byId['8.1'].safeParse(validData).success).toBe(true);
      expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
    });

    it('should reject neither glossary nor appendices present via byId and composed schema', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = {};

      expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty glossary and appendices arrays via byId and composed schema', () => {
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

    it('should reject empty glossary with valid appendices via byId and composed schema', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = {
        glossary: [],
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
    });

    it('should reject valid glossary with empty appendices via byId and composed schema', () => {
      const planSchema = createReferenceSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidData = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
        appendices: [],
      };

      expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.appendicesGlossary.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Document Type Applicability Tests', () => {
    describe('Plan Document Type', () => {
      it('should validate plan document with glossary via byId and composed schema', () => {
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
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate plan document with appendices via byId and composed schema', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = planSchema.shape as any;

        const validData = {
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate plan document with both glossary and appendices via byId and composed schema', () => {
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
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });
    });

    describe('Task Document Type', () => {
      it('should validate task document with glossary via byId and composed schema', () => {
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
        };

        expect(byId['8.1'].safeParse(validData).success).toBe(true);
        expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
      });

      it('should validate task document with appendices via byId and composed schema', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
        const shape = taskSchema.shape as any;

        const validData = {
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

      it('should validate task document with both glossary and appendices via byId and composed schema', () => {
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
    });

    describe('Optional Field Handling', () => {
      it('should handle optional section for plan document type', () => {
        const planSchema = createReferenceSchema('plan');
        const shape = planSchema.shape as any;

        // Plan document without appendices/glossary should be valid (optional section)
        const emptyPlan = {};
        expect(planSchema.safeParse(emptyPlan).success).toBe(true);
      });

      it('should handle optional section for task document type', () => {
        const taskSchema = createReferenceSchema('task');
        const shape = taskSchema.shape as any;

        // Task document without appendices/glossary should be valid (optional section)
        const emptyTask = {};
        expect(taskSchema.safeParse(emptyTask).success).toBe(true);
      });

      it('should handle undefined appendices/glossary for plan document type', () => {
        const planSchema = createReferenceSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Optional section should accept undefined
        expect(byId['8.1'].safeParse(undefined).success).toBe(true);
      });

      it('should handle undefined appendices/glossary for task document type', () => {
        const taskSchema = createReferenceSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        // Optional section should accept undefined
        expect(byId['8.1'].safeParse(undefined).success).toBe(true);
      });
    });
  });
});

