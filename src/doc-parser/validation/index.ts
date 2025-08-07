import { z } from 'zod';
import { createMetaGovernanceSchema } from './1-meta-governance.schema.js';
import { BusinessScopeFamilySchema } from './2-business-scope.schema.js';
import { PlanningDecompositionFamilySchema } from './3-planning-decomposition.schema.js';
import { HighLevelDesignFamilySchema } from './4-high-level-design.schema.js';
import { MaintenanceMonitoringFamilySchema } from './5-maintenance-monitoring.schema.js';
import { ImplementationGuidanceFamilySchema } from './6-implementation-guidance.schema.js';
import { QualityOperationsFamilySchema } from './7-quality-operations.schema.js';
import { ReferenceFamilySchema } from './8-reference.schema.js';

// Export shared schemas
export * from './shared.schema.js';

// Export factory functions
export {
  createMetaGovernanceSchema,
  getMetaGovernanceTaskSchema,
  getMetaGovernancePlanSchema,
} from './1-meta-governance.schema.js';

// Export all family-level schemas
export { BusinessScopeFamilySchema } from './2-business-scope.schema.js';
export { PlanningDecompositionFamilySchema } from './3-planning-decomposition.schema.js';
export { HighLevelDesignFamilySchema } from './4-high-level-design.schema.js';
export { MaintenanceMonitoringFamilySchema } from './5-maintenance-monitoring.schema.js';
export { ImplementationGuidanceFamilySchema } from './6-implementation-guidance.schema.js';
export { QualityOperationsFamilySchema } from './7-quality-operations.schema.js';
export { ReferenceFamilySchema } from './8-reference.schema.js';

// Combined schemas for end-to-end validation
// Note: These are now async and need to be awaited
export async function createTaskSchema() {
  return z.object({
    metaGovernance: await createMetaGovernanceSchema('task'),
    businessScope: BusinessScopeFamilySchema,
    planningDecomposition: PlanningDecompositionFamilySchema,
    highLevelDesign: HighLevelDesignFamilySchema.optional(),
    maintenanceMonitoring: MaintenanceMonitoringFamilySchema.optional(),
    implementationGuidance: ImplementationGuidanceFamilySchema.optional(),
    qualityOperations: QualityOperationsFamilySchema,
    reference: ReferenceFamilySchema.optional(),
  });
}

export async function createPlanSchema() {
  return z.object({
    metaGovernance: await createMetaGovernanceSchema('plan'),
    businessScope: BusinessScopeFamilySchema,
    planningDecomposition: PlanningDecompositionFamilySchema,
    highLevelDesign: HighLevelDesignFamilySchema.optional(),
    maintenanceMonitoring: MaintenanceMonitoringFamilySchema.optional(),
    implementationGuidance: ImplementationGuidanceFamilySchema.optional(),
    qualityOperations: QualityOperationsFamilySchema,
    reference: ReferenceFamilySchema.optional(),
  });
}

// For backward compatibility, create static schemas using the async factories
let _taskSchema: z.ZodTypeAny | null = null;
let _planSchema: z.ZodTypeAny | null = null;

export async function getTaskSchema() {
  if (!_taskSchema) {
    _taskSchema = await createTaskSchema();
  }
  return _taskSchema;
}

export async function getPlanSchema() {
  if (!_planSchema) {
    _planSchema = await createPlanSchema();
  }
  return _planSchema;
}

// Export types for consumers
export type { MetaGovernanceFamily } from './1-meta-governance.schema.js';
export type { BusinessScopeFamily } from './2-business-scope.schema.js';
export type { PlanningDecompositionFamily } from './3-planning-decomposition.schema.js';
export type { HighLevelDesignFamily } from './4-high-level-design.schema.js';
export type { MaintenanceMonitoringFamily } from './5-maintenance-monitoring.schema.js';
export type { ImplementationGuidanceFamily } from './6-implementation-guidance.schema.js';
export type { QualityOperationsFamily } from './7-quality-operations.schema.js';
export type { ReferenceFamily } from './8-reference.schema.js';

// Export combined types (these will be async in the future)
export type Task = z.infer<Awaited<ReturnType<typeof createTaskSchema>>>;
export type Plan = z.infer<Awaited<ReturnType<typeof createPlanSchema>>>;
