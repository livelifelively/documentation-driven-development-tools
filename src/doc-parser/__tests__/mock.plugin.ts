import { SectionProcessor, LintingError } from '../plugin.types.js';
import { Root } from 'mdast';

/**
 * Mock plugin for testing purposes.
 * Processes the "99.9 Mock Section" of task files.
 */
const mockPlugin: SectionProcessor = {
  sectionId: '99.9',

  /**
   * Lints the mock section.
   * @param sectionAst The AST nodes for the mock section
   * @returns Array of linting errors, empty if valid
   */
  lint(sectionAst: Root): LintingError[] {
    // Mock plugin always passes validation
    return [];
  },

  /**
   * Extracts structured data from the mock section.
   * @param sectionAst The AST nodes for the mock section
   * @returns Structured mock data
   */
  extract(sectionAst: Root): any {
    // Return mock data for testing
    return {
      mockData: 'extracted successfully',
    };
  },

  getTargetPath(): string {
    return 'mock';
  },
};

export default mockPlugin;
