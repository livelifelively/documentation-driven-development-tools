import { z } from 'zod';
import { camelCase } from 'lodash-es';
import { DocumentType, getApplicability, createSectionSchemaWithApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';

const implementationGuidanceContent = loadDDDSchemaJsonFile('6-implementation-guidance.json');

// Implementation Plan schema - Markdown list for Plans
const ImplementationPlanSchema = z.array(z.string().min(1)).min(1);

// Implementation Log/Steps schema - Markdown list for Tasks
const ImplementationLogStepsSchema = z.array(z.string().min(1)).min(1);

// Initial Situation schema - Text description for Tasks
const InitialSituationSchema = z
  .string()
  .min(1)
  .refine((val) => val.trim().length > 0, { message: 'Initial situation cannot be only whitespace' });

// Files Change Log schema - Text description for Tasks
const FilesChangeLogSchema = z
  .string()
  .min(1)
  .refine((val) => val.trim().length > 0, { message: 'Files change log cannot be only whitespace' });

// Prompts schema - Code blocks for LLM reuse
const PromptsSchema = z
  .array(
    z.object({
      description: z.string().min(1),
      code: z.string().min(1),
      language: z.string().min(1).optional(), // e.g., "typescript", "bash", etc.
    })
  )
  .min(1);

// ---- Section-Level Factory Functions ----

const createImplementationPlanSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = ImplementationPlanSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, implementationGuidanceContent, byId);
};

const createImplementationLogStepsSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = ImplementationLogStepsSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, implementationGuidanceContent, byId);
};

const createInitialSituationSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = InitialSituationSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, implementationGuidanceContent, byId);
};

const createFilesChangeLogSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = FilesChangeLogSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, implementationGuidanceContent, byId);
};

const createPromptsSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = PromptsSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, implementationGuidanceContent, byId);
};

// ---- Section Factory Map ----
const sectionFactories: Record<
  string,
  (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny
> = {
  '6.1.1': createInitialSituationSchema,
  '6.1.2': createFilesChangeLogSchema,
  '6.2': createPromptsSchema,
};

// ---- Family-Level Factory Function ----

export const createImplementationGuidanceSchema = (docType: DocumentType) => {
  const byId: Record<string, z.ZodTypeAny> = {};
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of implementationGuidanceContent.sections) {
    const applicability = getApplicability(section.applicability, docType);
    if (applicability === 'omitted') {
      continue;
    }

    let factory:
      | ((sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny)
      | undefined;

    // Handle duplicate section ID 6.1 by checking the section name
    if (section.id === '6.1') {
      if (section.name.toLowerCase().includes('log') || section.name.toLowerCase().includes('steps')) {
        factory = createImplementationLogStepsSchema;
      } else {
        factory = createImplementationPlanSchema;
      }
    } else {
      factory = sectionFactories[section.id];
    }

    if (!factory) {
      throw new Error(
        `Schema mismatch: No factory found for section ID "${section.id}" (${section.name}). This indicates a mismatch between the schema definition and JSON files.`
      );
    }

    const schema = factory(section.id, docType, byId);
    const sectionName = camelCase(section.name);
    familyShape[sectionName] = applicability === 'optional' ? schema.optional() : schema;
  }

  const schema = z.object(familyShape).strict();

  // Add byId index to the schema
  (schema as any).__byId = byId;

  return schema;
};

// ---- Convenience Functions ----

export const getImplementationGuidancePlanSchema = () => createImplementationGuidanceSchema('plan');
export const getImplementationGuidanceTaskSchema = () => createImplementationGuidanceSchema('task');
