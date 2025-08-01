import { SectionProcessor, LintingError } from '../plugin.types.js';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { SchemaValidator } from '../schema/schema-validator.js';
import { findSection } from '../ast-slicer.js';

/**
 * Plugin for processing the "1.2 Status" section of task files.
 */
class StatusPlugin implements SectionProcessor {
  sectionId = '1.2';
  private schemaValidator: SchemaValidator;

  constructor(schemaValidator: SchemaValidator) {
    this.schemaValidator = schemaValidator;
  }

  /**
   * Processes the entire document AST to find and handle the "1.2 Status" section.
   * @param documentAst The AST for the entire document.
   * @returns An object containing the extracted data and any linting errors.
   */
  process(documentAst: Root): { data: any; errors: LintingError[] } {
    const sectionAst = findSection(documentAst, '1.2 Status');

    if (!sectionAst) {
      // If the section doesn't exist, it might be a validation error
      // if the section is required. The validator will handle this.
      const errors = this.schemaValidator.validate({}, this.sectionId, 'task');
      return { data: null, errors };
    }

    const data = this.extract(sectionAst);
    const errors = this.schemaValidator.validate(data, this.sectionId, 'task');

    return { data, errors };
  }

  /**
   * Extracts structured data from the status section's AST.
   * This is a private helper for the process method.
   * @param sectionAst The AST for the status section.
   * @returns A structured object with status data.
   */
  private extract(sectionAst: Root): Record<string, any> {
    const data: Record<string, any> = {};

    visit(sectionAst, 'listItem', (node) => {
      const text = toString(node);
      const match = text.match(/^(.*?):\s*(.*)$/);
      if (match) {
        const key = match[1].replace(/\*/g, '').trim(); // Remove markdown emphasis
        const value = match[2].trim();

        const camelKey = key.replace(/\s+/g, '').replace(/^\w/, (c) => c.toLowerCase());

        // Convert to number if applicable
        if (['progress', 'planningEstimate', 'estVariancePts'].includes(camelKey)) {
          data[camelKey] = parseInt(value, 10);
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
