import { z } from 'zod';
import { MetaGovernanceFamilySchema } from './1-meta-governance.schema.js';
import { BusinessScopeFamilySchema } from './2-business-scope.schema.js';
import { PlanningDecompositionFamilySchema } from './3-planning-decomposition.schema.js';
import { HighLevelDesignFamilySchema } from './4-high-level-design.schema.js';
import { MaintenanceMonitoringFamilySchema } from './5-maintenance-monitoring.schema.js';
import { ImplementationGuidanceFamilySchema } from './6-implementation-guidance.schema.js';
import { QualityOperationsFamilySchema } from './7-quality-operations.schema.js';
import { ReferenceFamilySchema } from './8-reference.schema.js';

// Export shared schemas
export * from './shared.schema.js';

// Export all family-level schemas
export { MetaGovernanceFamilySchema } from './1-meta-governance.schema.js';
export { BusinessScopeFamilySchema } from './2-business-scope.schema.js';
export { PlanningDecompositionFamilySchema } from './3-planning-decomposition.schema.js';
export { HighLevelDesignFamilySchema } from './4-high-level-design.schema.js';
export { MaintenanceMonitoringFamilySchema } from './5-maintenance-monitoring.schema.js';
export { ImplementationGuidanceFamilySchema } from './6-implementation-guidance.schema.js';
export { QualityOperationsFamilySchema } from './7-quality-operations.schema.js';
export { ReferenceFamilySchema } from './8-reference.schema.js';

// Combined schemas for end-to-end validation
export const TaskSchema = z.object({
  metaGovernance: MetaGovernanceFamilySchema,
  businessScope: BusinessScopeFamilySchema,
  planningDecomposition: PlanningDecompositionFamilySchema,
  highLevelDesign: HighLevelDesignFamilySchema.optional(),
  maintenanceMonitoring: MaintenanceMonitoringFamilySchema.optional(),
  implementationGuidance: ImplementationGuidanceFamilySchema.optional(),
  qualityOperations: QualityOperationsFamilySchema,
  reference: ReferenceFamilySchema.optional(),
});

export const PlanSchema = z.object({
  metaGovernance: MetaGovernanceFamilySchema,
  businessScope: BusinessScopeFamilySchema,
  planningDecomposition: PlanningDecompositionFamilySchema,
  highLevelDesign: HighLevelDesignFamilySchema.optional(),
  maintenanceMonitoring: MaintenanceMonitoringFamilySchema.optional(),
  implementationGuidance: ImplementationGuidanceFamilySchema.optional(),
  qualityOperations: QualityOperationsFamilySchema,
  reference: ReferenceFamilySchema.optional(),
});

// Export types for consumers
export type { MetaGovernanceFamily } from './1-meta-governance.schema.js';
export type { BusinessScopeFamily } from './2-business-scope.schema.js';
export type { PlanningDecompositionFamily } from './3-planning-decomposition.schema.js';
export type { HighLevelDesignFamily } from './4-high-level-design.schema.js';
export type { MaintenanceMonitoringFamily } from './5-maintenance-monitoring.schema.js';
export type { ImplementationGuidanceFamily } from './6-implementation-guidance.schema.js';
export type { QualityOperationsFamily } from './7-quality-operations.schema.js';
export type { ReferenceFamily } from './8-reference.schema.js';

// Export combined types
export type Task = z.infer<typeof TaskSchema>;
export type Plan = z.infer<typeof PlanSchema>;
