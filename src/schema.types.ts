import { ContentElement } from './types.js';

// ================================================================================
// Canonical DDD Schema Definitions
// ================================================================================

export type Applicability = 'required' | 'optional' | 'omitted';

export interface SchemaApplicability {
  plan: Applicability;
  task: Applicability;
}

export interface SchemaExample {
  context: string;
  content: ContentElement[];
}

export interface SchemaField {
  name: string;
  type: string;
  description: string;
  applicability: SchemaApplicability;
}

export interface StructuredExampleContent {
  type: 'structured';
  elements: (
    | { type: 'text'; content: string }
    | { type: 'list'; items: string[] }
    | { type: 'table'; headers: string[]; rows: string[][] }
    | { type: 'codeblock'; language?: string; content: string }
    | { type: 'mermaid'; diagramType: string; content: string }
  )[];
}

export interface SchemaSection {
  id: string;
  name: string;
  headingLevel: number;
  description?: string;
  contentFormat?: string;
  reference?: string;
  applicability: SchemaApplicability;
  notes?: string;
  fields?: SchemaField[];
  examples?: SchemaExample[];
}

export interface SchemaFamily {
  id: number;
  name: string;
  anchor: string;
  primaryQuestion: string;
  rationale: string;
  applicability: SchemaApplicability;
  notes: string;
  sections: SchemaSection[];
}
