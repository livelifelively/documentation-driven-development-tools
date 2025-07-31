import * as fs from 'fs';
import * as path from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { generatePlanTemplate, generateTaskTemplate } from '../index.js';
import { run } from '../generate-templates.js';

vi.mock('fs');
vi.mock('../index', () => ({
  generatePlanTemplate: vi.fn(() => 'plan-template'),
  generateTaskTemplate: vi.fn(() => 'task-template'),
}));

describe('generate-templates script', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.mocked(fs.writeFileSync).mockClear();
    vi.mocked(fs.mkdirSync).mockClear();
    vi.mocked(generatePlanTemplate).mockClear();
    vi.mocked(generateTaskTemplate).mockClear();
  });

  it('should generate both plan and task templates', () => {
    run();
    expect(generatePlanTemplate).toHaveBeenCalledTimes(1);
    expect(generateTaskTemplate).toHaveBeenCalledTimes(1);
    const planSrcPath = path.join(__dirname, '..', 'templates', 'plan.template.md');
    const taskSrcPath = path.join(__dirname, '..', 'templates', 'task.template.md');
    const planDocsPath = path.join(__dirname, '..', '..', 'docs', 'templates', 'plan.template.md');
    const taskDocsPath = path.join(__dirname, '..', '..', 'docs', 'templates', 'task.template.md');
    expect(fs.writeFileSync).toHaveBeenCalledWith(planSrcPath, 'plan-template', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(taskSrcPath, 'task-template', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(planDocsPath, 'plan-template', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(taskDocsPath, 'task-template', 'utf8');
  });

  it('should log an error and throw if generation fails', () => {
    vi.mocked(generatePlanTemplate).mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => run()).toThrow('Generation failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to generate templates:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should create directories if they do not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(generatePlanTemplate).mockReturnValue('plan-template');
    vi.mocked(generateTaskTemplate).mockReturnValue('task-template');
    run();
    expect(fs.mkdirSync).toHaveBeenCalledTimes(4);
  });
});
