import { z } from 'zod';
import { camelCase } from 'lodash-es';
import { DocumentType, createSectionSchemaWithApplicability, getApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';

const referenceContent = loadDDDSchemaJsonFile('8-reference.json');

// Glossary item schema
const GlossaryItemSchema = z.object({
  term: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Term cannot be empty or whitespace-only',
    }),
  definition: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Definition cannot be empty or whitespace-only',
    }),
});

// Appendix item schema
const AppendixItemSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Title cannot be empty or whitespace-only',
    }),
  content: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Content cannot be empty or whitespace-only',
    }),
});

// Appendices/Glossary schema - optional section for supplementary information
const AppendicesGlossarySchema = z
  .object({
    glossary: z.array(GlossaryItemSchema).optional(),
    appendices: z.array(AppendixItemSchema).optional(),
  })
  .refine(
    (data) => {
      // If both fields are present, both must be non-empty
      // If only one field is present, it must be non-empty
      const hasGlossary = data.glossary !== undefined;
      const hasAppendices = data.appendices !== undefined;
      const hasValidGlossary = data.glossary && data.glossary.length > 0;
      const hasValidAppendices = data.appendices && data.appendices.length > 0;

      if (hasGlossary && hasAppendices) {
        // Both fields present - both must be valid
        return hasValidGlossary && hasValidAppendices;
      } else if (hasGlossary) {
        // Only glossary present - must be valid
        return hasValidGlossary;
      } else if (hasAppendices) {
        // Only appendices present - must be valid
        return hasValidAppendices;
      } else {
        // Neither present - invalid
        return false;
      }
    },
    {
      message:
        'If both glossary and appendices are present, both must be non-empty. If only one is present, it must be non-empty.',
    }
  );

// --- Section-Level Factory Function ---

// 8.1 Appendices/Glossary (Plan: optional, Task: optional)
const createAppendicesGlossarySchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = AppendicesGlossarySchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, referenceContent, byId);
};

// --- Section Factory Map ---
const sectionFactories: Record<
  string,
  (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny
> = {
  '8.1': createAppendicesGlossarySchema,
};

// --- Family-Level Factory Function ---

export const createReferenceSchema = (docType: DocumentType) => {
  const byId: Record<string, z.ZodTypeAny> = {};
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of referenceContent.sections) {
    const factory = sectionFactories[section.id];
    if (!factory) {
      throw new Error(
        `Schema mismatch: No factory found for section ID "${section.id}" (${section.name}). This indicates a mismatch between the schema definition and JSON files.`
      );
    }

    const schema = factory(section.id, docType, byId);
    if (schema instanceof z.ZodNever) {
      continue;
    }

    const sectionName = camelCase(section.name);
    familyShape[sectionName] = schema; // optionality handled within factories
  }

  const schema = z.object(familyShape).strict();

  // Add byId index to the schema
  (schema as any).__byId = byId;

  return schema;
};

// --- Convenience Functions ---
export const getReferencePlanSchema = () => createReferenceSchema('plan');
export const getReferenceTaskSchema = () => createReferenceSchema('task');
