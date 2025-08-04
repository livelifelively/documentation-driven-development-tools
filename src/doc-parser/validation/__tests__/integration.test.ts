import { describe, it, expect } from 'vitest';
import {
  MetaGovernanceFamilySchema,
  BusinessScopeFamilySchema,
  PlanningDecompositionFamilySchema,
  QualityOperationsFamilySchema,
  ReferenceFamilySchema,
  TaskSchema,
} from '../index.js';

describe('Integration Tests', () => {
  describe('Valid Task Object', () => {
    it('should validate a fully valid task object', () => {
      // Mock object that mimics the expected output of a real parser
      const validTaskObject = {
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
          priorityDrivers: ['TEC-Prod_Stability_Blocker', 'TEC-Dev_Productivity_Enhancement'],
        },
        businessScope: {
          overview: {
            coreFunction: 'Create canonical Zod schemas for documentation validation',
            keyCapability: 'Validate parsed content structure of markdown sections',
            businessValue: 'Enable automated validation of documentation content',
          },
          definitionOfDone: [
            {
              id: 'DoD-1',
              criterion: 'A validation library is available that can check the content of documentation files',
            },
            {
              id: 'DoD-2',
              criterion:
                "The library correctly identifies when a document's sections have missing or malformed information",
            },
            {
              id: 'DoD-3',
              criterion: 'The library can validate the structure of all tables, ensuring they have the right columns',
            },
            {
              id: 'DoD-4',
              criterion:
                'The library successfully flags documents that contain structural errors and confirms that valid documents pass without errors',
            },
            {
              id: 'DoD-5',
              criterion:
                'The validation logic for each of the 8 documentation families is organized separately for maintainability',
            },
          ],
        },
        planningDecomposition: {
          dependencies: [
            {
              id: 'D-1',
              dependencyOn: 'T28: Define Canonical Schema Interfaces',
              type: 'Internal',
              status: 'Complete',
              affectedPlansTasks: ['p1-p6.t32'],
              notes:
                'The base types for the schema definition itself are a prerequisite for creating strongly-typed content schemas',
            },
            {
              id: 'D-2',
              dependencyOn: 'A Markdown Parser (e.g., remark)',
              type: 'External',
              status: 'Complete',
              affectedPlansTasks: ['p1-p6.t32'],
              notes: 'The schemas must validate the output of the chosen parser',
            },
          ],
        },
        qualityOperations: {
          testingStrategy: [
            {
              acId: 'AC-1',
              dodLink: 'DoD-2',
              scenario: 'Unit test for metaGovernanceSchema (valid and invalid Status)',
              testType: 'Unit',
              testFile: '__tests__/1-meta-governance.schema.test.ts',
            },
            {
              acId: 'AC-2',
              dodLink: 'DoD-3',
              scenario: 'Unit test for businessScopeSchema (valid and invalid DoD table)',
              testType: 'Unit',
              testFile: '__tests__/2-business-scope.schema.test.ts',
            },
            {
              acId: 'AC-3',
              dodLink: 'DoD-3',
              scenario: 'Unit test for planningDecompositionSchema (valid/invalid Dep table)',
              testType: 'Unit',
              testFile: '__tests__/3-planning-decomposition.schema.test.ts',
            },
            {
              acId: 'AC-4',
              dodLink: 'DoD-4',
              scenario: 'Integration test with a fully valid mock task object',
              testType: 'Integration',
              testFile: '__tests__/integration.test.ts',
            },
            {
              acId: 'AC-5',
              dodLink: 'DoD-4',
              scenario: 'Integration test with a mock task object containing multiple errors',
              testType: 'Integration',
              testFile: '__tests__/integration.test.ts',
            },
            {
              acId: 'AC-6',
              dodLink: 'DoD-1, 5',
              scenario: 'Test that all family schemas are exported from the main index',
              testType: 'Unit',
              testFile: '__tests__/index.test.ts',
            },
          ],
        },
        reference: {
          appendicesGlossary: {
            glossary: [
              {
                term: 'Zod',
                definition: 'The schema validation library used to define the content structure rules',
              },
              {
                term: 'AST (Abstract Syntax Tree)',
                definition: 'The tree representation of the parsed markdown content that the schemas will validate',
              },
              {
                term: 'Consumer',
                definition:
                  'Any tool or script that imports and uses this schema library for validation (e.g., a linter, a git-hook script)',
              },
            ],
          },
        },
      };

      // Test each family schema individually
      const metaGovernanceResult = MetaGovernanceFamilySchema.safeParse(validTaskObject.metaGovernance);
      expect(metaGovernanceResult.success).toBe(true);

      const businessScopeResult = BusinessScopeFamilySchema.safeParse(validTaskObject.businessScope);
      expect(businessScopeResult.success).toBe(true);

      const planningDecompositionResult = PlanningDecompositionFamilySchema.safeParse(
        validTaskObject.planningDecomposition
      );
      expect(planningDecompositionResult.success).toBe(true);

      const qualityOperationsResult = QualityOperationsFamilySchema.safeParse(validTaskObject.qualityOperations);
      expect(qualityOperationsResult.success).toBe(true);

      const referenceResult = ReferenceFamilySchema.safeParse(validTaskObject.reference);
      expect(referenceResult.success).toBe(true);

      // Test the combined TaskSchema for end-to-end validation
      const combinedResult = TaskSchema.safeParse(validTaskObject);
      expect(combinedResult.success).toBe(true);
    });
  });

  describe('Invalid Task Object', () => {
    it('should reject a task object with multiple structural errors', () => {
      // Mock object with various validation errors
      const invalidTaskObject = {
        metaGovernance: {
          status: {
            currentState: 'Invalid Status', // Invalid: not in enum
            priority: 'Invalid Priority', // Invalid: not in enum
            progress: 150, // Invalid: should be 0-100
            planningEstimate: -5, // Invalid: should be >= 0
            estVariance: 'abc', // Invalid: should be number
            created: '2025-08-03', // Invalid: missing time
            lastUpdated: '2025-08-03 21:35',
          },
          priorityDrivers: ['INVALID-FORMAT'], // Invalid format
        },
        businessScope: {
          overview: {
            coreFunction: '', // Invalid: empty string
            keyCapability: 'Valid capability',
            businessValue: 'Valid value',
          },
          definitionOfDone: [
            {
              id: '', // Invalid: empty string
              criterion: 'Valid criterion',
            },
            {
              id: 'DoD-2',
              criterion: '', // Invalid: empty string
            },
          ],
        },
        planningDecomposition: {
          dependencies: [
            {
              id: 'D-1',
              dependencyOn: 'Test dependency',
              type: 'InvalidType', // Invalid: not in enum
              status: 'InvalidStatus', // Invalid: not in enum
              affectedPlansTasks: [], // Invalid: empty array
              notes: 'Valid notes',
            },
          ],
        },
        qualityOperations: {
          testingStrategy: [
            {
              acId: 'AC-1',
              dodLink: 'DoD-1',
              scenario: 'Valid scenario',
              testType: 'InvalidType', // Invalid: not in enum
              testFile: '', // Invalid: empty string
            },
          ],
        },
        reference: {
          appendicesGlossary: {
            glossary: [
              {
                term: '', // Invalid: empty string
                definition: 'Valid definition',
              },
              {
                term: 'Valid term',
                definition: '', // Invalid: empty string
              },
            ],
          },
        },
      };

      // Test each family schema - should fail
      const metaGovernanceResult = MetaGovernanceFamilySchema.safeParse(invalidTaskObject.metaGovernance);
      expect(metaGovernanceResult.success).toBe(false);
      if (!metaGovernanceResult.success) {
        expect(metaGovernanceResult.error.issues.length).toBeGreaterThan(0);
      }

      const businessScopeResult = BusinessScopeFamilySchema.safeParse(invalidTaskObject.businessScope);
      expect(businessScopeResult.success).toBe(false);
      if (!businessScopeResult.success) {
        expect(businessScopeResult.error.issues.length).toBeGreaterThan(0);
      }

      const planningDecompositionResult = PlanningDecompositionFamilySchema.safeParse(
        invalidTaskObject.planningDecomposition
      );
      expect(planningDecompositionResult.success).toBe(false);
      if (!planningDecompositionResult.success) {
        expect(planningDecompositionResult.error.issues.length).toBeGreaterThan(0);
      }

      const qualityOperationsResult = QualityOperationsFamilySchema.safeParse(invalidTaskObject.qualityOperations);
      expect(qualityOperationsResult.success).toBe(false);
      if (!qualityOperationsResult.success) {
        expect(qualityOperationsResult.error.issues.length).toBeGreaterThan(0);
      }

      const referenceResult = ReferenceFamilySchema.safeParse(invalidTaskObject.reference);
      expect(referenceResult.success).toBe(false);
      if (!referenceResult.success) {
        expect(referenceResult.error.issues.length).toBeGreaterThan(0);
      }

      // Test the combined TaskSchema for end-to-end validation
      const combinedInvalidResult = TaskSchema.safeParse(invalidTaskObject);
      expect(combinedInvalidResult.success).toBe(false);
      if (!combinedInvalidResult.success) {
        expect(combinedInvalidResult.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
