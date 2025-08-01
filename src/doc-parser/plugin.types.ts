import { Root } from 'mdast';

/**
 * Represents a single validation error found during linting.
 */
export interface LintingError {
  section: string; // e.g., "1.2 Status"
  message: string; // e.g., "Required field 'Priority' is missing."
}

/**
 * Represents the structured data extracted from a task file.
 * The structure mirrors the schema families.
 */
export interface TaskData {
  meta?: {
    status?: {
      currentState?: string;
      priority?: string;
      progress?: number;
      planningEstimate?: number;
      estVariance?: number;
      created?: string;
      implementationStarted?: string;
      completed?: string;
      lastUpdated?: string;
    };
    priorityDrivers?: string[];
  };
  // Other families will be added here as plugins are implemented
}

/**
 * Represents the result of a parsing operation, which may include
 * both extracted data and any validation errors that were found.
 */
export interface ParseResult {
  data: TaskData | null;
  errors: LintingError[];
}

/**
 * Interface for section processors that handle specific schema sections.
 * Each processor is responsible for finding its section within the document,
 * validating it, and extracting its data.
 */
export interface SectionProcessor {
  /**
   * The section ID this processor handles (e.g., "1.2", "2.1")
   */
  sectionId: string;

  /**
   * Processes the entire document AST to find and handle a specific section.
   * @param documentAst The AST for the entire document.
   * @returns An object containing the extracted data and any linting errors.
   */
  process(documentAst: Root): {
    data: any;
    errors: LintingError[];
  };

  /**
   * Returns the dot-notation path where the extracted data should be placed.
   * @returns The target path (e.g., "meta.status")
   */
  getTargetPath(): string;
}
