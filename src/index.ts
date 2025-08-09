import { loadJsonFromModuleDir } from './utils/file-utils.js';

export function loadDDDSchemaJsonFile(filename: string) {
  return loadJsonFromModuleDir(import.meta.url, `./schema/ddd-schema-json/${filename}`);
}

const family1 = loadDDDSchemaJsonFile('1-meta.json');
const family2 = loadDDDSchemaJsonFile('2-business-scope.json');
const family3 = loadDDDSchemaJsonFile('3-planning-decomposition.json');
const family4 = loadDDDSchemaJsonFile('4-high-level-design.json');
const family5 = loadDDDSchemaJsonFile('5-maintenance-monitoring.json');
const family6 = loadDDDSchemaJsonFile('6-implementation-guidance.json');
const family7 = loadDDDSchemaJsonFile('7-quality-operations.json');
const family8 = loadDDDSchemaJsonFile('8-reference.json');
const contextExamples = loadDDDSchemaJsonFile('context-examples.json');

import { TODO_PLACEHOLDER_TEXT } from './config.js';
import {
  DocumentStructures,
  Section,
  HeadingStructure,
  TextParagraphStructure,
  TableStructure,
  BlockquoteStructure,
  BulletListStructure,
  CodeBlockStructure,
  ContentElement,
} from './types.js';

import { SchemaFamily } from './schema/schema.types.js';

// Assemble the full schema - Adding family1 for testing
export const fullSchema: SchemaFamily[] = [
  family1 as unknown as SchemaFamily,
  family2 as unknown as SchemaFamily,
  family3 as unknown as SchemaFamily,
  family4 as unknown as SchemaFamily,
  family5 as unknown as SchemaFamily,
  family6 as unknown as SchemaFamily,
  family7 as unknown as SchemaFamily,
  family8 as unknown as SchemaFamily,
];

/**
 * Converts applicability to a symbol.
 */
export function getApplicabilitySymbol(applicability: 'required' | 'optional' | 'omitted'): string {
  switch (applicability) {
    case 'required':
      return '✅';
    case 'optional':
      return '❓';
    case 'omitted':
      return '➖';
    default:
      return '❓';
  }
}

/**
 * Renders a content element based on its type and rendering control
 */
export function renderContentElement(element: ContentElement, mode: 'human' | 'machine'): any {
  const shouldRenderAsCodeBlock =
    mode === 'human' ? element.rendering.renderAsCodeBlockForHuman : element.rendering.renderAsCodeBlockForMachine;

  // If should render as code block, convert to markdown code block
  if (shouldRenderAsCodeBlock) {
    let codeContent = '';

    switch (element.type) {
      case 'text':
        codeContent = element.content || '';
        // If there are children, add them to the code block
        if (element.children && element.children.length > 0) {
          codeContent += '\n';
          element.children.forEach((child) => {
            const childCode = renderContentElement(child, mode);
            if (childCode.type === 'codeblock') {
              // For Mermaid diagrams, preserve the backticks so they render properly within the parent code block
              if (child.type === 'mermaid') {
                codeContent += `\`\`\`mermaid\n${childCode.content}\n\`\`\`\n`;
              } else {
                // Extract content from other child code blocks and add it directly
                codeContent += childCode.content + '\n';
              }
            } else {
              // Convert child to markdown string using existing renderContent
              codeContent += renderContent(childCode) + '\n';
            }
          });
        }
        break;
      case 'list':
        codeContent = (element.items || []).map((item) => `- ${item}`).join('\n');
        break;
      case 'table':
        const headers = element.headers || [];
        const rows = element.rows || [];
        codeContent = '| ' + headers.join(' | ') + ' |\n';
        codeContent += '| ' + headers.map(() => ':---').join(' | ') + ' |\n';
        codeContent += rows.map((row) => '| ' + row.join(' | ') + ' |').join('\n');
        break;
      case 'codeblock':
        codeContent = element.content || '';
        break;
      case 'mermaid':
        codeContent = `${element.diagramType || ''}\n${element.content || ''}`;
        break;
      default:
        codeContent = '';
    }

    return {
      type: 'codeblock',
      language: 'md',
      content: codeContent,
      // Use 4 backticks for parent code blocks that contain nested code blocks
      backticks: element.children && element.children.length > 0 ? 4 : 3,
    } as CodeBlockStructure;
  }

  // Otherwise render normally based on type
  switch (element.type) {
    case 'text':
      const textElement = { type: 'text', text: element.content || '' } as TextParagraphStructure;
      // If there are children, we need to handle them specially
      if (element.children && element.children.length > 0) {
        // For text elements with children, we'll return an array: [text, ...children]
        const children = element.children.map((child) => renderContentElement(child, mode));
        return [textElement, ...children];
      }
      return textElement;
    case 'list':
      return { type: 'bulletlist', items: element.items || [] } as BulletListStructure;
    case 'table':
      return {
        type: 'table',
        headers: element.headers || [],
        rows: element.rows || [],
      } as TableStructure;
    case 'codeblock':
      return {
        type: 'codeblock',
        language: element.language || 'md',
        content: element.content || '',
      } as CodeBlockStructure;
    case 'mermaid':
      return {
        type: 'codeblock',
        language: 'mermaid',
        content: `${element.diagramType || ''}\n${element.content || ''}`,
      } as CodeBlockStructure;
    default:
      return { type: 'text', text: '' } as TextParagraphStructure;
  }
}

/**
 * Builds the Legend section using data-driven approach
 */
function buildLegendSection(mode: 'human' | 'machine'): Section[] {
  const baseContent: any[] = [
    {
      type: 'table',
      headers: ['Symbol', 'Meaning'],
      rows: [
        ['✅', 'Required'],
        ['❓', 'Optional (recommended)'],
        ['➖', 'Not applicable / omit'],
      ],
    } as TableStructure,
    {
      type: 'text',
      text: '**Note on Usage in Document Headings:** In addition to their meaning in the schema tables below, these icons are used in the headings of the actual `*.md` files to indicate the **completion status** of a section.',
    } as TextParagraphStructure,
  ];

  // Use data-driven approach for status examples
  const statusExamples = contextExamples.legend.statusExamples;
  statusExamples.content.forEach((element: any) => {
    const renderedElement = renderContentElement(element as ContentElement, mode);
    baseContent.push(renderedElement);
  });

  return [
    {
      title: { type: 'heading', level: 2, text: 'Legend' },
      content: baseContent,
    },
  ];
}

/**
 * Builds the Context Inheritance Protocol section using data-driven approach
 */
function buildContextInheritanceSection(mode: 'human' | 'machine'): Section[] {
  const content: any[] = [
    {
      type: 'text',
      text: 'The Plan/Task Composable Hierarchy uses a strict protocol for context inheritance through **progressive narrowing**. To correctly interpret any document, you must gather context by reading from the top-level Plan downward.',
    } as TextParagraphStructure,
    { type: 'heading', level: 3, text: 'Traversal Process:' } as HeadingStructure,
  ];

  // Use data-driven approach for traversal process
  const traversalProcess = contextExamples.contextInheritanceProtocol.traversalProcess;
  traversalProcess.content.forEach((element: any) => {
    const renderedElement = renderContentElement(element as ContentElement, mode);
    content.push(renderedElement);
  });

  content.push({ type: 'heading', level: 3, text: 'Examples:' } as HeadingStructure);

  // Use data-driven approach for examples
  contextExamples.contextInheritanceProtocol.examples.forEach((example: any) => {
    content.push({
      type: 'text',
      text: example.title,
    } as TextParagraphStructure);

    example.content.forEach((element: any) => {
      const renderedElement = renderContentElement(element as ContentElement, mode);
      content.push(renderedElement);
    });
  });

  content.push({
    type: 'text',
    text: 'This top-down traversal ensures each document receives progressively narrowed, inherited context. Information is never repeated - it flows downward through the hierarchy. Automated tools and LLMs **MUST** enforce this reading order.',
  } as TextParagraphStructure);

  return [
    {
      title: { type: 'heading', level: 2, text: 'Context Inheritance Protocol' },
      content,
    },
  ];
}

/**
 * Converts family example content to structured content elements
 */
function convertFamilyExample(content: ContentElement[], mode: 'human' | 'machine'): any[] {
  const result: any[] = [];
  content.forEach((element) => {
    const rendered = renderContentElement(element, mode);
    if (Array.isArray(rendered)) {
      result.push(...rendered);
    } else {
      result.push(rendered);
    }
  });
  return result;
}

/**
 * Builds the common document structure with mode-specific rendering
 */
function buildDocumentStructure(mode: 'human' | 'machine' | 'standard' = 'standard'): DocumentStructures {
  const titleSuffix = mode === 'human' ? ' - Human Version' : mode === 'machine' ? ' - Machine Version' : '';
  const renderMode = mode === 'standard' ? 'human' : mode;

  const documentSection: Section = {
    title: { type: 'heading', level: 1, text: `Documentation Schema (Plan/Task Composable Hierarchy)${titleSuffix}` },
    content: [
      {
        type: 'text',
        text: 'This file defines **which information appears where** in our Documentation-Driven Development (DDD) Plan/Task Composable Hierarchy and **why**. Use it as the canonical source when updating templates or building automation.',
      },
      {
        type: 'text',
        text: '**Methodology Overview**: The Plan/Task Composable Hierarchy is a flexible documentation structure where Plans define strategic direction and can contain other Plans or Tasks based on complexity. This composable approach allows documentation architecture to scale naturally with project needs, from simple single-level structures to complex multi-level hierarchies.',
      },
      { type: 'hr' },

      // Legend Section (mode-specific)
      ...buildLegendSection(renderMode),
      { type: 'hr' },

      // Family Index Section
      {
        title: { type: 'heading', level: 2, text: 'Family Index' },
        content: [
          {
            type: 'table',
            headers: ['#', 'Family (Anchor)', 'Primary Question Answered', 'Plan', 'Task', 'Notes'],
            rows: fullSchema.map((family) => [
              family.id.toString(),
              `[${family.name}](#${family.anchor})`,
              family.primaryQuestion,
              getApplicabilitySymbol(family.applicability.plan),
              getApplicabilitySymbol(family.applicability.task),
              family.notes,
            ]),
          },
          {
            type: 'text',
            text: 'Each document begins with relevant **family headings** (`## Business & Scope`, etc.). A document includes a family only if it has relevant content; otherwise the heading may read `None (inherits from parent)`.',
          },
        ],
      },
      { type: 'hr' },

      // Context Inheritance Protocol Section (mode-specific)
      ...buildContextInheritanceSection(renderMode),
      { type: 'hr' },

      // Family Details
      ...buildFamilySections(renderMode),
    ],
  };

  return {
    version: '1.0.0',
    elements: [documentSection],
  };
}

function buildFamilySections(mode: 'human' | 'machine'): Section[] {
  return fullSchema.map((family) => ({
    title: { type: 'heading', level: 2, text: `${family.id} ${family.name}`, id: family.anchor },
    content: [
      // Rationale subsection (shared)
      {
        title: { type: 'heading', level: 3, text: `Rationale` },
        content: [
          {
            type: 'text',
            text: family.rationale,
          },
        ],
      },

      // Depth Matrix subsection (shared)
      {
        title: { type: 'heading', level: 3, text: `Depth Matrix` },
        content: [
          {
            type: 'table',
            headers: ['ID', 'Parent ID', 'Section Name', 'Heading', 'Plan', 'Task', 'Notes'],
            rows: [
              [
                `**${family.id}**`,
                '`null`',
                family.name,
                '`##`',
                getApplicabilitySymbol(family.applicability.plan),
                getApplicabilitySymbol(family.applicability.task),
                'The main family heading.',
              ],
              ...family.sections.map((section) => {
                const heading = '`' + '#'.repeat(section.headingLevel) + '`';
                const parentId = section.id.substring(0, section.id.lastIndexOf('.'));
                return [
                  section.id,
                  parentId || family.id.toString(),
                  section.name,
                  heading,
                  getApplicabilitySymbol(section.applicability.plan),
                  getApplicabilitySymbol(section.applicability.task),
                  section.notes || '',
                ];
              }),
            ],
          },
        ],
      },

      // Field Details subsection
      {
        title: { type: 'heading', level: 3, text: `Field Details` },
        content: buildFieldDetailsSections(family, mode),
      },
      { type: 'hr' },
    ],
  }));
}

function buildFieldDetailsSections(
  family: SchemaFamily,
  mode: 'human' | 'machine'
): (
  | Section
  | TextParagraphStructure
  | TableStructure
  | BulletListStructure
  | CodeBlockStructure
  | BlockquoteStructure
)[] {
  const content: (
    | Section
    | TextParagraphStructure
    | TableStructure
    | BulletListStructure
    | CodeBlockStructure
    | BlockquoteStructure
  )[] = [];

  family.sections.forEach((section) => {
    const sectionContent: (
      | TextParagraphStructure
      | TableStructure
      | BulletListStructure
      | CodeBlockStructure
      | BlockquoteStructure
      | Section
    )[] = [];

    // Combine all field details into a single text block with proper bullet formatting (shared)
    const fieldDetails: string[] = [];
    if (section.description) {
      fieldDetails.push(`- **Description**: ${section.description}`);
    }
    if (section.contentFormat) {
      fieldDetails.push(`- **Content Format**: ${section.contentFormat}`);
    }
    if (section.reference) {
      fieldDetails.push(`- **Reference**: ${section.reference}`);
    }
    if (section.notes) {
      fieldDetails.push(`- **Notes**: ${section.notes}`);
    }

    // Add the combined field details as a single text block
    if (fieldDetails.length > 0) {
      sectionContent.push({ type: 'text', text: fieldDetails.join('\n') });
    }

    // Sub-field applicability matrix (shared)
    if (section.fields) {
      sectionContent.push({
        title: { type: 'heading', level: 5, text: 'Sub-Field Applicability Matrix' },
        content: [
          {
            type: 'table',
            headers: ['Field', 'Plan', 'Task', 'Notes'],
            rows: section.fields.map((field) => [
              `**${field.name}**`,
              getApplicabilitySymbol(field.applicability.plan),
              getApplicabilitySymbol(field.applicability.task),
              field.description,
            ]),
          },
        ],
      });
    }

    // Examples (mode-specific rendering using new convertFamilyExample function)
    if (section.examples) {
      section.examples.forEach((example) => {
        if (example.context !== 'Default') {
          sectionContent.push({
            title: { type: 'heading', level: 5, text: `Example for ${example.context}` },
            content: convertFamilyExample(example.content as ContentElement[], mode),
          });
        } else {
          // For human mode, wrap examples in blockquotes for better visual separation
          if (mode === 'human') {
            sectionContent.push({ type: 'text', text: '- **Example**:' });
            const exampleElements = convertFamilyExample(example.content as ContentElement[], mode);
            // Wrap example elements in a blockquote for visual separation
            sectionContent.push({
              type: 'blockquote',
              content: exampleElements,
            } as BlockquoteStructure);
          } else {
            // For machine mode, keep as is (code blocks)
            sectionContent.push({ type: 'text', text: '- **Example**:' });
            sectionContent.push(...convertFamilyExample(example.content as ContentElement[], mode));
          }
        }
      });
    }

    content.push({
      title: { type: 'heading', level: 4, text: `${section.id} ${section.name}` },
      content: sectionContent,
    });
  });

  return content;
}

// --- Markdown Rendering Functions ---

function renderHeading(heading: HeadingStructure): string {
  const prefix = '#'.repeat(heading.level);
  const id = heading.id ? ` <a id="${heading.id}"></a>` : '';
  return `${prefix} ${heading.text}${id}`;
}

function renderTable(table: TableStructure): string {
  const headerRow = '| ' + table.headers.join(' | ') + ' |';
  const separatorRow = '| ' + table.headers.map(() => ':---').join(' | ') + ' |';
  const dataRows = table.rows.map((row) => '| ' + row.join(' | ') + ' |').join('\n');
  return [headerRow, separatorRow, dataRows].join('\n');
}

function renderBlockquote(blockquote: BlockquoteStructure): string {
  return blockquote.content
    .map((item) => {
      const rendered = renderContent(item);
      return rendered
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    })
    .join('\n\n');
}

function renderBulletList(list: BulletListStructure): string {
  return list.items.map((item) => `- ${item}`).join('\n');
}

function renderCodeBlock(codeblock: CodeBlockStructure): string {
  const backticks = codeblock.backticks || 3;
  const backtickString = '`'.repeat(backticks);
  return `${backtickString}${codeblock.language || ''}\n${codeblock.content}\n${backtickString}`;
}

function renderSection(section: Section): string {
  const title = renderContent(section.title);
  const content = section.content.map((item) => renderContent(item)).join('\n\n');
  return `${title}\n\n${content}`;
}

export function renderContent(content: any): string {
  switch (content.type) {
    case 'heading':
      return renderHeading(content);
    case 'text':
      return content.text;
    case 'table':
      return renderTable(content);
    case 'blockquote':
      return renderBlockquote(content);
    case 'bulletlist':
      return renderBulletList(content);
    case 'codeblock':
      return renderCodeBlock(content);
    case 'hr':
      return '---';
    default:
      // Handle sections
      if (content.title && content.content) {
        return renderSection(content);
      }
      return '';
  }
}

function renderDocumentToMarkdown(document: DocumentStructures): string {
  return document.elements.map((element) => renderContent(element)).join('\n\n');
}

// --- Generator Functions ---

export function generatePlanTemplate(): string {
  console.log('Generating Plan template...');

  const sections: string[] = [];

  // Document title placeholder
  sections.push('# [Plan Name]\n');

  // Generate sections based on schema families
  fullSchema.forEach((family) => {
    // Only include families that are required or optional for plans
    if (family.applicability.plan === 'omitted') return;

    // Add family heading with ID
    sections.push(`## ${family.id} ${family.name}\n`);

    // Add sections that apply to plans
    family.sections.forEach((section) => {
      if (section.applicability.plan === 'omitted') return;

      const heading = '#'.repeat(section.headingLevel);
      sections.push(`${heading} ${section.id} ${section.name}\n`);

      // Add machine-readable instruction comment
      sections.push(`<!--`);
      sections.push(`Required: ${section.applicability.plan === 'required' ? 'Yes' : 'No'}`);
      if (section.description) {
        sections.push(`Description: ${section.description}`);
      }
      if (section.contentFormat) {
        sections.push(`Content Format: ${section.contentFormat}`);
      }
      if (section.notes) {
        sections.push(`Notes: ${section.notes}`);
      }
      sections.push(`-->`);

      sections.push(`${TODO_PLACEHOLDER_TEXT}\n`);
      sections.push('');
    });

    sections.push('---\n');
  });

  return sections.join('\n');
}

export function generateTaskTemplate(): string {
  console.log('Generating Task template...');

  const sections: string[] = [];

  // Document title placeholder
  sections.push('# [Task Name]\n');

  // Generate sections based on schema families
  fullSchema.forEach((family) => {
    // Only include families that are required or optional for tasks
    if (family.applicability.task === 'omitted') return;

    // Add family heading with ID
    sections.push(`## ${family.id} ${family.name}\n`);

    // Add sections that apply to tasks
    family.sections.forEach((section) => {
      if (section.applicability.task === 'omitted') return;

      const heading = '#'.repeat(section.headingLevel);
      sections.push(`${heading} ${section.id} ${section.name}\n`);

      // Add machine-readable instruction comment
      sections.push(`<!--`);
      sections.push(`Required: ${section.applicability.task === 'required' ? 'Yes' : 'No'}`);
      if (section.description) {
        sections.push(`Description: ${section.description}`);
      }
      if (section.contentFormat) {
        sections.push(`Content Format: ${section.contentFormat}`);
      }
      if (section.notes) {
        sections.push(`Notes: ${section.notes}`);
      }
      sections.push(`-->`);

      sections.push(`${TODO_PLACEHOLDER_TEXT}\n`);
      sections.push('');
    });

    sections.push('---\n');
  });

  return sections.join('\n');
}

// --- Public API Functions ---

export function buildHumanSchemaDocumentStructure(): DocumentStructures {
  return buildDocumentStructure('human');
}

export function buildMachineSchemaDocumentStructure(): DocumentStructures {
  return buildDocumentStructure('machine');
}

export function generateHumanSchemaDocumentation(): string {
  const structuredDocument = buildHumanSchemaDocumentStructure();
  return renderDocumentToMarkdown(structuredDocument);
}

export function generateMachineSchemaDocumentation(): string {
  const structuredDocument = buildMachineSchemaDocumentStructure();
  return renderDocumentToMarkdown(structuredDocument);
}
