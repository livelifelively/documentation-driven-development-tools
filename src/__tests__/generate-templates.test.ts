import * as fs from 'fs';
import * as path from 'path';
import { generatePlanTemplate, generateTaskTemplate } from '../index.js';
import { run } from '../generate-templates.js';

jest.mock('fs');
jest.mock('../index', () => ({
  generatePlanTemplate: jest.fn(() => 'plan-template'),
  generateTaskTemplate: jest.fn(() => 'task-template'),
}));

describe('generate-templates script', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fs.writeFileSync as jest.Mock).mockClear();
    (fs.mkdirSync as jest.Mock).mockClear();
    (generatePlanTemplate as jest.Mock).mockClear();
    (generateTaskTemplate as jest.Mock).mockClear();
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
    (generatePlanTemplate as jest.Mock).mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => run()).toThrow('Generation failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to generate templates:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should create directories if they do not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (generatePlanTemplate as jest.Mock).mockReturnValue('plan-template');
    (generateTaskTemplate as jest.Mock).mockReturnValue('task-template');
    run();
    expect(fs.mkdirSync).toHaveBeenCalledTimes(4);
  });
});
