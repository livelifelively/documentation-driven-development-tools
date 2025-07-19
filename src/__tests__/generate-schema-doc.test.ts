import * as fs from 'fs';
import * as path from 'path';
import { generateHumanSchemaDocumentation, generateMachineSchemaDocumentation } from '../index';
import { run } from '../generate-schema-doc';

jest.mock('fs');
jest.mock('../index', () => ({
  generateHumanSchemaDocumentation: jest.fn(() => 'human-doc'),
  generateMachineSchemaDocumentation: jest.fn(() => 'machine-doc'),
}));

describe('generate-schema-doc script', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fs.writeFileSync as jest.Mock).mockClear();
    (fs.mkdirSync as jest.Mock).mockClear();
    (generateHumanSchemaDocumentation as jest.Mock).mockClear();
    (generateMachineSchemaDocumentation as jest.Mock).mockClear();
  });

  it('should generate both human and machine-readable docs', () => {
    run();
    expect(generateHumanSchemaDocumentation).toHaveBeenCalledTimes(1);
    expect(generateMachineSchemaDocumentation).toHaveBeenCalledTimes(1);
    const humanSrcPath = path.join(__dirname, '..', 'generated-schema-docs', 'ddd-2-schema.human.md');
    const machineSrcPath = path.join(__dirname, '..', 'generated-schema-docs', 'ddd-2-schema.machine.md');
    const humanDocsPath = path.join(__dirname, '..', '..', 'docs', 'ddd-2-schema.human.md');
    const machineDocsPath = path.join(__dirname, '..', '..', 'docs', 'ddd-2-schema.machine.md');
    expect(fs.writeFileSync).toHaveBeenCalledWith(humanSrcPath, 'human-doc', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(machineSrcPath, 'machine-doc', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(humanDocsPath, 'human-doc', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(machineDocsPath, 'machine-doc', 'utf8');
  });

  it('should log an error and throw if generation fails', () => {
    (generateHumanSchemaDocumentation as jest.Mock).mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => run()).toThrow('Generation failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to generate documentation:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should create directories if they do not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (generateHumanSchemaDocumentation as jest.Mock).mockReturnValue('human-doc');
    (generateMachineSchemaDocumentation as jest.Mock).mockReturnValue('machine-doc');
    run();
    expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
  });
});
