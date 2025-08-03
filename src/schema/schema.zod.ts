import { z } from 'zod';

// Define the applicability enum values
const Applicability = z.enum(['required', 'optional', 'omitted']);

// Define the applicability object schema
const SchemaApplicability = z.object({
  plan: Applicability,
  task: Applicability,
});

// Define the rendering control schema
const RenderingControl = z.object({
  renderAsCodeBlockForHuman: z.boolean(),
  renderAsCodeBlockForMachine: z.boolean(),
});

// Define content element types
const ContentElementType = z.enum(['text', 'list', 'table', 'codeblock', 'mermaid']);

// Define the content element schema with recursive support for children
const ContentElement: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: ContentElementType,
    content: z.string().optional(), // For text, table, codeblock, mermaid types
    items: z.array(z.string()).optional(), // For list type
    headers: z.array(z.string()).optional(), // For table type
    rows: z.array(z.array(z.string())).optional(), // For table type
    language: z.string().optional(), // For codeblock type
    diagramType: z.string().optional(), // For mermaid type
    rendering: RenderingControl,
    children: z.array(ContentElement).optional(),
  })
);

// Define heading structure schema
const HeadingStructure = z.object({
  type: z.literal('heading'),
  level: z.enum(['1', '2', '3', '4', '5', '6']).transform(Number),
  text: z.string(),
  id: z.string().optional(),
  required: z.boolean().optional(),
});

// Define text paragraph structure schema
const TextParagraphStructure = z.object({
  type: z.literal('text'),
  text: z.string(),
});

// Define table structure schema
const TableStructure = z.object({
  type: z.literal('table'),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

// Define bullet list structure schema
const BulletListStructure = z.object({
  type: z.literal('bulletlist'),
  items: z.array(z.string()),
});

// Define blockquote structure schema
const BlockquoteStructure = z.object({
  type: z.literal('blockquote'),
  content: z.array(z.union([TextParagraphStructure, BulletListStructure])),
});

// Define mermaid diagram structure schema
const MermaidDiagramStructure = z.object({
  type: z.literal('mermaid'),
  diagramType: z.enum(['erDiagram', 'classDiagram', 'sequenceDiagram', 'graph', 'flowchart']),
  content: z.string(),
});

// Define code block structure schema
const CodeBlockStructure = z.object({
  type: z.literal('codeblock'),
  language: z.string().optional(),
  content: z.string(),
  backticks: z.number().optional(), // Number of backticks to use (3 or 4)
});

// Define horizontal rule structure schema
const HorizontalRuleStructure = z.object({
  type: z.literal('hr'),
});

// Define section schema with recursive support
const Section: z.ZodType<any> = z.lazy(() =>
  z.object({
    title: HeadingStructure,
    content: z.array(
      z.union([
        TextParagraphStructure,
        TableStructure,
        HeadingStructure,
        BlockquoteStructure,
        BulletListStructure,
        MermaidDiagramStructure,
        CodeBlockStructure,
        HorizontalRuleStructure,
        Section,
      ])
    ),
  })
);

// Define document structures schema
const DocumentStructures = z.object({
  version: z.string(),
  elements: z.array(Section),
});

// Define the schema field schema
const SchemaField = z.object({
  name: z.string(),
  type: z.string(),
  applicability: SchemaApplicability,
  description: z.string(),
});

// Define the schema example schema
const SchemaExample = z.object({
  context: z.string(),
  content: z.array(ContentElement),
});

// Define the schema section schema
const SchemaSection = z.object({
  id: z.string(),
  name: z.string(),
  headingLevel: z.number(),
  description: z.string().optional(),
  contentFormat: z.string().optional(),
  reference: z.string().optional(),
  applicability: SchemaApplicability,
  notes: z.string().optional(),
  fields: z.array(SchemaField).optional(),
  examples: z.array(SchemaExample).optional(),
});

// Define the schema family schema (main schema)
const SchemaFamily = z.object({
  id: z.number(),
  name: z.string(),
  anchor: z.string(),
  primaryQuestion: z.string(),
  rationale: z.string(),
  applicability: SchemaApplicability,
  notes: z.string(),
  sections: z.array(SchemaSection),
});

// Export all schemas
export {
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
};
