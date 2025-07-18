/**
 * TypeScript types for Documentation Schema Structures
 * Generated from schema/structures.json
 */

export interface HeadingStructure {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
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

export type Section = {
  title: HeadingStructure;
  content: (
    | TextParagraphStructure
    | TableStructure
    | HeadingStructure
    | BlockquoteStructure
    | BulletListStructure
    | Section
  )[];
};

export interface DocumentStructures {
  version: string;
  elements: Section[];
}
