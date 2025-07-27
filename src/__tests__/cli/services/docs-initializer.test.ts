import { DocsInitializer } from '../../../cli/services/docs-initializer';
import { FileManager } from '../../../cli/services/file-manager';
import { TemplateGenerator } from '../../../cli/services/template-generator';
import { vol } from 'memfs';
import * as path from 'path';

jest.mock('fs/promises');
jest.mock('../../../cli/services/file-manager');
jest.mock('../../../cli/services/template-generator');

const FileManagerMock = FileManager as jest.MockedClass<typeof FileManager>;
const TemplateGeneratorMock = TemplateGenerator as jest.MockedClass<typeof TemplateGenerator>;

describe('DocsInitializer service', () => {
  let initializer: DocsInitializer;
  let fileManagerMock: jest.Mocked<FileManager>;
  let templateGeneratorMock: jest.Mocked<TemplateGenerator>;

  beforeEach(() => {
    vol.reset();
    FileManagerMock.mockClear();
    TemplateGeneratorMock.mockClear();

    fileManagerMock = new FileManager() as jest.Mocked<FileManager>;
    templateGeneratorMock = new TemplateGenerator() as jest.Mocked<TemplateGenerator>;

    FileManagerMock.mockImplementation(() => fileManagerMock);
    TemplateGeneratorMock.mockImplementation(() => templateGeneratorMock);

    initializer = new DocsInitializer();
  });

  it('should create docs structure if it does not exist', async () => {
    fileManagerMock.checkDirectoryExists.mockReturnValue(false);
    fileManagerMock.ensureDirectoryExists.mockResolvedValue();
    fileManagerMock.copyFile.mockResolvedValue();
    templateGeneratorMock.generate.mockResolvedValue({ success: true });

    const outputDir = 'test';
    const resolvedOutputDir = path.resolve(process.cwd(), outputDir);
    await initializer.initialize({ outputDir, force: false });

    expect(fileManagerMock.ensureDirectoryExists).toHaveBeenCalledWith(
      path.join(resolvedOutputDir, 'docs', 'requirements')
    );
    expect(fileManagerMock.ensureDirectoryExists).toHaveBeenCalledWith(
      path.join(resolvedOutputDir, 'docs', 'templates')
    );
    expect(fileManagerMock.copyFile).toHaveBeenCalled();
    expect(templateGeneratorMock.generate).toHaveBeenCalled();
  });

  it('should throw an error if docs directory exists and force is false', async () => {
    fileManagerMock.checkDirectoryExists.mockReturnValue(true);
    const outputDir = 'test';

    await expect(initializer.initialize({ outputDir, force: false })).rejects.toThrow(
      `'docs/' directory already exists. Use --force to overwrite.`
    );
  });

  it('should overwrite if docs directory exists and force is true', async () => {
    fileManagerMock.checkDirectoryExists.mockReturnValue(true);
    fileManagerMock.ensureDirectoryExists.mockResolvedValue();
    fileManagerMock.copyFile.mockResolvedValue();
    templateGeneratorMock.generate.mockResolvedValue({ success: true });

    const outputDir = 'test';
    await initializer.initialize({ outputDir, force: true });

    expect(fileManagerMock.ensureDirectoryExists).toHaveBeenCalled();
    expect(fileManagerMock.copyFile).toHaveBeenCalled();
    expect(templateGeneratorMock.generate).toHaveBeenCalled();
  });
});
