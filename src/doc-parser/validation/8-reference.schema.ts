import { z } from 'zod';

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

// Reference family schema - optional family for supplementary information
export const ReferenceFamilySchema = z.object({
  appendicesGlossary: AppendicesGlossarySchema.optional(),
});

// Export individual schemas for specific use cases
export { AppendicesGlossarySchema, GlossaryItemSchema, AppendixItemSchema };

// Export types
export type ReferenceFamily = z.infer<typeof ReferenceFamilySchema>;
export type AppendicesGlossary = z.infer<typeof AppendicesGlossarySchema>;
export type GlossaryItem = z.infer<typeof GlossaryItemSchema>;
export type AppendixItem = z.infer<typeof AppendixItemSchema>;
