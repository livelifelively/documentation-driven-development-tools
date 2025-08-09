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

// ---- Section-level factories with applicability wrappers ----

const createImplementationPlanSection = (docType: DocumentType) =>
  createSectionSchemaWithApplicability('6.1', docType, ImplementationPlanSchema, implementationGuidanceContent);

const createImplementationLogStepsSection = (docType: DocumentType) =>
  // JSON has duplicate id "6.1" for Log/Steps; disambiguate by name when iterating
  createSectionSchemaWithApplicability('6.1', docType, ImplementationLogStepsSchema, implementationGuidanceContent);

const createInitialSituationSection = (docType: DocumentType) =>
  createSectionSchemaWithApplicability('6.1.1', docType, InitialSituationSchema, implementationGuidanceContent);

const createFilesChangeLogSection = (docType: DocumentType) =>
  createSectionSchemaWithApplicability('6.1.2', docType, FilesChangeLogSchema, implementationGuidanceContent);

const createPromptsSection = (docType: DocumentType) =>
  createSectionSchemaWithApplicability('6.2', docType, PromptsSchema, implementationGuidanceContent);

// Resolve factory for a given section definition from JSON
const getSectionFactory = (section: { id: string; name: string }) => {
  if (section.id === '6.1') {
    return section.name.toLowerCase().includes('log')
      ? createImplementationLogStepsSection
      : createImplementationPlanSection;
  }
  switch (section.id) {
    case '6.1.1':
      return createInitialSituationSection;
    case '6.1.2':
      return createFilesChangeLogSection;
    case '6.2':
      return createPromptsSection;
    default:
      return undefined;
  }
};

// Family-level factory following established pattern
export const createImplementationGuidanceSchema = (docType: DocumentType) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const section of implementationGuidanceContent.sections) {
    const applicability = getApplicability(section.applicability, docType);
    if (applicability === 'omitted') continue;

    const factory = getSectionFactory(section);
    if (!factory) {
      throw new Error(`Schema mismatch: No factory found for section ID "${section.id}" (${section.name}).`);
    }

    const base = factory(docType);
    const key = camelCase(section.name);
    shape[key] = applicability === 'optional' ? base.optional() : base;
  }

  return z.object(shape).strict();
};

// Convenience doc-type specific schemas
export const getImplementationGuidancePlanSchema = () => createImplementationGuidanceSchema('plan');
export const getImplementationGuidanceTaskSchema = () => createImplementationGuidanceSchema('task');

// Functions-only API; no constant or type exports
