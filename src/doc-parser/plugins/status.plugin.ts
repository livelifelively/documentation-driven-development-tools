import { SectionProcessor, LintingError } from '../plugin.types.js';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

/**
 * Plugin for processing the "1.2 Status" section of task files.
 * Extracts status information and validates required fields using structured AST traversal.
 */
const statusPlugin: SectionProcessor = {
  sectionId: '1.2',

  /**
   * Lints the status section for required fields.
   * @param sectionAst The AST for the status section.
   * @returns An array of linting errors.
   */
  lint(sectionAst: Root): LintingError[] {
    const errors: LintingError[] = [];
    const foundFields = new Set<string>();

    visit(sectionAst, 'listItem', (node) => {
      const text = toString(node);
      if (text.startsWith('Current State:')) foundFields.add('Current State');
      if (text.startsWith('Priority:')) foundFields.add('Priority');
    });

    if (!foundFields.has('Current State')) {
      errors.push({
        section: '1.2',
        message: "Missing required field: 'Current State'",
      });
    }
    if (!foundFields.has('Priority')) {
      errors.push({
        section: '1.2',
        message: "Missing required field: 'Priority'",
      });
    }

    return errors;
  },

  /**
   * Extracts structured data from the status section using AST traversal.
   * @param sectionAst The AST for the status section.
   * @returns A structured object with status data.
   */
  extract(sectionAst: Root): any {
    const data: Record<string, any> = {};

    visit(sectionAst, 'listItem', (node) => {
      const text = toString(node);
      const match = text.match(/^(.*?):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        const camelKey = key.replace(/\s+/g, '').replace(/^\w/, (c) => c.toLowerCase());

        if (camelKey === 'progress' || camelKey === 'planningEstimate' || camelKey === 'estVariancePts') {
          data[camelKey] = parseInt(value, 10) || 0;
        } else {
          data[camelKey] = value;
        }
      }
    });

    return data;
  },

  /**
   * Specifies the target path in the final JSON output.
   * @returns The dot-notation path.
   */
  getTargetPath(): string {
    return 'meta.status';
  },
};

export default statusPlugin;
