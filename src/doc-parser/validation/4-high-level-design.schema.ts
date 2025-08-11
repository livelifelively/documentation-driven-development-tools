import { z } from 'zod';
import {
  PriorityLevel,
  DocumentType,
  getApplicability,
  createSectionSchemaWithApplicability,
  registerSchema,
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

const createGuidingPrinciplesSchema = (docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = guidingPrinciplesSchema;
  const section = createSectionSchemaWithApplicability('4.0', docType, schema, highLevelDesignContent, byId);
  return section;
};

// --- Reusable Architectural Component Factories ---

const createDataModelsSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = createMermaidWithTextSchema('erDiagram', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createComponentsSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = createMermaidWithTextSchema('classDiagram', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createDataFlowSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = createMermaidWithTextSchema('graph', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createControlFlowSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = createMermaidWithTextSchema('sequenceDiagram', {
    diagramRequired: true,
    textRequired: false,
    allowTextOnly: false,
    allowDiagramOnly: true,
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

// Individual Integration Points subsection factories
const createUpstreamIntegrationsSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = z.array(integrationPointSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createDownstreamIntegrationsSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = z.array(integrationPointSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createIntegrationPointsSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = z.object({
    upstream: createUpstreamIntegrationsSchema(`${sectionId}.1`, docType, byId),
    downstream: createDownstreamIntegrationsSchema(`${sectionId}.2`, docType, byId),
  });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createExposedAPISchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.string().min(1); // OpenAPI/Swagger content or markdown table
  const section = createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
  return section;
};

// --- Architecture Section Schemas ---

const createCurrentArchitectureSchema = (docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  // Define the internal shape with optional subsections to allow for the refine logic.
  const internalShape = z
    .object({
      text: z.array(z.string()).optional(),
      dataModels: createDataModelsSchema('4.1.1', docType, byId),
      components: createComponentsSchema('4.1.2', docType, byId),
      dataFlow: createDataFlowSchema('4.1.3', docType, byId),
      controlFlow: createControlFlowSchema('4.1.4', docType, byId),
      integrationPoints: createIntegrationPointsSchema('4.1.5', docType, byId),
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
  const section = createSectionSchemaWithApplicability('4.1', docType, internalShape, highLevelDesignContent, byId);
  return section;
};

const createTargetArchitectureSchema = (docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  // Define the two valid shapes for the content
  const textOnlySchema = z
    .object({
      text: z.array(z.string()).min(1),
    })
    .strict();

  const subsectionsSchema = z
    .object({
      dataModels: createDataModelsSchema('4.2.1', docType, byId),
      components: createComponentsSchema('4.2.2', docType, byId),
      dataFlow: createDataFlowSchema('4.2.3', docType, byId),
      controlFlow: createControlFlowSchema('4.2.4', docType, byId),
      integrationPoints: createIntegrationPointsSchema('4.2.5', docType, byId),
      exposedAPI: createExposedAPISchema('4.2.6', docType, byId),
    })
    .strict();

  // The content must match one of these two shapes, or both
  const internalShape = z.union([textOnlySchema, subsectionsSchema, textOnlySchema.merge(subsectionsSchema)]);

  const section = createSectionSchemaWithApplicability('4.2', docType, internalShape, highLevelDesignContent, byId);
  return section;
};

const createTechStackDeploymentSchema = (docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(techStackItemSchema).min(1);
  const section = createSectionSchemaWithApplicability('4.3', docType, schema, highLevelDesignContent, byId);
  return section;
};

// Individual Non-Functional Requirements subsection factories
const createPerformanceSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(nonFunctionalRequirementSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createSecuritySchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(nonFunctionalRequirementSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createReliabilitySchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(nonFunctionalRequirementSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createPermissionModelSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(permissionRoleSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, highLevelDesignContent, byId);
};

const createNonFunctionalRequirementsSchema = (docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.object({
    performance: createPerformanceSchema('4.4.1', docType, byId),
    security: createSecuritySchema('4.4.2', docType, byId),
    reliability: createReliabilitySchema('4.4.3', docType, byId),
    permissionModel: createPermissionModelSchema('4.4.4', docType, byId),
  });
  const section = createSectionSchemaWithApplicability('4.4', docType, schema, highLevelDesignContent, byId);
  return section;
};

// --- Section Factory Map ---
const sectionFactories: Record<string, (docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny> = {
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
export const createHighLevelDesignSchema = (
  docType: DocumentType
): z.ZodObject<Record<string, z.ZodTypeAny>> & {
  __byId: Record<string, z.ZodTypeAny>;
} => {
  const familyShape: Record<string, z.ZodTypeAny> = {};
  const byId: Record<string, z.ZodTypeAny> = {};

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

    const schema = factory(docType, byId);

    // The factory for omitted sections returns z.never(), so we check for that
    if (schema instanceof z.ZodNever) {
      continue;
    }

    const sectionName = camelCase(section.name);
    familyShape[sectionName] = schema; // The factory already handles optionality
    // Also register top-level section IDs to byId index when available
    if (section.id) {
      registerSchema(byId, section.id, schema);
    }
  }

  const composed = z.object(familyShape).strict();
  // Attach non-enumerable index for consumers that need lookup
  Object.defineProperty(composed, '__byId', { value: byId, enumerable: false, configurable: false, writable: false });
  return composed as unknown as z.ZodObject<Record<string, z.ZodTypeAny>> & {
    __byId: Record<string, z.ZodTypeAny>;
  };
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

// Functions-only API; no constant or type exports
