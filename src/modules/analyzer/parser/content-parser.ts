import { promises as fs } from 'fs';
import { basename, dirname, join } from 'path';
import { Logger } from '../logger';
import { ProjectModel, ModuleModel, EpicModel, TaskModel, Document } from '../models';

/**
 * Custom error for orphaned documents that cannot be placed in the hierarchy.
 */
export class OrphanedDocumentError extends Error {
  constructor(filePath: string, reason: string) {
    super(`Orphaned document found at ${filePath}. It does not belong to a valid parent. Reason: ${reason}`);
    this.name = 'OrphanedDocumentError';
    (this as any).details = {
      filePath,
      reason,
    };
  }
}

/**
 * Given a list of documentation file paths, reads their content and assembles them
 * into a hierarchical ProjectModel.
 * @param filePaths An array of absolute paths to documentation files.
 * @returns A promise that resolves to the fully assembled ProjectModel.
 * @throws If a file cannot be read or if an orphaned document is found.
 */
export async function parseDocumentation(filePaths: string[]): Promise<ProjectModel> {
  const logger = new Logger();

  // Step 1: Read all file contents asynchronously
  const fileContents = new Map<string, string>();

  for (const filePath of filePaths) {
    try {
      logger.debug(`Parsing content from ${filePath}`);
      const content = await fs.readFile(filePath, 'utf-8');
      fileContents.set(filePath, content);
    } catch (error) {
      const errorMessage = `Cannot read file ${filePath}. Please check permissions.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Step 2: Create document models and organize by type
  const documents = new Map<string, Document>();
  const projectFiles: string[] = [];
  const moduleFiles: string[] = [];
  const epicFiles: string[] = [];
  const taskFiles: string[] = [];

  for (const [filePath, content] of fileContents) {
    const fileName = basename(filePath);

    // Create base document
    const document: Document = {
      path: filePath,
      rawContent: content,
    };

    // Categorize files by type
    if (fileName === 'project.md') {
      projectFiles.push(filePath);
    } else if (fileName.endsWith('.module.md')) {
      moduleFiles.push(filePath);
    } else if (fileName.endsWith('.epic.md')) {
      epicFiles.push(filePath);
    } else if (fileName.endsWith('.task.md')) {
      taskFiles.push(filePath);
    }

    documents.set(filePath, document);
  }

  // Step 3: Validate we have exactly one project file
  if (projectFiles.length === 0) {
    throw new OrphanedDocumentError('project.md', 'No project.md file found in the documentation');
  }
  if (projectFiles.length > 1) {
    throw new OrphanedDocumentError('project.md', `Multiple project.md files found: ${projectFiles.join(', ')}`);
  }

  const projectPath = projectFiles[0];
  const projectDocument = documents.get(projectPath)!;

  // Step 4: Build the hierarchical model
  const projectModel: ProjectModel = {
    ...projectDocument,
    modules: [],
  };

  // Create a map to store all models for easy lookup
  const moduleModels = new Map<string, ModuleModel>();
  const epicModels = new Map<string, EpicModel>();
  const taskModels = new Map<string, TaskModel>();

  // Step 5: Process modules
  for (const modulePath of moduleFiles) {
    const moduleDocument = documents.get(modulePath)!;
    const moduleId = extractModuleId(modulePath);

    const moduleModel: ModuleModel = {
      ...moduleDocument,
      epics: [],
    };

    moduleModels.set(moduleId, moduleModel);
    projectModel.modules.push(moduleModel);
  }

  // Step 6: Process epics
  for (const epicPath of epicFiles) {
    const epicDocument = documents.get(epicPath)!;
    const epicId = extractEpicId(epicPath);
    const parentModuleId = extractParentModuleId(epicPath);

    const epicModel: EpicModel = {
      ...epicDocument,
      tasks: [],
    };

    epicModels.set(epicId, epicModel);

    // Find parent module
    const parentModule = moduleModels.get(parentModuleId);
    if (!parentModule) {
      throw new OrphanedDocumentError(epicPath, `Epic ${epicId} cannot find parent module ${parentModuleId}`);
    }

    parentModule.epics.push(epicModel);
  }

  // Step 7: Process tasks
  for (const taskPath of taskFiles) {
    const taskDocument = documents.get(taskPath)!;
    const taskId = extractTaskId(taskPath);
    const parentEpicId = extractParentEpicId(taskPath);

    const taskModel: TaskModel = {
      ...taskDocument,
    };

    taskModels.set(taskId, taskModel);

    // Find parent epic
    const parentEpic = epicModels.get(parentEpicId);
    if (!parentEpic) {
      throw new OrphanedDocumentError(taskPath, `Task ${taskId} cannot find parent epic ${parentEpicId}`);
    }

    parentEpic.tasks.push(taskModel);
  }

  logger.info('Content parsing complete. Assembled ProjectModel.');
  return projectModel;
}

/**
 * Extracts the module ID from a module file path.
 * Example: "/path/to/m1-analyzer/m1-analyzer.module.md" -> "m1-analyzer"
 */
function extractModuleId(modulePath: string): string {
  const fileName = basename(modulePath);
  return fileName.replace('.module.md', '');
}

/**
 * Extracts the epic ID from an epic file path.
 * Example: "/path/to/m1-analyzer/m1-e1-parser/m1-e1-parser.epic.md" -> "m1-e1-parser"
 */
function extractEpicId(epicPath: string): string {
  const fileName = basename(epicPath);
  return fileName.replace('.epic.md', '');
}

/**
 * Extracts the task ID from a task file path.
 * Example: "/path/to/m1-analyzer/m1-e1-parser/m1-e1-t1-fs-scanner.task.md" -> "m1-e1-t1-fs-scanner"
 */
function extractTaskId(taskPath: string): string {
  const fileName = basename(taskPath);
  return fileName.replace('.task.md', '');
}

/**
 * Extracts the parent module ID from an epic file path.
 * Example: "/path/to/m1-analyzer/m1-e1-parser/m1-e1-parser.epic.md" -> "m1-analyzer"
 */
function extractParentModuleId(epicPath: string): string {
  const epicDir = dirname(epicPath);
  const moduleDir = dirname(epicDir);
  const modulePath = join(moduleDir, basename(moduleDir) + '.module.md');
  return extractModuleId(modulePath);
}

/**
 * Extracts the parent epic ID from a task file path.
 * Example: "/path/to/m1-analyzer/m1-e1-parser/m1-e1-t1-fs-scanner.task.md" -> "m1-e1-parser"
 */
function extractParentEpicId(taskPath: string): string {
  const taskDir = dirname(taskPath);
  const epicPath = join(taskDir, basename(taskDir) + '.epic.md');
  return extractEpicId(epicPath);
}
