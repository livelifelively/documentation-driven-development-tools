import { z } from 'zod';
import { createMetaGovernanceSchema } from './1-meta-governance.schema.js';
import { createBusinessScopeSchema } from './2-business-scope.schema.js';
import { createPlanningDecompositionSchema } from './3-planning-decomposition.schema.js';
import { createHighLevelDesignSchema } from './4-high-level-design.schema.js';
import { createMaintenanceMonitoringSchema } from './5-maintenance-monitoring.schema.js';
import { createImplementationGuidanceSchema } from './6-implementation-guidance.schema.js';
import { createQualityOperationsSchema } from './7-quality-operations.schema.js';
import { createReferenceSchema } from './8-reference.schema.js';

// Export shared schemas
export * from './shared.schema.js';

// Export factory functions
export {
  createMetaGovernanceSchema,
  getMetaGovernanceTaskSchema,
  getMetaGovernancePlanSchema,
} from './1-meta-governance.schema.js';

// Export all family-level schemas
// Export factories for families (preferred API)
export { createBusinessScopeSchema } from './2-business-scope.schema.js';
export { createPlanningDecompositionSchema } from './3-planning-decomposition.schema.js';
export { createHighLevelDesignSchema } from './4-high-level-design.schema.js';
export { createMaintenanceMonitoringSchema } from './5-maintenance-monitoring.schema.js';
export { createImplementationGuidanceSchema } from './6-implementation-guidance.schema.js';
export {
  createQualityOperationsSchema,
  getQualityOperationsPlanSchema,
  getQualityOperationsTaskSchema,
} from './7-quality-operations.schema.js';
export { createReferenceSchema } from './8-reference.schema.js';

// No static schema constants; functions only per project conventions

// Combined schemas for end-to-end validation
// Note: These are now async and need to be awaited
export async function createTaskSchema() {
  return z.object({
    metaGovernance: createMetaGovernanceSchema('task'),
    businessScope: createBusinessScopeSchema('task'),
    planningDecomposition: createPlanningDecompositionSchema('task'),
    highLevelDesign: createHighLevelDesignSchema('task').optional(),
    maintenanceMonitoring: createMaintenanceMonitoringSchema('task').optional(),
    implementationGuidance: createImplementationGuidanceSchema('task').optional(),
    qualityOperations: createQualityOperationsSchema('task'),
    reference: createReferenceSchema('task').optional(),
  });
}

export async function createPlanSchema() {
  return z.object({
    metaGovernance: createMetaGovernanceSchema('plan'),
    businessScope: createBusinessScopeSchema('plan'),
    planningDecomposition: createPlanningDecompositionSchema('plan'),
    highLevelDesign: createHighLevelDesignSchema('plan').optional(),
    maintenanceMonitoring: createMaintenanceMonitoringSchema('plan').optional(),
    implementationGuidance: createImplementationGuidanceSchema('plan').optional(),
    qualityOperations: createQualityOperationsSchema('plan'),
    reference: createReferenceSchema('plan').optional(),
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

// No type exports for now per minimal API guideline
