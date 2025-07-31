import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from 'vitest';
import { parseTask } from '../index.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { CoreEngine } from '../core-engine.js';
import { PluginManager } from '../plugin-manager.js';
import mockPlugin from './mock.plugin.js';

describe('Integration Test', () => {
  const testFilePath = join(process.cwd(), 'test-task.task.md');

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    // Create a test task file
    const testContent = `# Test Task

## 1.2 Status
- **Current State:** 💡 Not Started
- **Priority:** 🟥 High
- **Progress:** 0

## 2.1 Overview
This is a test task for integration testing.

## 3.1 Roadmap
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## 99.9 Mock Section
This is a mock section for testing.
`;

    writeFileSync(testFilePath, testContent);
  });

  afterAll(() => {
    // Clean up test file
    if (existsSync(testFilePath)) {
      unlinkSync(testFilePath);
    }
    // Don't delete mock.plugin.ts as it's a test utility file
  });

  it('should parse a complete task file end-to-end', async () => {
    const result = await parseTask(testFilePath);

    // Verify the result structure
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);

    // Since we don't have plugins loaded, data should be null
    // but the parsing should work without errors
    expect(result.errors).toHaveLength(0);
  });

  it('should handle missing plugins gracefully', async () => {
    const result = await parseTask(testFilePath);

    // Without plugins loaded, we should get no data but no errors
    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(0);
  });

  it('should parse a task file and extract data using a loaded plugin', async () => {
    // Arrange
    const pluginManager = new PluginManager();
    const getProcessorSpy = vi.spyOn(pluginManager, 'getProcessor').mockImplementation((sectionId: string) => {
      if (sectionId === '99.9') {
        return mockPlugin;
      }
      return undefined;
    });

    const engine = new CoreEngine(pluginManager);

    // Act
    const result = await engine.parse(testFilePath);

    // Assert
    expect(getProcessorSpy).toHaveBeenCalledWith('1.2');
    expect(getProcessorSpy).toHaveBeenCalledWith('2.1');
    expect(getProcessorSpy).toHaveBeenCalledWith('3.1');
    expect(getProcessorSpy).toHaveBeenCalledWith('99.9');
    expect(result.errors).toHaveLength(0);
    expect(result.data).not.toBeNull();
    expect(result.data).toHaveProperty('mock');
    expect((result.data as any).mock).toEqual({
      mockData: 'extracted successfully',
    });

    // Clean up spies
    getProcessorSpy.mockRestore();
  });
});
