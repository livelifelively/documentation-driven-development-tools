import { CoreEngine } from './core-engine.js';
import { ParseResult, LintingError } from './plugin.types.js';

/**
 * Parses and validates a task file, returning its structured data and any errors.
 * @param filePath The path to the *.task.md file.
 * @returns A promise that resolves with a ParseResult object.
 */
export async function parseTask(filePath: string): Promise<ParseResult> {
  const coreEngine = new CoreEngine();
  return await coreEngine.parse(filePath);
}

/**
 * Validates a task file against the schema without extracting data.
 * @param filePath The path to the *.task.md file.
 * @returns A promise that resolves with an array of LintingError objects. The array is empty if the file is valid.
 */
export async function lintTask(filePath: string): Promise<LintingError[]> {
  const result = await parseTask(filePath);
  return result.errors;
}

// Re-export types for consumers
export type { ParseResult, TaskData, LintingError, SectionProcessor } from './plugin.types.js';
export { CoreEngine } from './core-engine.js';
export { MarkdownParser } from './markdown-parser.js';
export { PluginManager } from './plugin-manager.js';
