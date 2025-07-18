import {
  HeadingStructure,
  TextParagraphStructure,
  TableStructure,
  BlockquoteStructure,
  BulletListStructure,
  Section,
  DocumentStructures,
} from './types';

export function generateMarkdown(doc: DocumentStructures): string {
  return doc.elements.map((section) => convertSection(section)).join('\n\n');
}

function convertSection(section: Section): string {
  const titleMarkdown = convertHeading(section.title);
  const contentMarkdown = section.content
    .map((item) => convertContentItem(item))
    .filter((content) => content.trim()) // Remove empty content
    .join('\n\n');

  return `${titleMarkdown}\n\n${contentMarkdown}`;
}

function convertContentItem(item: any): string {
  switch (item.type) {
    case 'heading':
      return convertHeading(item as HeadingStructure);
    case 'text':
      return convertText(item as TextParagraphStructure);
    case 'table':
      return convertTable(item as TableStructure);
    case 'blockquote':
      return convertBlockquote(item as BlockquoteStructure);
    case 'bulletlist':
      return convertBulletList(item as BulletListStructure);
    default:
      // If it's a nested section
      if ('title' in item && 'content' in item) {
        return convertSection(item as Section);
      }
      return '';
  }
}

function convertHeading(heading: HeadingStructure): string {
  const hashes = '#'.repeat(heading.level);
  return `${hashes} ${heading.text}`;
}

function convertText(text: TextParagraphStructure): string {
  return text.text;
}

function convertTable(table: TableStructure): string {
  const headerRow = `| ${table.headers.join(' | ')} |`;
  const separatorRow = `| ${table.headers.map(() => '---').join(' | ')} |`;
  const dataRows = table.rows.map((row) => `| ${row.join(' | ')} |`);

  return [headerRow, separatorRow, ...dataRows].join('\n');
}

function convertBlockquote(blockquote: BlockquoteStructure): string {
  const contentLines = blockquote.content
    .map((item) => convertContentItem(item))
    .join('\n\n')
    .split('\n');

  return contentLines.map((line) => `> ${line}`).join('\n');
}

function convertBulletList(list: BulletListStructure): string {
  return list.items.map((item) => `- ${item}`).join('\n');
}
