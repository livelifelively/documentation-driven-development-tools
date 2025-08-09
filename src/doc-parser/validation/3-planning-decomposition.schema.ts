import { z } from 'zod';
import {
  PriorityLevel,
  StatusKey,
  PriorityDriver,
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
  priorityDrivers: z.array(PriorityDriver).min(1), // e.g., ["CBP-Break_Block_Revenue_Legal"]
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
  return createSectionSchemaWithApplicability('3.1', docType, schema, planningDecompositionContent);
};

const createBacklogSchema = (docType: DocumentType) => {
  const schema = z.array(backlogItemSchema).min(1);
  return createSectionSchemaWithApplicability('3.2', docType, schema, planningDecompositionContent);
};

const createDependenciesSchema = (docType: DocumentType) => {
  const schema = z.array(dependencySchema).min(1);
  return createSectionSchemaWithApplicability('3.3', docType, schema, planningDecompositionContent);
};

const createDecompositionGraphSchema = (docType: DocumentType) => {
  const schema = createMermaidWithTextSchema('graph', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability('3.4', docType, schema, planningDecompositionContent);
};

// --- Section Factory Map ---
const sectionFactories: Record<string, (docType: DocumentType) => z.ZodTypeAny> = {
  '3.1': createRoadmapSchema,
  '3.2': createBacklogSchema,
  '3.3': createDependenciesSchema,
  '3.4': createDecompositionGraphSchema,
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

    const factory = sectionFactories[section.id];
    if (!factory) {
      throw new Error(
        `Schema mismatch: No factory found for section ID "${section.id}" (${section.name}). This indicates a mismatch between the schema definition and JSON files.`
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

// Functions-only API; no constant or type exports
