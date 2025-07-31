import { describe, it, expect } from 'vitest';
import { AstSlicer } from '../ast-slicer.js';
import { MarkdownParser } from '../markdown-parser.js';

describe('AstSlicer', () => {
  const parser = new MarkdownParser();
  const slicer = new AstSlicer();

  it('should correctly slice a document with multiple sections', () => {
    const markdown = `
# Document Title

## 1.1 Overview

Some text.

## 1.2 Status

- State: In Progress
- Priority: High

## 2.1 Details

More text.
    `;
    const ast = parser.toAst(markdown);
    const sections = slicer.slice(ast);

    expect(sections.size).toBe(3);
    expect(sections.has('1.1')).toBe(true);
    expect(sections.has('1.2')).toBe(true);
    expect(sections.has('2.1')).toBe(true);

    const section1_1 = sections.get('1.1');
    expect(section1_1?.children[0].type).toBe('heading');
  });

  it('should handle a document with no sections', () => {
    const markdown = `# Title\n\nJust text.`;
    const ast = parser.toAst(markdown);
    const sections = slicer.slice(ast);
    expect(sections.size).toBe(0);
  });

  it('should handle a document with only one section', () => {
    const markdown = `## 1.1 Overview\n\nContent.`;
    const ast = parser.toAst(markdown);
    const sections = slicer.slice(ast);
    expect(sections.size).toBe(1);
    expect(sections.has('1.1')).toBe(true);
  });

  it('should ignore headings with depth other than 2', () => {
    const markdown = `
# Title
### 1.1.1 Sub-heading
## 1.2 Real Section
    `;
    const ast = parser.toAst(markdown);
    const sections = slicer.slice(ast);
    expect(sections.size).toBe(1);
    expect(sections.has('1.2')).toBe(true);
  });
});
