import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownParser } from '../markdown-parser.js';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('toAst', () => {
    it('should return a valid remark AST for a simple markdown string', () => {
      const markdown = '# Test Heading\n\nThis is a test paragraph.';
      const ast = parser.toAst(markdown);

      expect(ast).toBeDefined();
      expect(ast.type).toBe('root');
      expect(ast.children).toBeDefined();
      expect(Array.isArray(ast.children)).toBe(true);
    });

    it('should handle empty markdown content', () => {
      const markdown = '';
      const ast = parser.toAst(markdown);

      expect(ast).toBeDefined();
      expect(ast.type).toBe('root');
      expect(ast.children).toBeDefined();
    });

    it('should parse complex markdown with multiple sections', () => {
      const markdown = `
# Title

## Section 1
Content for section 1.

## Section 2
Content for section 2.

- List item 1
- List item 2
      `;

      const ast = parser.toAst(markdown);

      expect(ast).toBeDefined();
      expect(ast.type).toBe('root');
      expect(ast.children).toBeDefined();
      expect(ast.children.length).toBeGreaterThan(0);
    });

    it('should preserve heading structure in AST', () => {
      const markdown = `
# Main Title

## 1.2 Status
Status content here.

## 2.1 Overview
Overview content here.
      `;

      const ast = parser.toAst(markdown);

      // Find heading nodes
      const headings = ast.children?.filter((node: any) => node.type === 'heading') || [];
      expect(headings.length).toBeGreaterThan(0);

      // Check that we have the expected headings
      const headingTexts = headings.map((node: any) => node.children?.map((child: any) => child.value).join('') || '');

      expect(headingTexts).toContain('Main Title');
      expect(headingTexts).toContain('1.2 Status');
      expect(headingTexts).toContain('2.1 Overview');
    });
  });
});
