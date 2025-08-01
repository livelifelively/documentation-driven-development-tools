import { SectionProcessor, LintingError } from '../plugin.types.js';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { SchemaValidator } from '../schema/schema-validator.js';

/**
 * Plugin for processing the "1.2 Status" section of task files.
 * Extracts status information and validates required fields using the SchemaValidator.
 */
class StatusPlugin implements SectionProcessor {
  sectionId = '1.2';
  private schemaValidator: SchemaValidator;

  constructor(schemaValidator: SchemaValidator) {
    this.schemaValidator = schemaValidator;
  }

  /**
   * Lints the status section for required fields using the SchemaValidator.
   * @param sectionAst The AST for the status section.
   * @returns An array of linting errors.
   */
  lint(sectionAst: Root): LintingError[] {
    return this.schemaValidator.validateSection(sectionAst, '1.2', 'task');
  }

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
  }

  /**
   * Specifies the target path in the final JSON output.
   * @returns The dot-notation path.
   */
  getTargetPath(): string {
    return 'meta.status';
  }
}

export default StatusPlugin;
