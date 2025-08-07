import { z } from 'zod';
import {
  PriorityLevel,
  StatusKey,
  DateTimeString,
  DocumentType,
  getApplicability,
  PriorityDriver,
  createSectionSchemaWithApplicability,
} from './shared.schema.js';
import { camelCase } from 'lodash-es';
import { loadDDDSchemaJsonFile } from '../../index.js';

const metaGovernanceContent = loadDDDSchemaJsonFile('1-meta.json');

// --- Field-Level Schema Definitions ---

const statusFieldSchemas = {
  created: DateTimeString,
  lastUpdated: DateTimeString,
  currentState: StatusKey,
  priority: PriorityLevel,
  progress: z.number().min(0).max(100),
  planningEstimate: z.number().min(0),
  estVariancePts: z.number(), // Fixed: match the actual camelCase conversion
  implementationStarted: DateTimeString.optional(),
  completed: DateTimeString.optional(),
};

// --- Section-Level Factory Functions ---

const createStatusSchema = (docType: DocumentType) => {
  const sectionDef = metaGovernanceContent.sections.find((s: any) => s.id === '1.2');
  if (!sectionDef || !sectionDef.fields) {
    throw new Error("Section 'Status' or its fields not found in 1-meta.json");
  }

  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of sectionDef.fields) {
    const applicability = getApplicability(field.applicability, docType);
    if (applicability !== 'omitted') {
      const fieldName = camelCase(field.name);
      const fieldSchema = (statusFieldSchemas as any)[fieldName];
      if (fieldSchema) {
        shape[fieldName] = applicability === 'optional' ? fieldSchema.optional() : fieldSchema;
      } else {
        throw new Error(
          `Schema mismatch: No schema found for field "${fieldName}" (original: "${field.name}") in Status section. This indicates a mismatch between the schema definition and JSON files.`
        );
      }
    }
  }

  return z.object(shape).strict();
};

const createPriorityDriversSchema = (docType: DocumentType) => {
  // Priority drivers are now validated against the canonical enum from ddd-2.md
  const schema = z.array(PriorityDriver).min(1);
  return createSectionSchemaWithApplicability('1.3', docType, schema, metaGovernanceContent);
};

// --- Section Factory Map ---
const sectionFactories: Record<string, (docType: DocumentType) => z.ZodTypeAny> = {
  '1.2': createStatusSchema,
  '1.3': createPriorityDriversSchema,
};

// --- Family-Level Factory Function ---

/**
 * Creates a fully composed Zod schema for the Meta & Governance family
 * by iterating through the JSON definition and using a factory map.
 *
 * @param docType - The document type ('plan' or 'task').
 * @returns A Zod schema for the Meta & Governance family.
 */
export const createMetaGovernanceSchema = (docType: DocumentType) => {
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of metaGovernanceContent.sections) {
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
 * Creates a task-specific Meta & Governance schema
 * @returns A Zod schema for task Meta & Governance
 */
export const getMetaGovernanceTaskSchema = () => createMetaGovernanceSchema('task');

/**
 * Creates a plan-specific Meta & Governance schema
 * @returns A Zod schema for plan Meta & Governance
 */
export const getMetaGovernancePlanSchema = () => createMetaGovernanceSchema('plan');

// Export the factory and inferred type
export type MetaGovernanceFamily = z.infer<ReturnType<typeof createMetaGovernanceSchema>>;
