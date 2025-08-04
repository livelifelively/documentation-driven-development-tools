import { promises as fs } from 'fs';
import { MarkdownParser } from './markdown-parser.js';
import { PluginManager } from './plugin-manager.js';
import { ParseResult, TaskData, LintingError } from './plugin.types.js';
import { AstSlicer } from './ast-slicer.js';
import { set } from 'lodash-es';
import { Root } from 'mdast';

/**
 * Core engine that orchestrates the parsing process.
 * Reads files, converts to AST, and processes sections with plugins.
 */
export class CoreEngine {
  private markdownParser: MarkdownParser;
  private pluginManager: PluginManager;
  private astSlicer: AstSlicer;

  constructor(pluginManager?: PluginManager) {
    this.markdownParser = new MarkdownParser();
    this.pluginManager = pluginManager || new PluginManager();
    this.astSlicer = new AstSlicer();
  }

  /**
   * Parses a task file and returns structured data with any errors.
   * @param filePath The path to the task file
   * @returns Promise resolving to ParseResult with data and errors
   */
  async parse(filePath: string): Promise<ParseResult> {
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (_error) {
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
  async loadPlugins(directory: string): Promise<void> {
    await this.pluginManager.loadPlugins(directory);
  }

  /**
   * Processes the AST sections with available plugins.
   * @param ast The parsed AST
   * @returns ParseResult with extracted data and errors
   */
  private processSections(ast: Root): ParseResult {
    const data: TaskData = {};
    const errors: LintingError[] = [];

    const sections = this.astSlicer.slice(ast);

    for (const [sectionId, sectionAst] of sections.entries()) {
      if (!sectionId) continue;

      const processor = this.pluginManager.getProcessor(sectionId);
      if (processor) {
        try {
          const sectionErrors = processor.lint(sectionAst);
          errors.push(...sectionErrors);

          if (sectionErrors.length === 0) {
            const sectionData = processor.extract(sectionAst);
            const targetPath = processor.getTargetPath();
            if (targetPath) {
              set(data, targetPath, sectionData);
            }
          }
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
}
