import path from 'path';
import { FileManager } from './file-manager';
import { NamingValidator } from './naming-validator';
import { ConfigManager } from './config-manager';
import { IdProvider } from './id-provider';
import { generatePlanTemplate, generateTaskTemplate } from '../../';

export interface TemplateRequest {
  documentType: 'plan' | 'task';
  documentName: string;
  parentPlan?: string;
  outputDirectory?: string;
  isDryRun?: boolean;
}

export interface TemplateResult {
  success: boolean;
  filePath?: string;
  content?: string;
  errors?: string[];
  warnings?: string[];
}

export class TemplateGenerator {
  private fileManager: FileManager;
  private namingValidator: NamingValidator;
  private configManager: ConfigManager;
  private idProvider: IdProvider;

  constructor() {
    this.fileManager = new FileManager();
    this.namingValidator = new NamingValidator();
    this.configManager = new ConfigManager();
    this.idProvider = new IdProvider(this.fileManager, this.namingValidator);
  }

  public async generate(request: TemplateRequest): Promise<TemplateResult> {
    try {
      // 1. Validate the name format
      const nameValidation = this.namingValidator.validateName(request.documentName);
      if (!nameValidation.isValid) {
        return { success: false, errors: [nameValidation.message || 'Invalid name'] };
      }

      // 2. Determine the final output directory
      let finalDir: string;
      if (request.outputDirectory) {
        // If an output directory is specified in the request, use it directly.
        finalDir = this.fileManager.resolveOutputPath(request.outputDirectory);
      } else {
        // Otherwise, construct it from the configuration.
        await this.configManager.loadConfig();
        const requirementsDir = this.configManager.getRequirementsPath();
        finalDir = this.fileManager.resolveOutputPath(requirementsDir);
      }

      // 3. Handle parent logic
      let parentChain: string | undefined;
      if (request.parentPlan) {
        const parentPath = path.join(finalDir, request.parentPlan);
        if (!(await this.fileManager.checkFileExists(parentPath))) {
          throw new Error(`Parent file does not exist: '${request.parentPlan}'`);
        }
        parentChain = this.namingValidator.extractIdChainFromParent(request.parentPlan);
      } else if (request.documentType === 'task') {
        throw new Error('Tasks must have a parent plan.');
      }

      // 4. Determine the next available ID by scanning the final directory
      const { nextPlanId, nextTaskId } = await this.idProvider.getNextAvailableIds(finalDir);
      const nextId = request.documentType === 'plan' ? nextPlanId : nextTaskId;

      // 5. Generate the pure file name
      const fileName = this.namingValidator.generateFileName(
        request.documentType,
        request.documentName,
        nextId,
        parentChain
      );

      // 6. Check for file conflicts in the final directory
      const filePath = path.join(finalDir, fileName);
      if (await this.fileManager.checkFileExists(filePath)) {
        return { success: false, errors: [`File '${fileName}' already exists in '${finalDir}'.`] };
      }

      // 7. Generate content and write file (or simulate for dry run)
      const content = request.documentType === 'plan' ? generatePlanTemplate() : generateTaskTemplate();

      if (request.isDryRun) {
        return {
          success: true,
          filePath,
          content,
          warnings: ['Dry run mode: No files were written.'],
        };
      }

      await this.fileManager.writeTemplate(filePath, content);
      return { success: true, filePath };
    } catch (e) {
      const error = e as Error;
      return {
        success: false,
        errors: [`Failed to generate template: ${error.message}`],
      };
    }
  }
}
