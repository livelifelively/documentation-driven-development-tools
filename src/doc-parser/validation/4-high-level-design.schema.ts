import { z } from 'zod';
import {
  PriorityLevel,
  DocumentType,
  getApplicability,
  createSectionSchemaWithApplicability,
  createMermaidWithTextSchema,
} from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';
import { camelCase } from 'lodash-es';

const highLevelDesignContent = loadDDDSchemaJsonFile('4-high-level-design.json');

// --- Field-Level Schema Definitions ---

// Guiding Principles - list of architectural rules
const guidingPrinciplesSchema = z.array(z.string().min(1)).min(1);

// Integration Point schema
const integrationPointSchema = z.object({
  trigger: z.string().min(1),
  inputData: z.string().min(1),
});

// Tech Stack Item schema
const techStackItemSchema = z.object({
  category: z.string().min(1), // e.g., "Language", "Framework", "Deployment"
  technology: z.string().min(1), // e.g., "TypeScript", "Next.js", "Vercel"
});

// Non-Functional Requirement schema
const nonFunctionalRequirementSchema = z.object({
  id: z.string().min(1), // e.g., "PERF-01", "SEC-01", "REL-01"
  requirement: z.string().min(1),
  priority: PriorityLevel,
});

// Permission Role schema
const permissionRoleSchema = z.object({
  role: z.string().min(1),
  permissions: z.array(z.string().min(1)).min(1),
  notes: z.string().optional(),
});

// --- Section-Level Factory Functions ---

const createGuidingPrinciplesSchema = (docType: DocumentType) => {
  const schema = guidingPrinciplesSchema;
  return createSectionSchemaWithApplicability('4.0', docType, schema, highLevelDesignContent);
};

// --- Reusable Architectural Component Factories ---

const createDataModelsSchema = (sectionId: string, docType: DocumentType) => {
  const schema = createMermaidWithTextSchema('erDiagram', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent);
};

const createComponentsSchema = (sectionId: string, docType: DocumentType) => {
  const schema = createMermaidWithTextSchema('classDiagram', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent);
};

const createDataFlowSchema = (sectionId: string, docType: DocumentType) => {
  const schema = createMermaidWithTextSchema('graph', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent);
};

const createControlFlowSchema = (sectionId: string, docType: DocumentType) => {
  const schema = createMermaidWithTextSchema('sequenceDiagram', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent);
};

const createIntegrationPointsSchema = (sectionId: string, docType: DocumentType) => {
  const schema = z.object({
    upstream: z.array(integrationPointSchema).min(1).optional(),
    downstream: z.array(integrationPointSchema).min(1).optional(),
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent);
};

const createExposedAPISchema = (docType: DocumentType) => {
  const schema = z.string().min(1); // OpenAPI/Swagger content or markdown table
  return createSectionSchemaWithApplicability('4.2.6', docType, schema, highLevelDesignContent);
};

// --- Architecture Section Schemas ---

const createCurrentArchitectureSchema = (docType: DocumentType) => {
  // Define the internal shape with optional subsections to allow for the refine logic.
  const internalShape = z
    .object({
      text: z.array(z.string()).optional(),
      dataModels: createDataModelsSchema('4.1.1', docType),
      components: createComponentsSchema('4.1.2', docType),
      dataFlow: createDataFlowSchema('4.1.3', docType),
      controlFlow: createControlFlowSchema('4.1.4', docType),
      integrationPoints: createIntegrationPointsSchema('4.1.5', docType),
    })
    .partial()
    .strict()
    .refine(
      (data) => {
        const hasText = Array.isArray(data.text) && data.text.length > 0;
        const hasSubsections =
          data.dataModels || data.components || data.dataFlow || data.controlFlow || data.integrationPoints;
        return hasText || hasSubsections;
      },
      {
        message:
          'If Current Architecture is present, it must contain either a text description or at least one subsection (Data Models, Components, etc.).',
      }
    );

  // The wrapper function will now correctly apply 'optional' to this entire block for plans.
  return createSectionSchemaWithApplicability('4.1', docType, internalShape, highLevelDesignContent);
};

const createTargetArchitectureSchema = (docType: DocumentType) => {
  // Define the two valid shapes for the content
  const textOnlySchema = z
    .object({
      text: z.array(z.string()).min(1),
    })
    .strict();

  const subsectionsSchema = z
    .object({
      dataModels: createDataModelsSchema('4.2.1', docType),
      components: createComponentsSchema('4.2.2', docType),
      dataFlow: createDataFlowSchema('4.2.3', docType),
      controlFlow: createControlFlowSchema('4.2.4', docType),
      integrationPoints: createIntegrationPointsSchema('4.2.5', docType),
      exposedAPI: createExposedAPISchema(docType),
    })
    .strict();

  // The content must match one of these two shapes, or both
  const internalShape = z.union([textOnlySchema, subsectionsSchema, textOnlySchema.merge(subsectionsSchema)]);

  return createSectionSchemaWithApplicability('4.2', docType, internalShape, highLevelDesignContent);
};

const createTechStackDeploymentSchema = (docType: DocumentType) => {
  const schema = z.array(techStackItemSchema).min(1);
  return createSectionSchemaWithApplicability('4.3', docType, schema, highLevelDesignContent);
};

const createNonFunctionalRequirementsSchema = (docType: DocumentType) => {
  const schema = z.object({
    performance: z.array(nonFunctionalRequirementSchema).min(1).optional(),
    security: z.array(nonFunctionalRequirementSchema).min(1).optional(),
    reliability: z.array(nonFunctionalRequirementSchema).min(1).optional(),
    permissionModel: z.array(permissionRoleSchema).min(1).optional(),
  });
  return createSectionSchemaWithApplicability('4.4', docType, schema, highLevelDesignContent);
};

// --- Section Factory Map ---
const sectionFactories: Record<string, (docType: DocumentType) => z.ZodTypeAny> = {
  '4.0': createGuidingPrinciplesSchema,
  '4.1': createCurrentArchitectureSchema,
  '4.2': createTargetArchitectureSchema,
  '4.3': createTechStackDeploymentSchema,
  '4.4': createNonFunctionalRequirementsSchema,
};

// --- Family-Level Factory Function ---

/**
 * Creates a fully composed Zod schema for the High-Level Design family
 * by iterating through the JSON definition and using a factory map.
 *
 * @param docType - The document type ('plan' or 'task').
 * @returns A Zod schema for the High-Level Design family.
 */
export const createHighLevelDesignSchema = (docType: DocumentType) => {
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of highLevelDesignContent.sections) {
    // Only process top-level sections (IDs like "4.0", "4.1", etc.)
    // Skip nested sections (IDs like "4.2.1", "4.2.2", etc.)
    if (section.id.match(/\.\d+\.\d+$/)) {
      continue;
    }

    const applicability = getApplicability(section.applicability, docType);
    if (applicability === 'omitted') {
      continue;
    }

    const factory = sectionFactories[section.id];
    if (!factory) {
      // This can happen for container sections like '4.1.5 Integration Points' which don't have a direct factory
      // but their children do. The logic inside the main section factories handles the composition.
      // We only need to process the top-level sections here.
      if (section.id.match(/^4\.\d+$/)) {
        throw new Error(
          `Schema mismatch: No factory found for section ID "${section.id}" (${section.name}). This indicates a mismatch between the schema definition and JSON files.`
        );
      }
      continue;
    }

    const schema = factory(docType);

    // The factory for omitted sections returns z.never(), so we check for that
    if (schema instanceof z.ZodNever) {
      continue;
    }

    const sectionName = camelCase(section.name);
    familyShape[sectionName] = schema; // The factory already handles optionality
  }

  return z.object(familyShape).strict();
};

// --- Convenience Functions for Backward Compatibility ---

/**
 * Creates a task-specific High-Level Design schema
 * @returns A Zod schema for task High-Level Design
 */
export const getHighLevelDesignTaskSchema = () => createHighLevelDesignSchema('task');

/**
 * Creates a plan-specific High-Level Design schema
 * @returns A Zod schema for plan High-Level Design
 */
export const getHighLevelDesignPlanSchema = () => createHighLevelDesignSchema('plan');

// Export the factory and inferred type
export type HighLevelDesignFamily = z.infer<ReturnType<typeof createHighLevelDesignSchema>>;

// --- Individual Schema Exports for Specific Use Cases ---
export {
  guidingPrinciplesSchema,
  integrationPointSchema,
  techStackItemSchema,
  nonFunctionalRequirementSchema,
  permissionRoleSchema,
};

// Export individual architectural component factories
export {
  createCurrentArchitectureSchema,
  createTargetArchitectureSchema,
  createDataModelsSchema,
  createComponentsSchema,
  createDataFlowSchema,
  createControlFlowSchema,
  createIntegrationPointsSchema,
  createExposedAPISchema,
};

// --- Type Exports ---
export type GuidingPrinciples = z.infer<typeof guidingPrinciplesSchema>;
export type IntegrationPoint = z.infer<typeof integrationPointSchema>;
export type TechStackItem = z.infer<typeof techStackItemSchema>;
export type NonFunctionalRequirement = z.infer<typeof nonFunctionalRequirementSchema>;
export type PermissionRole = z.infer<typeof permissionRoleSchema>;
