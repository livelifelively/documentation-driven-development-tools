import {
  HeadingStructure,
  TextParagraphStructure,
  TableStructure,
  BlockquoteStructure,
  BulletListStructure,
  DocumentStructures,
  Section,
} from './types';

const documentTitle: HeadingStructure = {
  type: 'heading',
  level: 1,
  text: 'Documentation Schema',
};

const documentDescription: TextParagraphStructure = {
  type: 'text',
  text: 'This file defines **which information appears where** in our Documentation-Driven Development (DDD) hierarchy and **why**. Use it as the canonical source when updating templates or building automation.',
};

const legendHeading: HeadingStructure = {
  type: 'heading',
  level: 2,
  text: 'Legend',
};

const legendTable: TableStructure = {
  type: 'table',
  headers: ['Symbol', 'Meaning'],
  rows: [
    ['✅', 'Required'],
    ['❓', 'Optional (recommended)'],
    ['➖', 'Not applicable / omit'],
  ],
};

const legendNote: BlockquoteStructure = {
  type: 'blockquote',
  content: [
    {
      type: 'text',
      text: '**Note on Usage in Document Headings:** In addition to their meaning in the schema tables below, these icons are used in the headings of the actual `*.md` files to indicate the **completion status** of a section.',
    },
    {
      type: 'bulletlist',
      items: [
        '`## ✅ [Section Name]`: Indicates the section is considered **complete**.',
        '`## ❓ [Section Name]`: Indicates the section is **incomplete, a placeholder, or needs review**.',
        '`## ➖ [Section Name]`: Indicates the section is **not applicable** and has been intentionally omitted.',
      ],
    },
  ],
};

const legendSection: Section = {
  title: legendHeading,
  content: [legendTable, legendNote],
};

const familyIndexHeading: HeadingStructure = {
  type: 'heading',
  level: 2,
  text: 'Family Index',
};

const familyIndexTable: TableStructure = {
  type: 'table',
  headers: ['#', 'Family (Anchor)', 'Primary Question Answered', 'Plan', 'Task'],
  rows: [
    [
      '1',
      '[Meta & Governance](#meta--governance)',
      'How critical is this work, what is its current status?',
      '✅',
      '✅',
    ],
    ['2', '[Business & Scope](#business--scope)', 'Why are we doing this?', '✅', '✅'],
    ['3', '[Planning & Decomposition](#planning--decomposition)', 'What are we building, in what order?', '✅', '❓'],
    [
      '4',
      '[High-Level Design](#high-level-design)',
      'What are the high-level components and interactions? (Black-Box)',
      '✅',
      '✅',
    ],
    [
      '5',
      '[Maintenance and Monitoring](#maintenance-and-monitoring)',
      'What are the internal details needed to build it? (White-Box)',
      '✅',
      '✅',
    ],
    ['6', '[Implementation Guidance](#implementation--guidance)', 'What are the practical steps?', '✅', '✅'],
    ['7', '[Quality & Operations](#quality--operations)', 'How do we validate & run it?', '✅', '✅'],
    ['8', '[Reference](#reference)', 'What other info might we need?', '❓', '❓'],
  ],
};

const familyIndexNote: TextParagraphStructure = {
  type: 'text',
  text: 'Each plan document now begins with a **family heading** (`## Business & Scope`, etc.). An artefact includes a family only if it has relevant content; otherwise the heading may read `None (inherits from parent)`.',
};

const familyIndexSection: Section = {
  title: familyIndexHeading,
  content: [familyIndexTable, familyIndexNote],
};

const contextInheritanceHeading: HeadingStructure = {
  type: 'heading',
  level: 2,
  text: 'Context Inheritance Protocol',
};

const contextInheritanceDescription: TextParagraphStructure = {
  type: 'text',
  text: 'The Plan/Task hierarchy is not just an organizational tool; it is a strict protocol for context inheritance. To correctly interpret any document, it is **mandatory** to have first processed its parent.',
};

const contextInheritanceList: BulletListStructure = {
  type: 'bulletlist',
  items: [
    'To understand a **sub-Plan**, you must first read its **parent Plan**.',
    'To understand a **Task**, you must first read its **parent Plan** (and any parent Plans above it).',
  ],
};

const contextInheritanceFooter: TextParagraphStructure = {
  type: 'text',
  text: 'This top-down traversal is the only way to gather the complete context required for implementation, as information is progressively narrowed and not repeated at lower levels. Automated tools and LLMs **MUST** enforce this reading order.',
};

const contextInheritanceSection: Section = {
  title: contextInheritanceHeading,
  content: [contextInheritanceDescription, contextInheritanceList, contextInheritanceFooter],
};

const documentSection: Section = {
  title: documentTitle,
  content: [documentDescription, legendSection, familyIndexSection, contextInheritanceSection],
};

export const document: DocumentStructures = {
  version: '1.0.0',
  elements: [documentSection],
};
