import { readFileSync } from 'fs';
import { MarkdownParser } from './markdown-parser.js';
import { PluginManager } from './plugin-manager.js';
import { SectionProcessor, ParseResult, TaskData, LintingError } from './plugin.types.js';

/**
 * Core engine that orchestrates the parsing process.
 * Reads files, converts to AST, and processes sections with plugins.
 */
export class CoreEngine {
  private markdownParser: MarkdownParser;
  private pluginManager: PluginManager;

  constructor(pluginManager?: PluginManager) {
    this.markdownParser = new MarkdownParser();
    this.pluginManager = pluginManager || new PluginManager();
  }

  /**
   * Parses a task file and returns structured data with any errors.
   * @param filePath The path to the task file
   * @returns Promise resolving to ParseResult with data and errors
   */
  async parse(filePath: string): Promise<ParseResult> {
    let fileContent;
    try {
      fileContent = readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Cannot read file at ${filePath}.`);
    }

    // Convert to AST
    const ast = this.markdownParser.toAst(fileContent);

    // Process sections with plugins
    const result = this.processSections(ast);

    return result;
  }

  /**
   * Loads plugins from the specified directory.
   * @param directory The directory containing plugin files
   */
  loadPlugins(directory: string): void {
    this.pluginManager.loadPlugins(directory);
  }

  /**
   * Processes the AST sections with available plugins.
   * @param ast The parsed AST
   * @returns ParseResult with extracted data and errors
   */
  private processSections(ast: any): ParseResult {
    const data: TaskData = {};
    const errors: LintingError[] = [];

    // Find all heading nodes to identify sections
    const sections = this.extractSections(ast);

    // Process each section with available plugins
    for (const [sectionId, sectionAst] of sections) {
      const processor = this.pluginManager.getProcessor(sectionId);

      if (processor) {
        try {
          // Lint the section
          const sectionErrors = processor.lint(sectionAst);
          errors.push(...sectionErrors);

          // Extract data from the section
          const sectionData = processor.extract(sectionAst);

          // Merge the extracted data into the result
          this.mergeSectionData(data, sectionId, sectionData);
        } catch (error: any) {
          errors.push({
            section: sectionId,
            message: `Plugin runtime error: ${error.message}`,
          });
        }
      }
    }

    return {
      data: Object.keys(data).length > 0 ? data : null,
      errors,
    };
  }

  /**
   * Extracts sections from the AST based on heading structure.
   * @param ast The parsed AST
   * @returns Map of section ID to section AST nodes
   */
  private extractSections(ast: any): Map<string, any[]> {
    const sections = new Map<string, any[]>();
    let currentSectionId: string | null = null;
    let currentSectionNodes: any[] = [];

    const processNode = (node: any) => {
      if (node.type === 'heading' && node.depth === 2) {
        // Save previous section if exists
        if (currentSectionId && currentSectionNodes.length > 0) {
          sections.set(currentSectionId, currentSectionNodes);
        }

        // Start new section
        const headingText = this.extractHeadingText(node);
        currentSectionId = this.extractSectionId(headingText);
        currentSectionNodes = [node];
      } else if (currentSectionId) {
        // Add node to current section
        currentSectionNodes.push(node);
      }

      // Process children recursively
      if (node.children) {
        for (const child of node.children) {
          processNode(child);
        }
      }
    };

    processNode(ast);

    // Save the last section
    if (currentSectionId && currentSectionNodes.length > 0) {
      sections.set(currentSectionId, currentSectionNodes);
    }

    return sections;
  }

  /**
   * Extracts text content from a heading node.
   * @param headingNode The heading AST node
   * @returns The text content of the heading
   */
  private extractHeadingText(headingNode: any): string {
    if (!headingNode.children) return '';

    return headingNode.children.map((child: any) => child.value || '').join('');
  }

  /**
   * Extracts section ID from heading text (e.g., "1.2 Status" -> "1.2").
   * @param headingText The heading text
   * @returns The section ID or null if not a valid section heading
   */
  private extractSectionId(headingText: string): string | null {
    const match = headingText.match(/^(\d+\.\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Merges section data into the main data object.
   * @param data The main data object
   * @param sectionId The section ID
   * @param sectionData The data extracted from the section
   */
  private mergeSectionData(data: TaskData, sectionId: string, sectionData: any): void {
    // Map section IDs to data structure paths
    const sectionMap: Record<string, string> = {
      '1.2': 'meta.status',
      '1.3': 'meta.priorityDrivers',
      '99.9': 'mock',
    };

    const path = sectionMap[sectionId];
    if (path) {
      const pathParts = path.split('.');
      let current: any = data;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      const lastPart = pathParts[pathParts.length - 1];
      current[lastPart] = sectionData;
    }
  }
}
