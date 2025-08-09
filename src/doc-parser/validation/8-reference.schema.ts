import { z } from 'zod';
import { camelCase } from 'lodash-es';
import { DocumentType, createSectionSchemaWithApplicability, getApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';

const referenceContent = loadDDDSchemaJsonFile('8-reference.json');

// Glossary item schema
const GlossaryItemSchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
});

// Appendix item schema
const AppendixItemSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

// Appendices/Glossary schema - optional section for supplementary information
const AppendicesGlossarySchema = z
  .object({
    glossary: z.array(GlossaryItemSchema).optional(),
    appendices: z.array(AppendixItemSchema).optional(),
  })
  .refine(
    (data) => {
      // At least one of glossary or appendices should be present
      return (data.glossary && data.glossary.length > 0) || (data.appendices && data.appendices.length > 0);
    },
    {
      message: 'At least one of glossary or appendices must be present and non-empty',
    }
  );

// Functions-only API; no constant family export

// JSON-driven section factory
const createAppendicesGlossarySection = (docType: DocumentType) =>
  createSectionSchemaWithApplicability('8.1', docType, AppendicesGlossarySchema, referenceContent);

// Family-level factory following established pattern
export const createReferenceSchema = (docType: DocumentType) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const section of referenceContent.sections) {
    const applicability = getApplicability(section.applicability, docType);
    if (applicability === 'omitted') continue;

    if (section.id !== '8.1') {
      throw new Error(`Schema mismatch: No factory found for section ID "${section.id}" (${section.name}).`);
    }

    const base = createAppendicesGlossarySection(docType);
    const key = camelCase(section.name); // "Appendices/Glossary" -> "appendicesGlossary"
    shape[key] = applicability === 'optional' ? base.optional() : base;
  }

  return z.object(shape).strict();
};

export const getReferencePlanSchema = () => createReferenceSchema('plan');
export const getReferenceTaskSchema = () => createReferenceSchema('task');
