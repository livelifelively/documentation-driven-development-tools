import { describe, it, expect } from 'vitest';
import { createBusinessScopeSchema } from '../../2-business-scope.schema.js';
import { z } from 'zod';

describe('Business & Scope Schema - Section Tests', () => {
  describe('Overview Section (2.1)', () => {
    describe('Plan Overview', () => {
      const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const overviewPlanSchema = (createBusinessScopeSchema('plan').shape as any).overview;

      it('should validate complete overview via byId and composed schema', () => {
        const validData = {
          coreFunction: 'Implements a robust, multi-level logging system',
          keyCapability: 'Ensures operational errors and business events are captured',
          businessValue: 'Enables proactive issue resolution and performance analysis',
        };
        expect(byId['2.1'].safeParse(validData).success).toBe(true);
        expect(overviewPlanSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject overview with missing fields via byId and composed schema', () => {
        const invalidData = {
          coreFunction: 'Test function',
          // Missing keyCapability and businessValue
        };
        expect(byId['2.1'].safeParse(invalidData).success).toBe(false);
        expect(overviewPlanSchema.safeParse(invalidData).success).toBe(false);
      });

      it('should reject overview with empty strings via byId and composed schema', () => {
        const invalidData = {
          coreFunction: '',
          keyCapability: '',
          businessValue: '',
        };
        expect(byId['2.1'].safeParse(invalidData).success).toBe(false);
        expect(overviewPlanSchema.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Overview', () => {
      const byId = (createBusinessScopeSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const overviewTaskSchema = (createBusinessScopeSchema('task').shape as any).overview;

      it('should validate complete overview via byId and composed schema', () => {
        const validData = {
          coreFunction: 'Create Zod schemas for document validation',
          keyCapability: 'Produces TypeScript files with Zod schemas',
          businessValue: 'Enables automated validation of documentation content',
        };
        expect(byId['2.1'].safeParse(validData).success).toBe(true);
        expect(overviewTaskSchema.safeParse(validData).success).toBe(true);
      });

      it('should reject overview with missing fields via byId and composed schema', () => {
        const invalidData = {
          coreFunction: 'Test function',
          // Missing keyCapability and businessValue
        };
        expect(byId['2.1'].safeParse(invalidData).success).toBe(false);
        expect(overviewTaskSchema.safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Business Context Section (2.2) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const businessContextSchema = (createBusinessScopeSchema('plan').shape as any).businessContext;

    it('should validate business context via byId and composed schema', () => {
      const validData =
        'Currently, pipeline failures are opaque, requiring developers to manually inspect logs, which slows down resolution time.';
      expect(byId['2.2'].safeParse(validData).success).toBe(true);
      expect(businessContextSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject empty business context via byId and composed schema', () => {
      const invalidData = '';
      expect(byId['2.2'].safeParse(invalidData).success).toBe(false);
      expect(businessContextSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject whitespace-only business context via byId and composed schema', () => {
      const invalidData = '   ';
      expect(byId['2.2'].safeParse(invalidData).success).toBe(false);
      expect(businessContextSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Success Criteria Section (2.3) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const successCriteriaSchema = (createBusinessScopeSchema('plan').shape as any).successCriteria;

    it('should validate success criteria via byId and composed schema', () => {
      const validData = [
        'All pipeline stages emit structured logs for success, failure, and key business events.',
        'The central dashboard can successfully ingest and display logs from all pipeline stages.',
        'A comprehensive set of alerts for critical failures is configured and tested.',
      ];
      expect(byId['2.3'].safeParse(validData).success).toBe(true);
      expect(successCriteriaSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject empty success criteria array via byId and composed schema', () => {
      const invalidData: string[] = [];
      expect(byId['2.3'].safeParse(invalidData).success).toBe(false);
      expect(successCriteriaSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject success criteria with empty strings via byId and composed schema', () => {
      const invalidData = ['Valid criterion', '', 'Another valid criterion'];
      expect(byId['2.3'].safeParse(invalidData).success).toBe(false);
      expect(successCriteriaSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Definition of Done Section (2.4) - Task Only', () => {
    const byId = (createBusinessScopeSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
    const definitionOfDoneSchema = (createBusinessScopeSchema('task').shape as any).definitionOfDone;

    it('should validate definition of done via byId and composed schema', () => {
      const validData = [
        {
          id: 'DoD-1',
          criterion: 'A validation library is available that can check the content of documentation files.',
        },
        {
          id: 'DoD-2',
          criterion:
            "The library correctly identifies when a document's 'Status' or 'Priority' section has missing or malformed information.",
        },
      ];
      expect(byId['2.4'].safeParse(validData).success).toBe(true);
      expect(definitionOfDoneSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject definition of done with missing ID via byId and composed schema', () => {
      const invalidData = [
        {
          criterion: 'Valid criterion without ID',
        },
      ];
      expect(byId['2.4'].safeParse(invalidData).success).toBe(false);
      expect(definitionOfDoneSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject definition of done with missing criterion via byId and composed schema', () => {
      const invalidData = [
        {
          id: 'DoD-1',
        },
      ];
      expect(byId['2.4'].safeParse(invalidData).success).toBe(false);
      expect(definitionOfDoneSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty definition of done array via byId and composed schema', () => {
      const invalidData: any[] = [];
      expect(byId['2.4'].safeParse(invalidData).success).toBe(false);
      expect(definitionOfDoneSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Core Business Processes Section (2.6) - Plan Only', () => {
    const byId = (createBusinessScopeSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
    const coreBusinessProcessesSchema = (createBusinessScopeSchema('plan').shape as any).coreBusinessProcesses;

    it('should validate core business processes via byId and composed schema', () => {
      const validData = [
        {
          name: 'Document Processing',
          participants: 'Data Analyst, System',
          goal: 'Process documents efficiently and accurately',
          workflow: ['Upload document', 'Validate content', 'Process data', 'Generate report'],
        },
        {
          name: 'Manual Review',
          participants: 'Data Scientist',
          goal: 'To validate the accuracy of automated text extraction from a source PDF',
          workflow: [
            'Analyst selects a document in the "Pending Review" state',
            'The UI displays the source PDF alongside the extracted text',
            'Analyst compares the two and makes corrections to the text',
            'Analyst approves the corrected text, advancing the document to the "Chunking" state',
          ],
        },
      ];
      expect(byId['2.6'].safeParse(validData).success).toBe(true);
      expect(coreBusinessProcessesSchema.safeParse(validData).success).toBe(true);
    });

    it('should reject business process with missing name via byId and composed schema', () => {
      const invalidData = [
        {
          participants: 'Data Analyst',
          goal: 'Process documents',
          workflow: ['Step 1', 'Step 2'],
        },
      ];
      expect(byId['2.6'].safeParse(invalidData).success).toBe(false);
      expect(coreBusinessProcessesSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should reject business process with empty workflow via byId and composed schema', () => {
      const invalidData = [
        {
          name: 'Test Process',
          participants: 'Data Analyst',
          goal: 'Process documents',
          workflow: [],
        },
      ];
      expect(byId['2.6'].safeParse(invalidData).success).toBe(false);
      expect(coreBusinessProcessesSchema.safeParse(invalidData).success).toBe(false);
    });
  });
});
