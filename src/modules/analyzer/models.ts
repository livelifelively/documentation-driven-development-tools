/**
 * Data models for the Documentation-Driven Development (DDD) analyzer.
 *
 * This module defines the TypeScript interfaces that represent the in-memory
 * structure of parsed documentation files, maintaining the hierarchical
 * relationship between Project → Module → Epic → Task.
 */

/**
 * Base interface for all document types in the DDD hierarchy.
 * Every document has a file path and raw content from the markdown file.
 */
export interface Document {
  /** The absolute file path to the document */
  path: string;
  /** The raw, unmodified content of the markdown file */
  rawContent: string;
}

/**
 * Represents a single task document in the DDD hierarchy.
 * Tasks are the leaf nodes and contain the most granular implementation details.
 */
export interface TaskModel extends Document {
  // Tasks have no children, they are leaf nodes
}

/**
 * Represents an epic document in the DDD hierarchy.
 * Epics contain multiple tasks and represent complete, independent features.
 */
export interface EpicModel extends Document {
  /** The tasks that belong to this epic */
  tasks: TaskModel[];
}

/**
 * Represents a module document in the DDD hierarchy.
 * Modules contain multiple epics and represent functional areas of the project.
 */
export interface ModuleModel extends Document {
  /** The epics that belong to this module */
  epics: EpicModel[];
}

/**
 * Represents the project document in the DDD hierarchy.
 * The project is the root node and contains all modules.
 */
export interface ProjectModel extends Document {
  /** The modules that belong to this project */
  modules: ModuleModel[];
}
