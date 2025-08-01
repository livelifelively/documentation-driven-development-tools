import { promises as fs } from 'fs';
import { MarkdownParser } from './markdown-parser.js';
import { PluginManager } from './plugin-manager.js';
import { ParseResult, TaskData, LintingError } from './plugin.types.js';
import { set } from 'lodash-es';
import { Root } from 'mdast';

/**
 * Core engine that orchestrates the parsing process.
 * Reads files, converts to AST, and delegates processing to plugins.
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
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Cannot read file at ${filePath}.`);
    }

    // Convert to AST
    const ast = this.markdownParser.toAst(fileContent);

    // Process the AST with all loaded plugins
    const result = this.processWithPlugins(ast);

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
   * Processes the document AST with all available plugins.
   * @param ast The full document AST.
   * @returns ParseResult with aggregated data and errors from all plugins.
   */
  private processWithPlugins(ast: Root): ParseResult {
    const data: TaskData = {};
    const allErrors: LintingError[] = [];

    const processors = this.pluginManager.getAllProcessors();

    for (const processor of processors) {
      try {
        const { data: sectionData, errors } = processor.process(ast);
        allErrors.push(...errors);

        if (errors.length === 0 && sectionData) {
          const targetPath = processor.getTargetPath();
          if (targetPath) {
            set(data, targetPath, sectionData);
          }
        }
      } catch (error: any) {
        allErrors.push({
          section: processor.sectionId,
          message: `Plugin runtime error: ${error.message}`,
        });
      }
    }

    return {
      data: Object.keys(data).length > 0 ? data : null,
      errors: allErrors,
    };
  }
}
