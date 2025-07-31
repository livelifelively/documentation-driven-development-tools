import * as fs from 'fs';
import * as path from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { generateHumanSchemaDocumentation, generateMachineSchemaDocumentation } from '../index.js';
import { run } from '../generate-schema-doc.js';

vi.mock('fs');
vi.mock('../index', () => ({
  generateHumanSchemaDocumentation: vi.fn(() => 'human-doc'),
  generateMachineSchemaDocumentation: vi.fn(() => 'machine-doc'),
}));

describe('generate-schema-doc script', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.mocked(fs.writeFileSync).mockClear();
    vi.mocked(fs.mkdirSync).mockClear();
    vi.mocked(generateHumanSchemaDocumentation).mockClear();
    vi.mocked(generateMachineSchemaDocumentation).mockClear();
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
    vi.mocked(generateHumanSchemaDocumentation).mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => run()).toThrow('Generation failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to generate documentation:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should create directories if they do not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(generateHumanSchemaDocumentation).mockReturnValue('human-doc');
    vi.mocked(generateMachineSchemaDocumentation).mockReturnValue('machine-doc');
    run();
    expect(fs.mkdirSync).toHaveBeenCalledTimes(4);
  });
});
