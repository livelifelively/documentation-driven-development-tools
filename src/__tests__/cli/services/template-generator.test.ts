import { TemplateGenerator, TemplateRequest } from '../../../cli/services/template-generator';
import { FileManager } from '../../../cli/services/file-manager';
import { NamingValidator } from '../../../cli/services/naming-validator';
import * as templateGenerators from '../../../';

jest.mock('../../../cli/services/file-manager');
jest.mock('../../../cli/services/naming-validator');
jest.mock('../../../generate-templates');

const mockedTemplateGenerators = templateGenerators as jest.Mocked<typeof templateGenerators>;

describe('TemplateGenerator', () => {
  let generator: TemplateGenerator;
  let fileManager: jest.Mocked<FileManager>;
  let namingValidator: jest.Mocked<NamingValidator>;

  beforeEach(() => {
    jest.resetAllMocks();
    generator = new TemplateGenerator();
    // We are manually setting the mocked services, so we can cast to any
    fileManager = new (FileManager as any)() as jest.Mocked<FileManager>;
    namingValidator = new (NamingValidator as any)() as jest.Mocked<NamingValidator>;
    (generator as any).fileManager = fileManager;
    (generator as any).namingValidator = namingValidator;
  });

  const baseRequest: TemplateRequest = {
    documentType: 'plan',
    documentName: 'my-plan',
  };

  it('should return an error if name validation fails', async () => {
    namingValidator.validateName.mockReturnValue({ isValid: false, message: 'Invalid name' });
    const result = await generator.generate(baseRequest);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Invalid name');
  });

  it('should return an error if a file conflict exists', async () => {
    namingValidator.validateName.mockReturnValue({ isValid: true });
    namingValidator.generateFileName.mockResolvedValue('p1-my-plan.plan.md');
    fileManager.resolveOutputPath.mockReturnValue('/tmp');
    namingValidator.checkNameConflicts.mockResolvedValue({ isValid: false, message: 'File exists' });

    const result = await generator.generate(baseRequest);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('File exists');
  });

  it('should generate a plan template successfully', async () => {
    namingValidator.validateName.mockReturnValue({ isValid: true });
    namingValidator.generateFileName.mockResolvedValue('p1-my-plan.plan.md');
    fileManager.resolveOutputPath.mockReturnValue('/tmp');
    namingValidator.checkNameConflicts.mockResolvedValue({ isValid: true });
    mockedTemplateGenerators.generatePlanTemplate.mockReturnValue('plan content');

    const result = await generator.generate(baseRequest);
    expect(result.success).toBe(true);
    expect(result.filePath).toBe('/tmp/p1-my-plan.plan.md');
    expect(fileManager.writeTemplate).toHaveBeenCalledWith('/tmp/p1-my-plan.plan.md', 'plan content');
  });

  it('should perform a dry run correctly', async () => {
    namingValidator.validateName.mockReturnValue({ isValid: true });
    namingValidator.generateFileName.mockResolvedValue('p1-my-plan.plan.md');
    fileManager.resolveOutputPath.mockReturnValue('/tmp');
    namingValidator.checkNameConflicts.mockResolvedValue({ isValid: true });
    mockedTemplateGenerators.generatePlanTemplate.mockReturnValue('plan content');

    const result = await generator.generate({ ...baseRequest, isDryRun: true });
    expect(result.success).toBe(true);
    expect(result.filePath).toBe('/tmp/p1-my-plan.plan.md');
    expect(result.content).toBe('plan content');
    expect(result.warnings).toContain('Dry run mode: No files were written.');
    expect(fileManager.writeTemplate).not.toHaveBeenCalled();
  });

  it('should handle errors during file writing', async () => {
    namingValidator.validateName.mockReturnValue({ isValid: true });
    namingValidator.generateFileName.mockResolvedValue('p1-my-plan.plan.md');
    fileManager.resolveOutputPath.mockReturnValue('/tmp');
    namingValidator.checkNameConflicts.mockResolvedValue({ isValid: true });
    mockedTemplateGenerators.generatePlanTemplate.mockReturnValue('plan content');
    fileManager.writeTemplate.mockRejectedValue(new Error('Disk full'));

    const result = await generator.generate(baseRequest);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Failed to write file: Disk full');
  });
});
