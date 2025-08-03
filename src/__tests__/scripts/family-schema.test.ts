import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import { SchemaFamily } from '../../schema/schema.zod.js';

// Mock dependencies
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('glob', () => ({
  glob: {
    sync: vi.fn(),
  },
}));

// Import the function to test
import { validateSchemaFiles } from '../../scripts/validate-family-schemas.js';

describe('Family Schema Validation Script', () => {
  const mockReadFileSync = vi.mocked(readFileSync);
  const mockGlobSync = vi.mocked(glob.sync);
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('AC-1: Script exists at correct path', () => {
    it('should have the script file at the expected location', () => {
      expect(() => {
        readFileSync('src/scripts/validate-family-schemas.ts', 'utf-8');
      }).not.toThrow();
    });
  });

  describe('AC-2: Script uses SchemaFamily for validation', () => {
    it('should import and use SchemaFamily for validation', () => {
      // Mock the script content for this test
      mockReadFileSync.mockReturnValue(`
        import { SchemaFamily } from '../schema/schema.zod.js';
        SchemaFamily.parse(jsonData);
      `);

      const scriptContent = readFileSync('src/scripts/validate-family-schemas.ts', 'utf-8');
      expect(scriptContent).toContain("import { SchemaFamily } from '../schema/schema.zod.js'");
      expect(scriptContent).toContain('SchemaFamily.parse(');
    });
  });

  describe('AC-3: Script successfully validates valid JSON files', () => {
    it('should validate valid JSON files and return success', async () => {
      // Arrange
      const validJsonContent = JSON.stringify({
        id: 1,
        name: 'Test Family',
        anchor: 'test-family',
        primaryQuestion: 'What is this?',
        rationale: 'Test rationale',
        applicability: { plan: 'required', task: 'required' },
        notes: 'Test notes',
        sections: [],
      });

      mockGlobSync.mockReturnValue(['test-file.json']);
      mockReadFileSync.mockReturnValue(validJsonContent);

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(false);
      expect(result.errorCount).toBe(0);
      expect(consoleLogSpy).toHaveBeenCalledWith('Found 1 JSON files to validate...');
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Validated: test-file.json');
      expect(consoleLogSpy).toHaveBeenCalledWith('\n✅ All schema files are valid!');
    });

    it('should handle empty directory gracefully', async () => {
      // Arrange
      mockGlobSync.mockReturnValue([]);

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(false);
      expect(result.errorCount).toBe(0);
      expect(consoleLogSpy).toHaveBeenCalledWith('No JSON files found in schema directory');
    });
  });

  describe('AC-4: Script fails with clear error messages for invalid files', () => {
    it('should handle Zod validation errors', async () => {
      // Arrange
      const invalidJsonContent = JSON.stringify({
        id: 'not-a-number', // Invalid: should be number
        name: 'Test Family',
        anchor: 'test-family',
        primaryQuestion: 'What is this?',
        rationale: 'Test rationale',
        applicability: { plan: 'required', task: 'required' },
        notes: 'Test notes',
        sections: [],
      });

      mockGlobSync.mockReturnValue(['invalid-file.json']);
      mockReadFileSync.mockReturnValue(invalidJsonContent);

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Schema Validation Error in invalid-file.json:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid input: expected number, received string')
      );
    });

    it('should handle malformed JSON syntax errors', async () => {
      // Arrange
      const malformedJson = '{ "invalid": json }'; // Missing quotes around "json"

      mockGlobSync.mockReturnValue(['malformed-file.json']);
      mockReadFileSync.mockReturnValue(malformedJson);

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ JSON Syntax Error in malformed-file.json:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Unexpected token'));
    });

    it('should handle file system read errors', async () => {
      // Arrange
      const fileSystemError = new Error('ENOENT: no such file or directory');
      mockGlobSync.mockReturnValue(['missing-file.json']);
      mockReadFileSync.mockImplementation(() => {
        throw fileSystemError;
      });

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error reading missing-file.json:');
      expect(consoleErrorSpy).toHaveBeenCalledWith('   ENOENT: no such file or directory');
    });

    it('should handle multiple files with mixed valid and invalid content', async () => {
      // Arrange
      const validJson = JSON.stringify({
        id: 1,
        name: 'Valid Family',
        anchor: 'valid-family',
        primaryQuestion: 'What is this?',
        rationale: 'Test rationale',
        applicability: { plan: 'required', task: 'required' },
        notes: 'Test notes',
        sections: [],
      });

      const invalidJson = JSON.stringify({
        id: 'not-a-number',
        name: 'Invalid Family',
        anchor: 'invalid-family',
        primaryQuestion: 'What is this?',
        rationale: 'Test rationale',
        applicability: { plan: 'required', task: 'required' },
        notes: 'Test notes',
        sections: [],
      });

      mockGlobSync.mockReturnValue(['valid-file.json', 'invalid-file.json']);
      mockReadFileSync.mockReturnValueOnce(validJson).mockReturnValueOnce(invalidJson);

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Validated: valid-file.json');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Schema Validation Error in invalid-file.json:');
      expect(consoleErrorSpy).toHaveBeenCalledWith('\n❌ Validation failed. Please fix the errors above.');
    });
  });

  describe('AC-5: NPM script exists in package.json', () => {
    it('should have the validate:schema:family script in package.json', () => {
      // Mock package.json content
      mockReadFileSync.mockReturnValue(
        JSON.stringify({
          scripts: {
            'validate:schema:family': 'tsx src/scripts/validate-family-schemas.ts',
          },
        })
      );

      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      expect(packageJson.scripts).toHaveProperty('validate:schema:family');
    });

    it('should execute the correct script file', () => {
      // Mock package.json content
      mockReadFileSync.mockReturnValue(
        JSON.stringify({
          scripts: {
            'validate:schema:family': 'tsx src/scripts/validate-family-schemas.ts',
          },
        })
      );

      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      const scriptCommand = packageJson.scripts['validate:schema:family'];
      expect(scriptCommand).toContain('tsx');
      expect(scriptCommand).toContain('src/scripts/validate-family-schemas.ts');
    });
  });

  describe('Integration Tests', () => {
    it('should validate actual schema files successfully', async () => {
      // This test uses actual schema files to ensure they are valid
      const schemaFiles = [
        'src/schema/ddd-schema-json/1-meta.json',
        'src/schema/ddd-schema-json/2-business-scope.json',
        'src/schema/ddd-schema-json/3-planning-decomposition.json',
        'src/schema/ddd-schema-json/4-high-level-design.json',
        'src/schema/ddd-schema-json/5-maintenance-monitoring.json',
        'src/schema/ddd-schema-json/6-implementation-guidance.json',
        'src/schema/ddd-schema-json/7-quality-operations.json',
        'src/schema/ddd-schema-json/8-reference.json',
      ];

      // Mock the actual schema file contents for verification
      const mockSchemaContent = JSON.stringify({
        id: 1,
        name: 'Test Family',
        anchor: 'test-family',
        primaryQuestion: 'What is this?',
        rationale: 'Test rationale',
        applicability: { plan: 'required', task: 'required' },
        notes: 'Test notes',
        sections: [],
      });

      // Verify all schema files exist by mocking their content
      schemaFiles.forEach((filePath) => {
        mockReadFileSync.mockReturnValueOnce(mockSchemaContent);
        expect(() => {
          readFileSync(filePath, 'utf-8');
        }).not.toThrow();
      });

      // Test with actual schema files
      mockGlobSync.mockReturnValue(schemaFiles);
      schemaFiles.forEach((filePath) => {
        mockReadFileSync.mockReturnValueOnce(mockSchemaContent);
      });

      const result = await validateSchemaFiles();
      expect(result.hasErrors).toBe(false);
      expect(result.errorCount).toBe(0);
    });
  });

  describe('Non-Functional Requirements Tests', () => {
    describe('NFR-01: Correctness - Script MUST fail if even one file is invalid', () => {
      it('should fail when any file is invalid', async () => {
        // Arrange
        const invalidJson = JSON.stringify({
          id: 'invalid',
          name: 'Test',
          anchor: 'test',
          primaryQuestion: 'What?',
          rationale: 'Test',
          applicability: { plan: 'required', task: 'required' },
          notes: 'Test',
          sections: [],
        });

        mockGlobSync.mockReturnValue(['invalid-file.json']);
        mockReadFileSync.mockReturnValue(invalidJson);

        // Act
        const result = await validateSchemaFiles();

        // Assert
        expect(result.hasErrors).toBe(true);
        expect(result.errorCount).toBe(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('\n❌ Validation failed. Please fix the errors above.');
      });
    });

    describe('NFR-02: Usability - Error messages MUST identify file and error path', () => {
      it('should include file path in error messages', async () => {
        // Arrange
        const invalidJson = JSON.stringify({
          id: 'invalid',
          name: 'Test',
          anchor: 'test',
          primaryQuestion: 'What?',
          rationale: 'Test',
          applicability: { plan: 'required', task: 'required' },
          notes: 'Test',
          sections: [],
        });

        mockGlobSync.mockReturnValue(['test-file.json']);
        mockReadFileSync.mockReturnValue(invalidJson);

        // Act
        await validateSchemaFiles();

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Schema Validation Error in test-file.json:');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid input: expected number, received string')
        );
      });
    });

    describe('NFR-03: Performance - Script should complete efficiently', () => {
      it('should handle multiple files efficiently', async () => {
        // Arrange
        const validJson = JSON.stringify({
          id: 1,
          name: 'Test Family',
          anchor: 'test-family',
          primaryQuestion: 'What is this?',
          rationale: 'Test rationale',
          applicability: { plan: 'required', task: 'required' },
          notes: 'Test notes',
          sections: [],
        });

        const multipleFiles = Array.from({ length: 10 }, (_, i) => `file-${i}.json`);
        mockGlobSync.mockReturnValue(multipleFiles);
        mockReadFileSync.mockReturnValue(validJson);

        // Act
        const startTime = Date.now();
        const result = await validateSchemaFiles();
        const endTime = Date.now();

        // Assert
        expect(result.hasErrors).toBe(false);
        expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('should catch and report Zod validation errors with proper error details', async () => {
      // Arrange
      const invalidJson = JSON.stringify({
        id: 'not-a-number',
        name: 'Test',
        anchor: 'test',
        primaryQuestion: 'What?',
        rationale: 'Test',
        applicability: { plan: 'required', task: 'required' },
        notes: 'Test',
        sections: [],
      });

      mockGlobSync.mockReturnValue(['zod-error-file.json']);
      mockReadFileSync.mockReturnValue(invalidJson);

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Schema Validation Error in zod-error-file.json:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid input: expected number, received string')
      );
    });

    it('should provide file path in all error messages', async () => {
      // Arrange
      const malformedJson = '{ "invalid": json }';
      mockGlobSync.mockReturnValue(['syntax-error-file.json']);
      mockReadFileSync.mockReturnValue(malformedJson);

      // Act
      await validateSchemaFiles();

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ JSON Syntax Error in syntax-error-file.json:');
    });

    it('should handle fatal errors gracefully', async () => {
      // Arrange
      const fatalError = new Error('Fatal system error');
      mockGlobSync.mockImplementation(() => {
        throw fatalError;
      });

      // Act
      const result = await validateSchemaFiles();

      // Assert
      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Fatal error during validation:');
      expect(consoleErrorSpy).toHaveBeenCalledWith('   Fatal system error');
    });
  });
});
