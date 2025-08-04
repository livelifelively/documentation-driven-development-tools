import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { Root } from 'mdast';

/**
 * Converts markdown content to a remark AST.
 * Uses the unified/remark ecosystem for robust parsing.
 */
export class MarkdownParser {
  /**
   * Converts a markdown string to a remark AST.
   * @param content The markdown content to parse
   * @returns A valid remark AST object
   */
  toAst(content: string): Root {
    const processor = unified().use(remarkParse);
    const ast = processor.parse(content);
    return ast as Root;
  }
}
