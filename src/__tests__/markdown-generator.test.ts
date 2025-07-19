import { generateMarkdown } from '../markdown-generator';
import { DocumentStructures } from '../types';

describe('Markdown Generator', () => {
  it('should generate correct markdown for a complex document', () => {
    const doc: DocumentStructures = {
      version: '1.0',
      elements: [
        {
          title: { type: 'heading', level: 1, text: 'Test Document' },
          content: [
            { type: 'text', text: 'This is a test.' },
            {
              type: 'table',
              headers: ['h1', 'h2'],
              rows: [['c1', 'c2']],
            },
            {
              type: 'blockquote',
              content: [{ type: 'text', text: 'A quote.' }],
            },
            {
              type: 'bulletlist',
              items: ['item 1', 'item 2'],
            },
            {
              type: 'codeblock',
              language: 'typescript',
              content: 'const x = 1;',
            },
            {
              type: 'mermaid',
              diagramType: 'graph',
              content: 'TD\nA-->B',
            },
            { type: 'hr' },
          ],
        },
      ],
    };

    const expectedMarkdown = `# Test Document

This is a test.

| h1 | h2 |
| --- | --- |
| c1 | c2 |

> A quote.

- item 1
- item 2

\`\`\`typescript
const x = 1;
\`\`\`

\`\`\`mermaid
TD
A-->B
\`\`\`

---`;

    expect(generateMarkdown(doc)).toBe(expectedMarkdown);
  });

  it('should handle nested sections and multi-line blockquotes', () => {
    const doc: DocumentStructures = {
      version: '1.0',
      elements: [
        {
          title: { type: 'heading', level: 1, text: 'Parent Section' },
          content: [
            {
              title: { type: 'heading', level: 2, text: 'Nested Section' },
              content: [{ type: 'text', text: 'Nested text.' }],
            },
            {
              type: 'blockquote',
              content: [
                { type: 'text', text: 'First line.' },
                { type: 'text', text: 'Second line.' },
              ],
            },
          ],
        },
      ],
    };

    const expectedMarkdown = `# Parent Section

## Nested Section

Nested text.

> First line.
> 
> Second line.`;

    expect(generateMarkdown(doc)).toBe(expectedMarkdown);
  });

  it('should handle empty content', () => {
    const doc: DocumentStructures = {
      version: '1.0',
      elements: [
        {
          title: { type: 'heading', level: 1, text: 'Test Document' },
          content: [
            { type: 'text', text: 'This is a test.' },
            { type: 'text', text: '' },
          ],
        },
      ],
    };

    const expectedMarkdown = `# Test Document

This is a test.`;

    expect(generateMarkdown(doc)).toBe(expectedMarkdown);
  });

  it('should handle unknown content types', () => {
    const doc: DocumentStructures = {
      version: '1.0',
      elements: [
        {
          title: { type: 'heading', level: 1, text: 'Test Document' },
          content: [{ type: 'text', text: 'This is a test.' }, { type: 'unknown' } as any],
        },
      ],
    };

    const expectedMarkdown = `# Test Document

This is a test.`;

    expect(generateMarkdown(doc)).toBe(expectedMarkdown);
  });
});
