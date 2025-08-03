import { z } from 'zod';
import {
  SchemaFamily,
  SchemaSection,
  SchemaField,
  SchemaExample,
  ContentElement,
  RenderingControl,
  SchemaApplicability,
  Applicability,
  ContentElementType,
  // Document structure schemas
  HeadingStructure,
  TextParagraphStructure,
  TableStructure,
  BlockquoteStructure,
  BulletListStructure,
  MermaidDiagramStructure,
  CodeBlockStructure,
  HorizontalRuleStructure,
  Section,
  DocumentStructures,
} from './schema.zod.js';

// Export types inferred from Zod schemas
export type SchemaFamily = z.infer<typeof SchemaFamily>;
export type SchemaSection = z.infer<typeof SchemaSection>;
export type SchemaField = z.infer<typeof SchemaField>;
export type SchemaExample = z.infer<typeof SchemaExample>;
export type ContentElement = z.infer<typeof ContentElement>;
export type RenderingControl = z.infer<typeof RenderingControl>;
export type SchemaApplicability = z.infer<typeof SchemaApplicability>;
export type Applicability = z.infer<typeof Applicability>;
export type ContentElementType = z.infer<typeof ContentElementType>;

// Export document structure types inferred from Zod schemas
export type HeadingStructure = z.infer<typeof HeadingStructure>;
export type TextParagraphStructure = z.infer<typeof TextParagraphStructure>;
export type TableStructure = z.infer<typeof TableStructure>;
export type BlockquoteStructure = z.infer<typeof BlockquoteStructure>;
export type BulletListStructure = z.infer<typeof BulletListStructure>;
export type MermaidDiagramStructure = z.infer<typeof MermaidDiagramStructure>;
export type CodeBlockStructure = z.infer<typeof CodeBlockStructure>;
export type HorizontalRuleStructure = z.infer<typeof HorizontalRuleStructure>;
export type Section = z.infer<typeof Section>;
export type DocumentStructures = z.infer<typeof DocumentStructures>;
