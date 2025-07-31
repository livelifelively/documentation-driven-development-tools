import { DocsInitializer } from '../../../cli/services/docs-initializer.js';
import { FileManager } from '../../../cli/services/file-manager.js';
import { TemplateGenerator } from '../../../cli/services/template-generator.js';
import { vol } from 'memfs';
import * as path from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('fs/promises');
vi.mock('../../../cli/services/file-manager');
vi.mock('../../../cli/services/template-generator');

const FileManagerMock = FileManager as unknown as { mockClear: () => void; mockImplementation: (impl: any) => void };
const TemplateGeneratorMock = TemplateGenerator as unknown as {
  mockClear: () => void;
  mockImplementation: (impl: any) => void;
};

describe('DocsInitializer service', () => {
  let initializer: DocsInitializer;
  let fileManagerMock: any;
  let templateGeneratorMock: any;

  beforeEach(() => {
    vol.reset();
    FileManagerMock.mockClear();
    TemplateGeneratorMock.mockClear();

    fileManagerMock = {
      checkDirectoryExists: vi.fn(),
      ensureDirectoryExists: vi.fn(),
      copyFile: vi.fn(),
      checkFileExists: vi.fn(),
      writeTemplate: vi.fn(), // <-- add this
      deleteDirectory: vi.fn(), // <-- add this
    };
    templateGeneratorMock = {
      generate: vi.fn(),
    };

    FileManagerMock.mockImplementation(() => fileManagerMock);
    TemplateGeneratorMock.mockImplementation(() => templateGeneratorMock);

    initializer = new DocsInitializer();
  });

  it('should create docs structure if it does not exist', async () => {
    fileManagerMock.checkDirectoryExists.mockReturnValue(false);
    fileManagerMock.ensureDirectoryExists.mockResolvedValue();
    fileManagerMock.copyFile.mockResolvedValue();
    fileManagerMock.checkFileExists.mockResolvedValue(false);
    fileManagerMock.writeTemplate.mockResolvedValue();
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
    fileManagerMock.checkFileExists.mockResolvedValue(true);
    const outputDir = 'test';

    await expect(initializer.initialize({ outputDir, force: false })).rejects.toThrow(
      `'ddd.config.json' already exists. Use --force to overwrite.`
    );
  });

  it('should overwrite if docs directory exists and force is true', async () => {
    fileManagerMock.checkDirectoryExists.mockReturnValue(true);
    fileManagerMock.ensureDirectoryExists.mockResolvedValue();
    fileManagerMock.copyFile.mockResolvedValue();
    fileManagerMock.checkFileExists.mockResolvedValue(false);
    fileManagerMock.writeTemplate.mockResolvedValue();
    fileManagerMock.deleteDirectory.mockResolvedValue();
    templateGeneratorMock.generate.mockResolvedValue({ success: true });

    const outputDir = 'test';
    await initializer.initialize({ outputDir, force: true });

    expect(fileManagerMock.ensureDirectoryExists).toHaveBeenCalled();
    expect(fileManagerMock.copyFile).toHaveBeenCalled();
    expect(templateGeneratorMock.generate).toHaveBeenCalled();
  });
});
