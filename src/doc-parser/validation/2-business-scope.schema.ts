import { z } from 'zod';
import { DocumentType, getApplicability, createSectionSchemaWithApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';
import { camelCase } from 'lodash-es';

const businessScopeContent = loadDDDSchemaJsonFile('2-business-scope.json');

// --- Section-Level Factory Functions ---

const createOverviewSchema = (docType: DocumentType) => {
  const overviewSchema = z.object({
    coreFunction: z.string().min(1),
    keyCapability: z.string().min(1),
    businessValue: z.string().min(1),
  });

  return createSectionSchemaWithApplicability('2.1', docType, overviewSchema, businessScopeContent);
};

const createBusinessContextSchema = (docType: DocumentType) => {
  const schema = z.string().min(1);
  return createSectionSchemaWithApplicability('2.2', docType, schema, businessScopeContent);
};

const createUserJourneysSchema = (docType: DocumentType) => {
  const userJourneySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    diagram: z.string().min(1), // Mermaid diagram content
  });

  const schema = z.array(userJourneySchema).min(1);
  return createSectionSchemaWithApplicability('2.2.1', docType, schema, businessScopeContent);
};

const createUserPersonasSchema = (docType: DocumentType) => {
  const userPersonaSchema = z.object({
    persona: z.string().min(1),
    goal: z.string().min(1),
  });

  const schema = z.array(userPersonaSchema).min(1);
  return createSectionSchemaWithApplicability('2.2.2', docType, schema, businessScopeContent);
};

const createCoreBusinessRulesSchema = (docType: DocumentType) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability('2.2.3', docType, schema, businessScopeContent);
};

const createUserStoriesSchema = (docType: DocumentType) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability('2.2.4', docType, schema, businessScopeContent);
};

const createSuccessCriteriaSchema = (docType: DocumentType) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability('2.3', docType, schema, businessScopeContent);
};

const createDefinitionOfDoneSchema = (docType: DocumentType) => {
  const definitionOfDoneItemSchema = z.object({
    id: z.string().min(1), // e.g., "DoD-1"
    criterion: z.string().min(1),
  });

  const schema = z.array(definitionOfDoneItemSchema).min(1);
  return createSectionSchemaWithApplicability('2.4', docType, schema, businessScopeContent);
};

const createBoundariesAndScopeSchema = (docType: DocumentType) => {
  // This is a container section, so we'll return a placeholder schema
  const schema = z.object({}).optional();
  return createSectionSchemaWithApplicability('2.5', docType, schema, businessScopeContent);
};

const createInScopeSchema = (docType: DocumentType) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability('2.5.1', docType, schema, businessScopeContent);
};

const createOutOfScopeSchema = (docType: DocumentType) => {
  const schema = z.array(z.string().min(1)).min(1);
  return createSectionSchemaWithApplicability('2.5.2', docType, schema, businessScopeContent);
};

const createCoreBusinessProcessesSchema = (docType: DocumentType) => {
  const businessProcessSchema = z.object({
    name: z.string().min(1),
    participants: z.string().min(1),
    goal: z.string().min(1),
    workflow: z.array(z.string().min(1)).min(1),
  });

  const schema = z.array(businessProcessSchema).min(1);
  return createSectionSchemaWithApplicability('2.6', docType, schema, businessScopeContent);
};

// --- Section Factory Map ---
const sectionFactories: Record<string, (docType: DocumentType) => z.ZodTypeAny> = {
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
 * by iterating through the JSON definition and using a factory map.
 *
 * @param docType - The document type ('plan' or 'task').
 * @returns A Zod schema for the Business & Scope family.
 */
export const createBusinessScopeSchema = (docType: DocumentType) => {
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

    const schema = factory(docType);
    const sectionName = camelCase(section.name);
    familyShape[sectionName] = applicability === 'optional' ? schema.optional() : schema;
  }

  return z.object(familyShape).strict();
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

// Export types
export type BusinessScopeFamily = z.infer<ReturnType<typeof createBusinessScopeSchema>>;

// --- Static Schema Exports for Backward Compatibility ---
// These are used by tests that expect static schemas

// --- Plan-Specific Schema Exports ---

export const BusinessScopeFamilyPlanSchema = createBusinessScopeSchema('plan');

// Individual section schemas for testing
export const OverviewPlanSchema = createOverviewSchema('plan');
export const BusinessContextPlanSchema = createBusinessContextSchema('plan');
export const UserJourneyPlanSchema = createUserJourneysSchema('plan');
export const UserPersonasPlanSchema = createUserPersonasSchema('plan');
export const CoreBusinessRulesPlanSchema = createCoreBusinessRulesSchema('plan');
export const UserStoriesPlanSchema = createUserStoriesSchema('plan');
export const SuccessCriteriaPlanSchema = createSuccessCriteriaSchema('plan');
export const DefinitionOfDonePlanSchema = createDefinitionOfDoneSchema('plan');
export const InScopePlanSchema = createInScopeSchema('plan');
export const OutOfScopePlanSchema = createOutOfScopeSchema('plan');
export const BusinessProcessPlanSchema = createCoreBusinessProcessesSchema('plan');

// --- Task-Specific Schema Exports ---

export const BusinessScopeFamilyTaskSchema = createBusinessScopeSchema('task');
export const OverviewTaskSchema = createOverviewSchema('task');
export const BusinessContextTaskSchema = createBusinessContextSchema('task');
export const UserJourneyTaskSchema = createUserJourneysSchema('task');
export const UserPersonasTaskSchema = createUserPersonasSchema('task');
export const CoreBusinessRulesTaskSchema = createCoreBusinessRulesSchema('task');
export const UserStoriesTaskSchema = createUserStoriesSchema('task');
export const SuccessCriteriaTaskSchema = createSuccessCriteriaSchema('task');
export const DefinitionOfDoneTaskSchema = createDefinitionOfDoneSchema('task');
export const InScopeTaskSchema = createInScopeSchema('task');
export const OutOfScopeTaskSchema = createOutOfScopeSchema('task');
export const BusinessProcessTaskSchema = createCoreBusinessProcessesSchema('task');
