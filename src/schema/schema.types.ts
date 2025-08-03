import { z } from 'zod';
import {
  SchemaFamilySchema,
  SchemaSectionSchema,
  SchemaFieldSchema,
  SchemaExampleSchema,
  ContentElementSchema,
  RenderingControlSchema,
  ApplicabilitySchema,
  ApplicabilityValueSchema,
  ContentElementTypeSchema,
} from './schema.zod.js';

// Export types inferred from Zod schemas
export type SchemaFamily = z.infer<typeof SchemaFamilySchema>;
export type SchemaSection = z.infer<typeof SchemaSectionSchema>;
export type SchemaField = z.infer<typeof SchemaFieldSchema>;
export type SchemaExample = z.infer<typeof SchemaExampleSchema>;
export type ContentElement = z.infer<typeof ContentElementSchema>;
export type RenderingControl = z.infer<typeof RenderingControlSchema>;
export type Applicability = z.infer<typeof ApplicabilitySchema>;
export type ApplicabilityValue = z.infer<typeof ApplicabilityValueSchema>;
export type ContentElementType = z.infer<typeof ContentElementTypeSchema>;
