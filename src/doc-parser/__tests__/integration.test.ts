import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { CoreEngine } from '../core-engine.js';
import { PluginManager } from '../plugin-manager.js';
import { SchemaProvider } from '../schema/schema-provider.js';
import { SchemaValidator } from '../schema/schema-validator.js';
import StatusPlugin from '../plugins/status.plugin.js';

// This is a full end-to-end test of the parser with a real plugin.
describe('Integration Test', () => {
  const testDir = join(process.cwd(), 'temp-test-dir');
  const testFilePath = join(testDir, 'test-task.task.md');

  beforeAll(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should parse a task file with a complete status section and find no errors', async () => {
    // Arrange: Create a file with all required fields for section 1.2
    const content = `# Test Task
## 1.2 Status
- **Current State:** 💡 Not Started
- **Priority:** 🟥 High
- **Progress:** 0
- **Planning Estimate:** 5
- **Est. Variance (pts):** 0
- **Created:** 2025-01-01 10:00
- **Implementation Started:** 2025-01-01 11:00
- **Completed:** 2025-01-01 12:00
- **Last Updated:** 2025-01-01 13:00
`;
    writeFileSync(testFilePath, content);

    const pluginManager = new PluginManager();
    const schemaProvider = new SchemaProvider();
    const schemaValidator = new SchemaValidator(schemaProvider);
    const statusPlugin = new StatusPlugin(schemaValidator);
    pluginManager.addProcessor(statusPlugin);
    const engine = new CoreEngine(pluginManager);

    // Act
    const result = await engine.parse(testFilePath);

    // Assert
    console.log('DEBUG ERRORS:', result.errors);
    expect(result.errors).toHaveLength(0);
    expect(result.data).not.toBeNull();
    if (result.data) {
      expect(result.data.meta?.status).toBeDefined();
    }
  });

  it('should return exactly two linting errors for two missing required fields', async () => {
    // Arrange: Create a file missing exactly two required fields
    const content = `# Invalid Task
## 1.2 Status
- **Progress:** 0
- **Planning Estimate:** 5
- **Est. Variance (pts):** 0
- **Created:** 2025-01-01 10:00
- **Implementation Started:** 2025-01-01 11:00
- **Completed:** 2025-01-01 12:00
- **Last Updated:** 2025-01-01 13:00
`;
    writeFileSync(testFilePath, content);

    const pluginManager = new PluginManager();
    const schemaProvider = new SchemaProvider();
    const schemaValidator = new SchemaValidator(schemaProvider);
    const statusPlugin = new StatusPlugin(schemaValidator);
    pluginManager.addProcessor(statusPlugin);
    const engine = new CoreEngine(pluginManager);

    // Act
    const result = await engine.parse(testFilePath);

    // Assert
    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(2);
    const messages = result.errors.map((e) => e.message);
    expect(messages).toContain('Required field "Current State" is missing.');
    expect(messages).toContain('Required field "Priority" is missing.');
  });
});
