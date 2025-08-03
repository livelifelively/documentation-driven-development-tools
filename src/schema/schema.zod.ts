import { z } from 'zod';

// Define the applicability enum values
const ApplicabilityValueSchema = z.enum(['required', 'optional', 'omitted']);

// Define the applicability object schema
const ApplicabilitySchema = z.object({
  plan: ApplicabilityValueSchema,
  task: ApplicabilityValueSchema,
});

// Define the rendering control schema
const RenderingControlSchema = z.object({
  renderAsCodeBlockForHuman: z.boolean(),
  renderAsCodeBlockForMachine: z.boolean(),
});

// Define content element types
const ContentElementTypeSchema = z.enum(['text', 'list', 'table', 'codeblock', 'mermaid']);

// Define the content element schema with recursive support for children
const ContentElementSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: ContentElementTypeSchema,
    content: z.string().optional(), // For text type
    items: z.array(z.string()).optional(), // For list type
    rendering: RenderingControlSchema,
    children: z.array(ContentElementSchema).optional(),
  })
);

// Define the schema field schema
const SchemaFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  applicability: ApplicabilitySchema,
  description: z.string(),
});

// Define the schema example schema
const SchemaExampleSchema = z.object({
  context: z.string(),
  content: z.array(ContentElementSchema),
});

// Define the schema section schema
const SchemaSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  headingLevel: z.number(),
  description: z.string().optional(),
  contentFormat: z.string().optional(),
  reference: z.string().optional(),
  applicability: ApplicabilitySchema,
  notes: z.string().optional(),
  fields: z.array(SchemaFieldSchema).optional(),
  examples: z.array(SchemaExampleSchema).optional(),
});

// Define the schema family schema (main schema)
const SchemaFamilySchema = z.object({
  id: z.number(),
  name: z.string(),
  anchor: z.string(),
  primaryQuestion: z.string(),
  rationale: z.string(),
  applicability: ApplicabilitySchema,
  notes: z.string(),
  sections: z.array(SchemaSectionSchema),
});

// Export all schemas
export {
  SchemaFamilySchema,
  SchemaSectionSchema,
  SchemaFieldSchema,
  SchemaExampleSchema,
  ContentElementSchema,
  RenderingControlSchema,
  ApplicabilitySchema,
  ApplicabilityValueSchema,
  ContentElementTypeSchema,
};
