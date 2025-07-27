import { TemplateGenerator, TemplateRequest } from '../../../cli/services/template-generator';
import { FileManager } from '../../../cli/services/file-manager';
import { NamingValidator } from '../../../cli/services/naming-validator';
import { ConfigManager } from '../../../cli/services/config-manager';
import { IdProvider } from '../../../cli/services/id-provider';
import * as templateGenerators from '../../../';
import path = require('path');

// Mock all dependencies
jest.mock('../../../cli/services/file-manager');
jest.mock('../../../cli/services/naming-validator');
jest.mock('../../../cli/services/config-manager');
jest.mock('../../../cli/services/id-provider');
jest.mock('../../../'); // Mocks generatePlanTemplate and generateTaskTemplate

const MockedFileManager = FileManager as jest.MockedClass<typeof FileManager>;
const MockedNamingValidator = NamingValidator as jest.MockedClass<typeof NamingValidator>;
const MockedConfigManager = ConfigManager as jest.MockedClass<typeof ConfigManager>;
const MockedIdProvider = IdProvider as jest.MockedClass<typeof IdProvider>;
const mockedTemplates = templateGenerators as jest.Mocked<typeof templateGenerators>;

describe('TemplateGenerator', () => {
  let generator: TemplateGenerator;
  let fileManager: jest.Mocked<FileManager>;
  let namingValidator: jest.Mocked<NamingValidator>;
  let configManager: jest.Mocked<ConfigManager>;
  let idProvider: jest.Mocked<IdProvider>;

  beforeEach(() => {
    // Reset mocks before each test
    MockedFileManager.mockClear();
    MockedNamingValidator.mockClear();
    MockedConfigManager.mockClear();
    MockedIdProvider.mockClear();
    mockedTemplates.generatePlanTemplate.mockClear();
    mockedTemplates.generateTaskTemplate.mockClear();

    // Instantiate the generator, which will create mocked instances of its dependencies
    generator = new TemplateGenerator();

    // Get the mocked instances from the generator for individual test configuration
    fileManager = (generator as any).fileManager;
    namingValidator = (generator as any).namingValidator;
    configManager = (generator as any).configManager;
    idProvider = (generator as any).idProvider;

    // Setup default mock behaviors
    configManager.getRequirementsPath.mockReturnValue('requirements');
    fileManager.resolveOutputPath.mockImplementation((dir) => (dir ? path.resolve(process.cwd(), dir) : process.cwd()));
    namingValidator.validateName.mockReturnValue({ isValid: true });
    idProvider.getNextAvailableIds.mockResolvedValue({ nextPlanId: 1, nextTaskId: 1 });
    fileManager.checkFileExists.mockResolvedValue(false); // Default to no file conflicts
  });

  it('should return an error if name validation fails', async () => {
    namingValidator.validateName.mockReturnValue({ isValid: false, message: 'Invalid name' });
    const request: TemplateRequest = { documentType: 'plan', documentName: 'Invalid-Name' };
    const result = await generator.generate(request);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Invalid name');
  });

  it('should throw an error if a task is created without a parent', async () => {
    const request: TemplateRequest = { documentType: 'task', documentName: 'a-task' };
    const result = await generator.generate(request);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Failed to generate template: Tasks must have a parent plan.');
  });

  it('should throw an error if the parent file does not exist', async () => {
    fileManager.checkFileExists.mockResolvedValueOnce(false); // The parent file check
    const request: TemplateRequest = {
      documentType: 'plan',
      documentName: 'a-plan',
      parentPlan: 'non-existent.plan.md',
    };
    const result = await generator.generate(request);
    expect(result.success).toBe(false);
    expect(result.errors).toContain("Failed to generate template: Parent file does not exist: 'non-existent.plan.md'");
  });

  it('should generate a top-level plan successfully', async () => {
    // Arrange
    const request: TemplateRequest = { documentType: 'plan', documentName: 'my-plan' };
    idProvider.getNextAvailableIds.mockResolvedValue({ nextPlanId: 2, nextTaskId: 1 });
    namingValidator.generateFileName.mockReturnValue('p2-my-plan.plan.md');
    mockedTemplates.generatePlanTemplate.mockReturnValue('plan content');
    fileManager.checkFileExists.mockResolvedValue(false); // No conflict

    // Act
    const result = await generator.generate(request);

    // Assert
    const expectedPath = path.join(process.cwd(), 'requirements', 'p2-my-plan.plan.md');
    expect(result.success).toBe(true);
    expect(result.filePath).toBe(expectedPath);
    expect(idProvider.getNextAvailableIds).toHaveBeenCalledWith(path.join(process.cwd(), 'requirements'));
    expect(namingValidator.generateFileName).toHaveBeenCalledWith('plan', 'my-plan', 2, undefined);
    expect(fileManager.writeTemplate).toHaveBeenCalledWith(expectedPath, 'plan content');
  });

  it('should generate a sub-task successfully', async () => {
    // Arrange
    const request: TemplateRequest = { documentType: 'task', documentName: 'my-task', parentPlan: 'p1-parent.plan.md' };
    idProvider.getNextAvailableIds.mockResolvedValue({ nextPlanId: 2, nextTaskId: 3 });
    fileManager.checkFileExists.mockResolvedValueOnce(true); // Parent exists
    namingValidator.extractIdChainFromParent.mockReturnValue('p1');
    namingValidator.generateFileName.mockReturnValue('p1.t3-my-task.task.md');
    mockedTemplates.generateTaskTemplate.mockReturnValue('task content');

    // Act
    const result = await generator.generate(request);

    // Assert
    const expectedPath = path.join(process.cwd(), 'requirements', 'p1.t3-my-task.task.md');
    expect(result.success).toBe(true);
    expect(result.filePath).toBe(expectedPath);
    expect(namingValidator.extractIdChainFromParent).toHaveBeenCalledWith('p1-parent.plan.md');
    expect(namingValidator.generateFileName).toHaveBeenCalledWith('task', 'my-task', 3, 'p1');
    expect(fileManager.writeTemplate).toHaveBeenCalledWith(expectedPath, 'task content');
  });

  it('should perform a dry run correctly', async () => {
    // Arrange
    const request: TemplateRequest = { documentType: 'plan', documentName: 'my-plan', isDryRun: true };
    idProvider.getNextAvailableIds.mockResolvedValue({ nextPlanId: 1, nextTaskId: 1 });
    namingValidator.generateFileName.mockReturnValue('p1-my-plan.plan.md');
    mockedTemplates.generatePlanTemplate.mockReturnValue('plan content');

    // Act
    const result = await generator.generate(request);

    // Assert
    const expectedPath = path.join(process.cwd(), 'requirements', 'p1-my-plan.plan.md');
    expect(result.success).toBe(true);
    expect(result.filePath).toBe(expectedPath);
    expect(result.content).toBe('plan content');
    expect(result.warnings).toContain('Dry run mode: No files were written.');
    expect(fileManager.writeTemplate).not.toHaveBeenCalled();
  });

  it('should return an error if the generated file already exists', async () => {
    // Arrange
    const request: TemplateRequest = { documentType: 'plan', documentName: 'my-plan' };
    namingValidator.generateFileName.mockReturnValue('p1-my-plan.plan.md');
    // This test case has no parent, so checkFileExists is only called once for the conflict check.
    fileManager.checkFileExists.mockResolvedValue(true);

    // Act
    const result = await generator.generate(request);

    // Assert
    const expectedError = `File 'p1-my-plan.plan.md' already exists in '${path.join(process.cwd(), 'requirements')}'.`;
    expect(result.success).toBe(false);
    expect(result.errors).toContain(expectedError);
  });

  it('should handle errors during file writing', async () => {
    // Arrange
    const request: TemplateRequest = { documentType: 'plan', documentName: 'my-plan' };
    namingValidator.generateFileName.mockReturnValue('p1-my-plan.plan.md');
    fileManager.writeTemplate.mockRejectedValue(new Error('Disk full'));

    // Act
    const result = await generator.generate(request);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Failed to generate template: Disk full');
  });

  it('should generate a sub-task with a multi-level parent', async () => {
    // Arrange
    const request: TemplateRequest = {
      documentType: 'task',
      documentName: 'my-task',
      parentPlan: 'p1-p2.p3-parent.plan.md',
    };
    idProvider.getNextAvailableIds.mockResolvedValue({ nextPlanId: 4, nextTaskId: 5 });
    fileManager.checkFileExists.mockResolvedValueOnce(true); // Parent exists
    namingValidator.extractIdChainFromParent.mockReturnValue('p1-p2-p3');
    namingValidator.generateFileName.mockReturnValue('p1-p2-p3.t5-my-task.task.md');
    mockedTemplates.generateTaskTemplate.mockReturnValue('task content');

    // Act
    const result = await generator.generate(request);

    // Assert
    const expectedPath = path.join(process.cwd(), 'requirements', 'p1-p2-p3.t5-my-task.task.md');
    expect(result.success).toBe(true);
    expect(namingValidator.extractIdChainFromParent).toHaveBeenCalledWith('p1-p2.p3-parent.plan.md');
    expect(namingValidator.generateFileName).toHaveBeenCalledWith('task', 'my-task', 5, 'p1-p2-p3');
    expect(result.filePath).toBe(expectedPath);
  });

  it('should generate a task with dashes in its name', async () => {
    // Arrange
    const request: TemplateRequest = {
      documentType: 'task',
      documentName: 'a-task-with-dashes',
      parentPlan: 'p1-parent.plan.md',
    };
    idProvider.getNextAvailableIds.mockResolvedValue({ nextPlanId: 2, nextTaskId: 2 });
    fileManager.checkFileExists.mockResolvedValueOnce(true); // Parent exists
    namingValidator.extractIdChainFromParent.mockReturnValue('p1');
    namingValidator.generateFileName.mockReturnValue('p1.t2-a-task-with-dashes.task.md');
    mockedTemplates.generateTaskTemplate.mockReturnValue('task content');

    // Act
    const result = await generator.generate(request);

    // Assert
    const expectedPath = path.join(process.cwd(), 'requirements', 'p1.t2-a-task-with-dashes.task.md');
    expect(result.success).toBe(true);
    expect(namingValidator.generateFileName).toHaveBeenCalledWith('task', 'a-task-with-dashes', 2, 'p1');
    expect(result.filePath).toBe(expectedPath);
  });
});
