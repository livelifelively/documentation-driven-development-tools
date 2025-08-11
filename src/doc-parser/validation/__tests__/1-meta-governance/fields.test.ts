import { describe, it, expect } from 'vitest';
import { createMetaGovernanceSchema } from '../../1-meta-governance.schema.js';
import { z } from 'zod';

describe('Meta & Governance Schema - Field Tests', () => {
  describe('Status Section Field Tests', () => {
    describe('Plan Fields', () => {
      const byId = (createMetaGovernanceSchema('plan') as any).__byId as Record<string, z.ZodTypeAny>;
      const statusPlanSchema = (createMetaGovernanceSchema('plan').shape as any).status;

      describe('Created Field', () => {
        it('should validate created field via byId', () => {
          const validData = {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate created field via composed schema', () => {
          const validData = {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          };
          expect(statusPlanSchema.safeParse(validData).success).toBe(true);
        });

        it('should reject invalid created date format via byId', () => {
          const invalidData = {
            created: 'invalid-date',
            lastUpdated: '2025-07-24 16:20',
          };
          expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
        });

        it('should reject invalid created date format via composed schema', () => {
          const invalidData = {
            created: 'invalid-date',
            lastUpdated: '2025-07-24 16:20',
          };
          expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
        });
      });

      describe('Last Updated Field', () => {
        it('should validate lastUpdated field via byId', () => {
          const validData = {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate lastUpdated field via composed schema', () => {
          const validData = {
            created: '2025-07-24 16:20',
            lastUpdated: '2025-07-24 16:20',
          };
          expect(statusPlanSchema.safeParse(validData).success).toBe(true);
        });

        it('should reject invalid lastUpdated date format via byId', () => {
          const invalidData = {
            created: '2025-07-24 16:20',
            lastUpdated: 'invalid-date',
          };
          expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
        });

        it('should reject invalid lastUpdated date format via composed schema', () => {
          const invalidData = {
            created: '2025-07-24 16:20',
            lastUpdated: 'invalid-date',
          };
          expect(statusPlanSchema.safeParse(invalidData).success).toBe(false);
        });
      });
    });

    describe('Task Fields', () => {
      const byId = (createMetaGovernanceSchema('task') as any).__byId as Record<string, z.ZodTypeAny>;
      const statusTaskSchema = (createMetaGovernanceSchema('task').shape as any).status;

      describe('Current State Field', () => {
        it('should validate currentState field via byId', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate currentState field via composed schema', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(validData).success).toBe(true);
        });

        it('should reject invalid currentState via byId', () => {
          const invalidData = {
            currentState: 'Invalid Status',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
        });

        it('should reject invalid currentState via composed schema', () => {
          const invalidData = {
            currentState: 'Invalid Status',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
        });
      });

      describe('Priority Field', () => {
        it('should validate priority field via byId', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate priority field via composed schema', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(validData).success).toBe(true);
        });

        it('should reject invalid priority via byId', () => {
          const invalidData = {
            currentState: 'Not Started',
            priority: 'Invalid Priority',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
        });

        it('should reject invalid priority via composed schema', () => {
          const invalidData = {
            currentState: 'Not Started',
            priority: 'Invalid Priority',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
        });
      });

      describe('Progress Field', () => {
        it('should validate progress field via byId', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 50,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate progress field via composed schema', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 50,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(validData).success).toBe(true);
        });

        it('should reject progress outside valid range via byId', () => {
          const invalidData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 150, // > 100
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
        });

        it('should reject progress outside valid range via composed schema', () => {
          const invalidData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 150, // > 100
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
        });
      });

      describe('Planning Estimate Field', () => {
        it('should validate planningEstimate field via byId', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate planningEstimate field via composed schema', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(validData).success).toBe(true);
        });

        it('should reject negative planningEstimate via byId', () => {
          const invalidData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: -1,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(invalidData).success).toBe(false);
        });

        it('should reject negative planningEstimate via composed schema', () => {
          const invalidData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: -1,
            estVariancePts: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(invalidData).success).toBe(false);
        });
      });

      describe('Est Variance Pts Field', () => {
        it('should validate estVariancePts field via byId', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 2,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should validate estVariancePts field via composed schema', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: 2,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(validData).success).toBe(true);
        });

        it('should accept negative estVariancePts via byId', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: -2, // Negative is valid
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(byId['1.2'].safeParse(validData).success).toBe(true);
        });

        it('should accept negative estVariancePts via composed schema', () => {
          const validData = {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariancePts: -2, // Negative is valid
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          };
          expect(statusTaskSchema.safeParse(validData).success).toBe(true);
        });
      });
    });
  });
});
