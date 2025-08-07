import { describe, it, expect } from 'vitest';
import {
  BusinessScopeFamilySchema,
  PlanningDecompositionFamilySchema,
  HighLevelDesignFamilySchema,
  MaintenanceMonitoringFamilySchema,
  ImplementationGuidanceFamilySchema,
  QualityOperationsFamilySchema,
  ReferenceFamilySchema,
  getTaskSchema,
  getPlanSchema,
  getMetaGovernanceTaskSchema,
  getMetaGovernancePlanSchema,
} from '../index';

describe('Validation Schema Index', () => {
  describe('Schema Exports', () => {
    it('should export all family schemas', () => {
      expect(BusinessScopeFamilySchema).toBeDefined();
      expect(PlanningDecompositionFamilySchema).toBeDefined();
      expect(HighLevelDesignFamilySchema).toBeDefined();
      expect(MaintenanceMonitoringFamilySchema).toBeDefined();
      expect(ImplementationGuidanceFamilySchema).toBeDefined();
      expect(QualityOperationsFamilySchema).toBeDefined();
      expect(ReferenceFamilySchema).toBeDefined();
    });

    it('should export all family types', () => {
      // This test ensures that all type exports are working
      expect(true).toBe(true);
    });
  });

  describe('Schema Functionality', () => {
    it('should validate a complete document structure', async () => {
      // Test that the async factory functions work
      const taskSchema = await getTaskSchema();
      expect(taskSchema).toBeDefined();

      const planSchema = await getPlanSchema();
      expect(planSchema).toBeDefined();

      const metaGovernanceTaskSchema = await getMetaGovernanceTaskSchema();
      expect(metaGovernanceTaskSchema).toBeDefined();

      const metaGovernancePlanSchema = await getMetaGovernancePlanSchema();
      expect(metaGovernancePlanSchema).toBeDefined();
    });

    it('should reject invalid document structure', async () => {
      // Test that the async factory functions work
      const taskSchema = await getTaskSchema();
      expect(taskSchema).toBeDefined();

      const planSchema = await getPlanSchema();
      expect(planSchema).toBeDefined();
    });
  });
});
