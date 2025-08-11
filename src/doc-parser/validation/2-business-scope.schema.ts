import { z } from 'zod';
import { DocumentType, getApplicability, createSectionSchemaWithApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';
import { camelCase } from 'lodash-es';

const businessScopeContent = loadDDDSchemaJsonFile('2-business-scope.json');

// --- Section-Level Factory Functions ---

const createOverviewSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const overviewSchema = z.object({
    coreFunction: z.string().min(1),
    keyCapability: z.string().min(1),
    businessValue: z.string().min(1),
  });

  const schema = createSectionSchemaWithApplicability(sectionId, docType, overviewSchema, businessScopeContent, byId);
  return schema;
};

const createBusinessContextSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Business context cannot be empty or whitespace-only',
    });
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createUserJourneysSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const userJourneySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    diagram: z.string().min(1), // Mermaid diagram content
  });

  const schema = z.array(userJourneySchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createUserPersonasSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const userPersonaSchema = z.object({
    persona: z.string().min(1),
    goal: z.string().min(1),
  });

  const schema = z.array(userPersonaSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createCoreBusinessRulesSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createUserStoriesSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createSuccessCriteriaSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createDefinitionOfDoneSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const definitionOfDoneItemSchema = z.object({
    id: z.string().min(1), // e.g., "DoD-1"
    criterion: z.string().min(1),
  });

  const schema = z.array(definitionOfDoneItemSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createBoundariesAndScopeSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  // This is a container section, so we'll return a placeholder schema
  const schema = z.object({}).optional();
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createInScopeSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createOutOfScopeSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

const createCoreBusinessProcessesSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const businessProcessSchema = z.object({
    name: z.string().min(1),
    participants: z.string().min(1),
    goal: z.string().min(1),
    workflow: z.array(z.string().min(1)).min(1),
  });

  const schema = z.array(businessProcessSchema).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, businessScopeContent, byId);
};

// --- Section Factory Map ---
const sectionFactories: Record<
  string,
  (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny
> = {
  '2.1': createOverviewSchema,
  '2.2': createBusinessContextSchema,
  '2.2.1': createUserJourneysSchema,
  '2.2.2': createUserPersonasSchema,
  '2.2.3': createCoreBusinessRulesSchema,
  '2.2.4': createUserStoriesSchema,
  '2.3': createSuccessCriteriaSchema,
  '2.4': createDefinitionOfDoneSchema,
  '2.5': createBoundariesAndScopeSchema,
  '2.5.1': createInScopeSchema,
  '2.5.2': createOutOfScopeSchema,
  '2.6': createCoreBusinessProcessesSchema,
};

// --- Family-Level Factory Function ---

/**
 * Creates a fully composed Zod schema for the Business & Scope family
 * with byId registration for individual section access.
 *
 * @param docType - The document type ('plan' or 'task').
 * @returns A Zod schema for the Business & Scope family with byId index.
 */
export const createBusinessScopeSchema = (docType: DocumentType) => {
  const byId: Record<string, z.ZodTypeAny> = {};
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of businessScopeContent.sections) {
    // Skip template sections that are placeholders
    if (section.name.includes('[Name]')) {
      continue;
    }

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

    const schema = factory(section.id, docType, byId);
    const sectionName = camelCase(section.name);
    familyShape[sectionName] = applicability === 'optional' ? schema.optional() : schema;
  }

  const schema = z.object(familyShape).strict();

  // Add byId index to the schema
  (schema as any).__byId = byId;

  return schema;
};

// --- Convenience Functions for Backward Compatibility ---

/**
 * Creates a task-specific Business & Scope schema
 * @returns A Zod schema for task Business & Scope
 */
export const getBusinessScopeTaskSchema = () => createBusinessScopeSchema('task');

/**
 * Creates a plan-specific Business & Scope schema
 * @returns A Zod schema for plan Business & Scope
 */
export const getBusinessScopePlanSchema = () => createBusinessScopeSchema('plan');
