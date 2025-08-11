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

// --- Individual Section Factory Functions ---

const createStatusSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
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

  const schema = z.object(shape).strict();
  return createSectionSchemaWithApplicability(sectionId, docType, schema, metaGovernanceContent, byId);
};

const createPriorityDriversSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  // Priority drivers are now validated against the canonical enum from ddd-2.md
  const schema = z.array(PriorityDriver).min(1);
  return createSectionSchemaWithApplicability(sectionId, docType, schema, metaGovernanceContent, byId);
};

// --- Family-Level Factory Function ---

/**
 * Creates a fully composed Zod schema for the Meta & Governance family
 * with byId registration for individual section access.
 *
 * @param docType - The document type ('plan' or 'task').
 * @returns A Zod schema for the Meta & Governance family with byId index.
 */
export const createMetaGovernanceSchema = (docType: DocumentType) => {
  const byId: Record<string, z.ZodTypeAny> = {};
  const familyShape: Record<string, z.ZodTypeAny> = {};

  // Create Status section (1.2)
  const statusSchema = createStatusSchema('1.2', docType, byId);
  const statusApplicability = getApplicability(
    metaGovernanceContent.sections.find((s: any) => s.id === '1.2')?.applicability,
    docType
  );
  if (statusApplicability !== 'omitted') {
    familyShape.status = statusApplicability === 'optional' ? statusSchema.optional() : statusSchema;
  }

  // Create Priority Drivers section (1.3)
  const priorityDriversSchema = createPriorityDriversSchema('1.3', docType, byId);
  const priorityDriversApplicability = getApplicability(
    metaGovernanceContent.sections.find((s: any) => s.id === '1.3')?.applicability,
    docType
  );
  if (priorityDriversApplicability !== 'omitted') {
    familyShape.priorityDrivers =
      priorityDriversApplicability === 'optional' ? priorityDriversSchema.optional() : priorityDriversSchema;
  }

  const schema = z.object(familyShape).strict();

  // Add byId index to the schema
  (schema as any).__byId = byId;

  return schema;
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
