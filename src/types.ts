/**
 * TypeScript types for Documentation Schema Structures
 * Generated from schema/structures.json
 */

export interface HeadingStructure {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id?: string;
  required?: boolean;
}

export interface TextParagraphStructure {
  type: 'text';
  text: string;
}

export interface TableStructure {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface BlockquoteStructure {
  type: 'blockquote';
  content: (TextParagraphStructure | BulletListStructure)[];
}

export interface BulletListStructure {
  type: 'bulletlist';
  items: string[];
}

export interface MermaidDiagramStructure {
  type: 'mermaid';
  diagramType: 'erDiagram' | 'classDiagram' | 'sequenceDiagram' | 'graph' | 'flowchart';
  content: string;
}

export interface CodeBlockStructure {
  type: 'codeblock';
  language?: string;
  content: string;
  backticks?: number; // Number of backticks to use (3 or 4)
}

export interface HorizontalRuleStructure {
  type: 'hr';
}

export type Section = {
  title: HeadingStructure;
  content: (
    | TextParagraphStructure
    | TableStructure
    | HeadingStructure
    | BlockquoteStructure
    | BulletListStructure
    | MermaidDiagramStructure
    | CodeBlockStructure
    | HorizontalRuleStructure
    | Section
  )[];
};

export interface DocumentStructures {
  version: string;
  elements: Section[];
}

/**
 * Rendering control for content elements
 */
export interface RenderingControl {
  renderAsCodeBlockForHuman: boolean; // true = show as code block, false = render normally
  renderAsCodeBlockForMachine: boolean; // true = show as code block, false = render normally
}

/**
 * Content element with rendering control
 */
export interface ContentElement {
  type: 'text' | 'list' | 'table' | 'codeblock' | 'mermaid';
  content?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  language?: string;
  diagramType?: string;
  rendering: RenderingControl;
  children?: ContentElement[]; // Support for nested content elements
}
