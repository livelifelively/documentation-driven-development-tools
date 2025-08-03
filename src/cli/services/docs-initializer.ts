import { FileManager } from './file-manager.js';
import { TemplateGenerator } from './template-generator.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

export interface InitRequest {
  outputDir: string;
  force: boolean;
}

export class DocsInitializer {
  private fileManager: FileManager;
  private templateGenerator: TemplateGenerator;

  constructor() {
    this.fileManager = new FileManager();
    this.templateGenerator = new TemplateGenerator();
  }

  public async initialize(request: InitRequest): Promise<void> {
    const resolvedOutputDir = path.resolve(process.cwd(), request.outputDir);
    if (!resolvedOutputDir.startsWith(process.cwd())) {
      throw new Error('Invalid output directory. Path cannot be outside the current project.');
    }

    const docsPath = path.join(resolvedOutputDir, 'docs');
    const configPath = path.join(resolvedOutputDir, 'ddd.config.json');

    if ((await this.fileManager.checkFileExists(configPath)) && !request.force) {
      throw new Error(`'ddd.config.json' already exists. Use --force to overwrite.`);
    }

    if (this.fileManager.checkDirectoryExists(docsPath)) {
      if (!request.force) {
        throw new Error(`'docs/' directory already exists. Use --force to overwrite.`);
      }
      await this.fileManager.deleteDirectory(docsPath);
    }

    await this.createDirectoryStructure(docsPath);
    await this.copyCoreDocuments(docsPath);
    await this.generateExamplePlan(docsPath);
    await this.createConfigFile(configPath);
  }

  private async createDirectoryStructure(docsPath: string): Promise<void> {
    await this.fileManager.ensureDirectoryExists(path.join(docsPath, 'requirements'));
    await this.fileManager.ensureDirectoryExists(path.join(docsPath, 'templates'));
  }

  private async copyCoreDocuments(docsPath: string): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
    const coreDocsSourcePath = path.join(projectRoot, 'src');
    const templatesSourcePath = path.join(projectRoot, 'src', 'templates');

    const coreDocs = [
      { source: path.join(coreDocsSourcePath, 'ddd-2.md'), destination: path.join(docsPath, 'ddd-2.md') },
      {
        source: path.join(coreDocsSourcePath, 'generated-schema-docs', 'ddd-2-schema.human.md'),
        destination: path.join(docsPath, 'generated-schema-docs', 'ddd-2-schema.human.md'),
      },
      {
        source: path.join(coreDocsSourcePath, 'generated-schema-docs', 'ddd-2-schema.machine.md'),
        destination: path.join(docsPath, 'generated-schema-docs', 'ddd-2-schema.machine.md'),
      },
    ];

    const templates = [
      {
        source: path.join(templatesSourcePath, 'plan.template.md'),
        destination: path.join(docsPath, 'templates', 'plan.template.md'),
      },
      {
        source: path.join(templatesSourcePath, 'task.template.md'),
        destination: path.join(docsPath, 'templates', 'task.template.md'),
      },
    ];

    for (const doc of [...coreDocs, ...templates]) {
      await this.fileManager.ensureDirectoryExists(path.dirname(doc.destination));
      await this.fileManager.copyFile(doc.source, doc.destination);
    }
  }

  private async generateExamplePlan(docsPath: string): Promise<void> {
    await this.templateGenerator.generate({
      documentType: 'plan',
      documentName: 'example',
      outputDirectory: path.join(docsPath, 'requirements'),
    });
  }

  private async createConfigFile(configPath: string): Promise<void> {
    const defaultConfig = {
      requirementsPath: 'docs/requirements',
    };
    await this.fileManager.writeTemplate(configPath, JSON.stringify(defaultConfig, null, 2));
  }
}
