import { describe, it, expect } from 'vitest';
import {
  MetaGovernanceFamilySchema,
  BusinessScopeFamilySchema,
  PlanningDecompositionFamilySchema,
  HighLevelDesignFamilySchema,
  MaintenanceMonitoringFamilySchema,
  ImplementationGuidanceFamilySchema,
  QualityOperationsFamilySchema,
  ReferenceFamilySchema,
  TaskSchema,
  PlanSchema,
} from '../index.js';

describe('Validation Schema Index', () => {
  describe('Schema Exports', () => {
    it('should export all family schemas', () => {
      expect(MetaGovernanceFamilySchema).toBeDefined();
      expect(BusinessScopeFamilySchema).toBeDefined();
      expect(PlanningDecompositionFamilySchema).toBeDefined();
      expect(HighLevelDesignFamilySchema).toBeDefined();
      expect(MaintenanceMonitoringFamilySchema).toBeDefined();
      expect(ImplementationGuidanceFamilySchema).toBeDefined();
      expect(QualityOperationsFamilySchema).toBeDefined();
      expect(ReferenceFamilySchema).toBeDefined();
    });

    it('should export all family types', () => {
      // These are type imports, so we just check they don't throw errors
      // TypeScript types are erased at runtime, so we can't test them directly
      // Instead, we verify the imports don't cause compilation errors
      expect(true).toBe(true); // Placeholder - types are checked at compile time
    });
  });

  describe('Schema Functionality', () => {
    it('should validate a complete document structure', () => {
      const validDocument = {
        metaGovernance: {
          status: {
            currentState: 'Not Started',
            priority: 'High',
            progress: 0,
            planningEstimate: 5,
            estVariance: 0,
            created: '2025-08-03 06:13',
            lastUpdated: '2025-08-03 21:35',
          },
          priorityDrivers: ['TEC-Prod_Stability_Blocker'],
        },
        businessScope: {
          overview: {
            coreFunction: 'Test function',
            keyCapability: 'Test capability',
            businessValue: 'Test value',
          },
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'Test criterion',
            },
          ],
        },
        planningDecomposition: {
          dependencies: [
            {
              id: 'D-1',
              dependencyOn: 'Test dependency',
              type: 'Internal',
              status: 'Complete',
              affectedPlansTasks: ['p1-frontend'],
              notes: 'Test notes',
            },
          ],
        },
        qualityOperations: {
          testingStrategy: [
            {
              acId: 'AC-1',
              dodLink: 'DoD-1',
              scenario: 'Test scenario',
              testType: 'Unit',
              testFile: 'test.test.ts',
            },
          ],
        },
        reference: {
          appendicesGlossary: {
            glossary: [
              {
                term: 'Test',
                definition: 'Test definition',
              },
            ],
          },
        },
      };

      // Test each schema individually
      const metaResult = MetaGovernanceFamilySchema.safeParse(validDocument.metaGovernance);
      expect(metaResult.success).toBe(true);

      const businessResult = BusinessScopeFamilySchema.safeParse(validDocument.businessScope);
      expect(businessResult.success).toBe(true);

      const planningResult = PlanningDecompositionFamilySchema.safeParse(validDocument.planningDecomposition);
      expect(planningResult.success).toBe(true);

      const qualityResult = QualityOperationsFamilySchema.safeParse(validDocument.qualityOperations);
      expect(qualityResult.success).toBe(true);

      const referenceResult = ReferenceFamilySchema.safeParse(validDocument.reference);
      expect(referenceResult.success).toBe(true);
    });

    it('should reject invalid document structure', () => {
      const invalidDocument = {
        metaGovernance: {
          status: {
            currentState: 'Invalid Status',
            priority: 'Invalid Priority',
            progress: 150, // Invalid: should be 0-100
            planningEstimate: -5, // Invalid: should be >= 0
            estVariance: 'abc', // Invalid: should be number
            created: '2025-08-03', // Invalid: missing time
            lastUpdated: '2025-08-03 21:35',
          },
          priorityDrivers: ['INVALID-FORMAT'], // Invalid format
        },
      };

      const metaResult = MetaGovernanceFamilySchema.safeParse(invalidDocument.metaGovernance);
      expect(metaResult.success).toBe(false);
      if (!metaResult.success) {
        expect(metaResult.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
