import path from 'path';
import { FileManager } from './file-manager';
import { NamingValidator, ValidationResult } from './naming-validator';
import { generatePlanTemplate, generateTaskTemplate } from '../../generate-templates';

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

  constructor() {
    this.fileManager = new FileManager();
    this.namingValidator = new NamingValidator();
  }

  public async generate(request: TemplateRequest): Promise<TemplateResult> {
    const nameValidation = this.namingValidator.validateName(request.documentName);
    if (!nameValidation.isValid) {
      return { success: false, errors: [nameValidation.message || 'Invalid name'] };
    }

    const fileName = await this.namingValidator.generateFileName(
      request.documentType,
      request.documentName,
      request.parentPlan
    );

    const outputDir = this.fileManager.resolveOutputPath(request.outputDirectory);
    const conflictValidation = await this.namingValidator.checkNameConflicts(fileName, outputDir);
    if (!conflictValidation.isValid) {
      return { success: false, errors: [conflictValidation.message || 'File conflict'] };
    }

    const content = request.documentType === 'plan' ? generatePlanTemplate() : generateTaskTemplate();
    const filePath = path.join(outputDir, fileName);

    if (request.isDryRun) {
      return {
        success: true,
        filePath,
        content,
        warnings: ['Dry run mode: No files were written.'],
      };
    }

    try {
      await this.fileManager.writeTemplate(filePath, content);
      return { success: true, filePath };
    } catch (e) {
      const error = e as any;
      return {
        success: false,
        errors: [`Failed to write file: ${error.message}`],
      };
    }
  }
}
