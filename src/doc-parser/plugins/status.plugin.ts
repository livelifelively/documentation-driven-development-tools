import { SectionProcessor, LintingError } from '../plugin.types.js';

/**
 * Extracts text content from AST nodes.
 * @param nodes The AST nodes to extract text from
 * @returns Concatenated text content
 */
function extractTextContent(nodes: any[]): string {
  let content = '';

  for (const node of nodes) {
    if (node.type === 'text') {
      content += node.value || '';
    } else if (node.type === 'paragraph') {
      content += extractTextContent(node.children || []) + '\n';
    } else if (node.type === 'listItem') {
      content += extractTextContent(node.children || []) + '\n';
    } else if (node.children) {
      content += extractTextContent(node.children);
    }
  }

  return content;
}

/**
 * Plugin for processing the "1.2 Status" section of task files.
 * Extracts status information and validates required fields.
 */
const statusPlugin: SectionProcessor = {
  sectionId: '1.2',

  /**
   * Lints the status section for required fields and valid values.
   * @param sectionAst The AST nodes for the status section
   * @returns Array of linting errors, empty if valid
   */
  lint(sectionAst: any[]): LintingError[] {
    const errors: LintingError[] = [];
    const content = extractTextContent(sectionAst);

    // Check for required fields
    if (!content.includes('Current State:')) {
      errors.push({
        section: '1.2',
        message: 'Missing required field: Current State',
      });
    }

    if (!content.includes('Priority:')) {
      errors.push({
        section: '1.2',
        message: 'Missing required field: Priority',
      });
    }

    return errors;
  },

  /**
   * Extracts structured data from the status section.
   * @param sectionAst The AST nodes for the status section
   * @returns Structured status data
   */
  extract(sectionAst: any[]): any {
    const content = extractTextContent(sectionAst);

    // Extract current state - handle markdown formatting
    const currentStateMatch = content.match(/\*\*Current State:\*\*\s*([^*\n]+)/);
    const currentState = currentStateMatch ? currentStateMatch[1].trim() : null;

    // Extract priority - handle markdown formatting
    const priorityMatch = content.match(/\*\*Priority:\*\*\s*([^*\n]+)/);
    const priority = priorityMatch ? priorityMatch[1].trim() : null;

    // Extract progress - handle markdown formatting
    const progressMatch = content.match(/\*\*Progress:\*\*\s*(\d+)/);
    const progress = progressMatch ? parseInt(progressMatch[1]) : 0;

    return {
      currentState,
      priority,
      progress,
    };
  },
};

export default statusPlugin;
