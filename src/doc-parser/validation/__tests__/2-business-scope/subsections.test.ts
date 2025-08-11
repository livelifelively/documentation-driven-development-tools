import { describe, it, expect } from 'vitest';
import { createBusinessScopeSchema } from '../../2-business-scope.schema.js';
import { z } from 'zod';

describe('Business & Scope Schema - Subsection Tests', () => {
  describe('User Journeys Section (2.2.1) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const userJourneysSchema = (createBusinessScopeSchema('plan').shape as any).userJourneys;

    it('should validate user journeys via byId and composed schema', () => {
      const validData = [
        {
          name: 'Analyst Processes a New Document',
          description:
            'This journey describes the end-to-end path for a data analyst supervising the processing of a single document from selection to completion.',
          diagram:
            'graph TD\n    A[Start] --> B[Select Document]\n    B --> C[Validate Content]\n    C --> D[Process Data]\n    D --> E[Generate Report]\n    E --> F[End]',
        },
        {
          name: 'System Administrator Monitors Pipeline',
          description:
            'This journey describes how system administrators monitor and maintain the document processing pipeline.',
          diagram:
            'sequenceDiagram\n    participant Admin\n    participant System\n    participant Dashboard\n    Admin->>System: Check Status\n    System->>Dashboard: Get Metrics\n    Dashboard->>Admin: Display Results',
        },
      ];
      expect(byId['2.2.1'].safeParse(validData).success).toBe(true);
      expect(userJourneysSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject user journey with missing name via byId and composed schema', () => {
      const invalidData = [
        {
          description: 'Valid description',
          diagram: 'graph TD; A-->B;',
        },
      ];
      expect(byId['2.2.1'].safeParse(invalidData).success).toBe(false);
      expect(userJourneysSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject user journey with missing description via byId and composed schema', () => {
      const invalidData = [
        {
          name: 'Valid Name',
          diagram: 'graph TD; A-->B;',
        },
      ];
      expect(byId['2.2.1'].safeParse(invalidData).success).toBe(false);
      expect(userJourneysSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject user journey with missing diagram via byId and composed schema', () => {
      const invalidData = [
        {
          name: 'Valid Name',
          description: 'Valid description',
        },
      ];
      expect(byId['2.2.1'].safeParse(invalidData).success).toBe(false);
      expect(userJourneysSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty user journeys array via byId and composed schema', () => {
      const invalidData: any[] = [];
      expect(byId['2.2.1'].safeParse(invalidData).success).toBe(false);
      expect(userJourneysSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('User Personas Section (2.2.2) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const userPersonasSchema = (createBusinessScopeSchema('plan').shape as any).userPersonas;

    it('should validate user personas via byId and composed schema', () => {
      const validData = [
        {
          persona: 'Data Analyst',
          goal: 'Process documents efficiently and accurately with minimal manual intervention',
        },
        {
          persona: 'System Administrator',
          goal: 'Monitor system health and ensure optimal performance of the document processing pipeline',
        },
        {
          persona: 'Business Stakeholder',
          goal: 'Receive timely and accurate reports on document processing outcomes',
        },
      ];
      expect(byId['2.2.2'].safeParse(validData).success).toBe(true);
      expect(userPersonasSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject user persona with missing persona field via byId and composed schema', () => {
      const invalidData = [
        {
          goal: 'Valid goal',
        },
      ];
      expect(byId['2.2.2'].safeParse(invalidData).success).toBe(false);
      expect(userPersonasSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject user persona with missing goal field via byId and composed schema', () => {
      const invalidData = [
        {
          persona: 'Valid Persona',
        },
      ];
      expect(byId['2.2.2'].safeParse(invalidData).success).toBe(false);
      expect(userPersonasSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty user personas array via byId and composed schema', () => {
      const invalidData: any[] = [];
      expect(byId['2.2.2'].safeParse(invalidData).success).toBe(false);
      expect(userPersonasSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Core Business Rules Section (2.2.3) - Plan and Task', () => {
    describe('Plan Core Business Rules', () => {
      const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const coreBusinessRulesSchema = (createBusinessScopeSchema('plan').shape as any).coreBusinessRules;

      it('should validate core business rules via byId and composed schema', () => {
        const validData = [
          'All documents must be validated before processing',
          'Processing errors must be logged with sufficient detail for debugging',
          'System performance must be monitored and reported in real-time',
          'Data integrity must be maintained throughout the processing pipeline',
        ];
        expect(byId['2.2.3'].safeParse(validData).success).toBe(true);
        expect(coreBusinessRulesSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty core business rules array via byId and composed schema', () => {
        const invalidData: string[] = [];
        expect(byId['2.2.3'].safeParse(invalidData).success).toBe(false);
        expect(coreBusinessRulesSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject core business rules with empty strings via byId and composed schema', () => {
        const invalidData = ['Valid rule', '', 'Another valid rule'];
        expect(byId['2.2.3'].safeParse(invalidData).success).toBe(false);
        expect(coreBusinessRulesSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Core Business Rules', () => {
      const byId = (createBusinessScopeSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const coreBusinessRulesSchema = (createBusinessScopeSchema('task').shape as any).coreBusinessRules;

      it('should validate core business rules via byId and composed schema', () => {
        const validData = [
          'All schemas must be properly validated',
          'Documentation must be updated with any schema changes',
          'Tests must be written for all new validation logic',
        ];
        expect(byId['2.2.3'].safeParse(validData).success).toBe(true);
        expect(coreBusinessRulesSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject empty core business rules array via byId and composed schema', () => {
        const invalidData: string[] = [];
        expect(byId['2.2.3'].safeParse(invalidData).success).toBe(false);
        expect(coreBusinessRulesSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('User Stories Section (2.2.4) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const userStoriesSchema = (createBusinessScopeSchema('plan').shape as any).userStories;

    it('should validate user stories via byId and composed schema', () => {
      const validData = [
        'As a data analyst, I want to process documents automatically so that I can focus on analysis rather than manual data entry',
        'As a system administrator, I want to monitor pipeline health in real-time so that I can proactively address issues before they impact users',
        'As a business stakeholder, I want to receive automated reports so that I can make informed decisions based on current data',
      ];
      expect(byId['2.2.4'].safeParse(validData).success).toBe(true);
      expect(userStoriesSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject empty user stories array via byId and composed schema', () => {
      const invalidData: string[] = [];
      expect(byId['2.2.4'].safeParse(invalidData).success).toBe(false);
      expect(userStoriesSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject user stories with empty strings via byId and composed schema', () => {
      const invalidData = ['Valid story', '', 'Another valid story'];
      expect(byId['2.2.4'].safeParse(invalidData).success).toBe(false);
      expect(userStoriesSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('In Scope Section (2.5.1) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const inScopeSchema = (createBusinessScopeSchema('plan').shape as any).inScope;

    it('should validate in scope items via byId and composed schema', () => {
      const validData = [
        'Processing of Lok Sabha Q&A documents in PDF format',
        'Manual verification and correction workflows for all pipeline steps',
        'Generation of a document-level knowledge graph',
        'Real-time monitoring and alerting system',
        'Automated report generation and distribution',
      ];
      expect(byId['2.5.1'].safeParse(validData).success).toBe(true);
      expect(inScopeSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject empty in scope array via byId and composed schema', () => {
      const invalidData: string[] = [];
      expect(byId['2.5.1'].safeParse(invalidData).success).toBe(false);
      expect(inScopeSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject in scope items with empty strings via byId and composed schema', () => {
      const invalidData = ['Valid item', '', 'Another valid item'];
      expect(byId['2.5.1'].safeParse(invalidData).success).toBe(false);
      expect(inScopeSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Out of Scope Section (2.5.2) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const outOfScopeSchema = (createBusinessScopeSchema('plan').shape as any).outOfScope;

    it('should validate out of scope items via byId and composed schema', () => {
      const validData = [
        'Real-time document processing capabilities',
        'Processing documents in formats other than PDF',
        'Advanced user management and role-based access control',
        'Mobile application development',
        'Integration with third-party analytics platforms',
      ];
      expect(byId['2.5.2'].safeParse(validData).success).toBe(true);
      expect(outOfScopeSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject empty out of scope array via byId and composed schema', () => {
      const invalidData: string[] = [];
      expect(byId['2.5.2'].safeParse(invalidData).success).toBe(false);
      expect(outOfScopeSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject out of scope items with empty strings via byId and composed schema', () => {
      const invalidData = ['Valid item', '', 'Another valid item'];
      expect(byId['2.5.2'].safeParse(invalidData).success).toBe(false);
      expect(outOfScopeSchema.safeParse(invalidData).success).toBe(false);
    });
  });
});
