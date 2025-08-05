import { z } from 'zod';
import {
  PriorityLevel,
  StatusKey,
  DependencyStatus,
  DependencyType,
  DocumentType,
  getApplicability,
  createSectionSchemaWithApplicability,
  createSmartMermaidSchema,
  createMermaidWithTextSchema,
} from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';
import { camelCase } from 'lodash-es';

const planningDecompositionContent = loadDDDSchemaJsonFile('3-planning-decomposition.json');

// --- Field-Level Schema Definitions ---

const roadmapItemSchema = z.object({
  id: z.string().min(1), // e.g., "P1", "T1"
  childPlanTask: z.string().min(1), // e.g., "[Backend Plan](p1-backend.plan.md)"
  priority: PriorityLevel,
  priorityDrivers: z.array(z.string().min(1)).min(1), // e.g., ["CBP-Break_Block_Revenue_Legal"]
  status: StatusKey,
  dependsOn: z.string().optional(), // e.g., "—", "P1", "T1"
  summary: z.string().min(1),
});

const backlogItemSchema = z.object({
  name: z.string().min(1), // e.g., "Reporting Plan"
  reason: z.string().min(1), // e.g., "Deferred to Q4 due to dependency on new analytics service."
});

const dependencySchema = z.object({
  id: z.string().min(1), // e.g., "D-1", "D-2"
  dependencyOn: z.string().min(1), // e.g., "shared-ui-library v2.1+"
  type: DependencyType,
  status: DependencyStatus,
  affectedPlansTasks: z.array(z.string().min(1)).min(1), // e.g., ["p1-frontend", "p3-reporting"]
  notes: z.string().min(1),
});

// Enhanced decomposition graph schema using smart Mermaid parser
const decompositionGraphSchema = createSmartMermaidSchema('graph');

// --- Section-Level Factory Functions ---

const createRoadmapSchema = (docType: DocumentType) => {
  const schema = z.array(roadmapItemSchema).min(1);
  return createSectionSchemaWithApplicability(
    'Roadmap (In-Focus Items)',
    docType,
    schema,
    planningDecompositionContent
  );
};

const createBacklogSchema = (docType: DocumentType) => {
  const schema = z.array(backlogItemSchema).min(1);
  return createSectionSchemaWithApplicability('Backlog / Icebox', docType, schema, planningDecompositionContent);
};

const createDependenciesSchema = (docType: DocumentType) => {
  const schema = z.array(dependencySchema).min(1);
  return createSectionSchemaWithApplicability('Dependencies', docType, schema, planningDecompositionContent);
};

const createDecompositionGraphSchema = (docType: DocumentType) => {
  const schema = createMermaidWithTextSchema('graph', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability('Decomposition Graph', docType, schema, planningDecompositionContent);
};

// --- Section Factory Map ---
const sectionFactories: Record<string, (docType: DocumentType) => z.ZodTypeAny> = {
  'Roadmap (In-Focus Items)': createRoadmapSchema,
  'Backlog / Icebox': createBacklogSchema,
  Dependencies: createDependenciesSchema,
  'Decomposition Graph': createDecompositionGraphSchema,
};

// --- Family-Level Factory Function ---

/**
 * Creates a fully composed Zod schema for the Planning & Decomposition family
 * by iterating through the JSON definition and using a factory map.
 *
 * @param docType - The document type ('plan' or 'task').
 * @returns A Zod schema for the Planning & Decomposition family.
 */
export const createPlanningDecompositionSchema = (docType: DocumentType) => {
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of planningDecompositionContent.sections) {
    const applicability = getApplicability(section.applicability, docType);
    if (applicability === 'omitted') {
      continue;
    }

    const factory = sectionFactories[section.name];
    if (!factory) {
      throw new Error(
        `Schema mismatch: No factory found for section "${section.name}". This indicates a mismatch between the schema definition and JSON files.`
      );
    }

    const schema = factory(docType);
    const sectionName = camelCase(section.name);
    familyShape[sectionName] = applicability === 'optional' ? schema.optional() : schema;
  }

  return z.object(familyShape).strict();
};

// --- Convenience Functions for Backward Compatibility ---

/**
 * Creates a task-specific Planning & Decomposition schema
 * @returns A Zod schema for task Planning & Decomposition
 */
export const getPlanningDecompositionTaskSchema = () => createPlanningDecompositionSchema('task');

/**
 * Creates a plan-specific Planning & Decomposition schema
 * @returns A Zod schema for plan Planning & Decomposition
 */
export const getPlanningDecompositionPlanSchema = () => createPlanningDecompositionSchema('plan');

// Export the factory and inferred type
export type PlanningDecompositionFamily = z.infer<ReturnType<typeof createPlanningDecompositionSchema>>;

// --- Static Schema Exports for Backward Compatibility ---
// These are used by tests that expect static schemas

// --- Plan-Specific Schema Exports ---

export const PlanningDecompositionFamilyPlanSchema = createPlanningDecompositionSchema('plan');

// Individual section schemas for testing
export const RoadmapPlanSchema = createRoadmapSchema('plan');
export const BacklogPlanSchema = createBacklogSchema('plan');
export const DependenciesPlanSchema = createDependenciesSchema('plan');
export const DecompositionGraphPlanSchema = createDecompositionGraphSchema('plan');

// --- Task-Specific Schema Exports ---

export const PlanningDecompositionFamilyTaskSchema = createPlanningDecompositionSchema('task');
export const RoadmapTaskSchema = createRoadmapSchema('task');
export const BacklogTaskSchema = createBacklogSchema('task');
export const DependenciesTaskSchema = createDependenciesSchema('task');
export const DecompositionGraphTaskSchema = createDecompositionGraphSchema('task');

// --- Individual Schema Exports for Specific Use Cases ---
export {
  roadmapItemSchema as RoadmapItemSchema,
  backlogItemSchema as BacklogItemSchema,
  dependencySchema as DependencySchema,
  decompositionGraphSchema as DecompositionGraphSchema,
};

// --- Type Exports ---
export type RoadmapItem = z.infer<typeof roadmapItemSchema>;
export type BacklogItem = z.infer<typeof backlogItemSchema>;
export type Dependency = z.infer<typeof dependencySchema>;
export type DecompositionGraph = z.infer<typeof decompositionGraphSchema>;
