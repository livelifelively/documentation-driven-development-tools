import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SchemaProvider } from '../../../doc-parser/schema/schema-provider.js';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

describe('SchemaProvider', () => {
  let schemaProvider: SchemaProvider;
  const mockFs = vi.mocked(fs);

  beforeEach(() => {
    schemaProvider = new SchemaProvider();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loadSchema', () => {
    it('should load a valid JSON schema file successfully', () => {
      // Arrange
      const mockFamilySchema = {
        id: 1,
        name: 'Meta & Governance',
        anchor: 'meta--governance',
        primaryQuestion: 'How critical is this work, what is its current status?',
        sections: [
          {
            id: '1.2',
            name: 'Status',
            headingLevel: 3,
            applicability: { plan: true, task: true },
            notes: 'Plan: Document lifecycle + strategic phase. Task: Implementation tracking + execution metrics.',
          },
        ],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFamilySchema));

      // Act
      const result = schemaProvider.loadSchema('1.2');

      // Assert
      expect(result).toEqual(mockFamilySchema.sections[0]);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('1-meta.json'), 'utf-8');
    });

    it('should throw an error when family ID is unknown', () => {
      // Act & Assert
      expect(() => schemaProvider.loadSchema('9.9')).toThrow('Unknown family ID: 9');
      expect(mockFs.existsSync).not.toHaveBeenCalled();
      expect(mockFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should throw an error when schema file does not exist', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(false);

      // Act & Assert
      expect(() => schemaProvider.loadSchema('1.9')).toThrow('Schema file not found for family: 1 (1-meta.json)');
      expect(mockFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should throw an error when schema file contains invalid JSON', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json content');

      // Act & Assert
      expect(() => schemaProvider.loadSchema('1.2')).toThrow('Invalid JSON schema for family: 1');
    });

    it('should throw an error when section is not found in family schema', () => {
      // Arrange
      const mockFamilySchema = {
        sections: [{ id: '1.2', name: 'Status' }],
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFamilySchema));

      // Act & Assert
      expect(() => schemaProvider.loadSchema('1.9')).toThrow('Section 1.9 not found in family schema 1');
    });

    it('should cache schema after first load and return cached version', () => {
      // Arrange
      const mockFamilySchema = {
        sections: [
          {
            id: '1.2',
            name: 'Status',
            fields: [],
          },
        ],
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFamilySchema));

      // Act
      const result1 = schemaProvider.loadSchema('1.2');
      const result2 = schemaProvider.loadSchema('1.2');

      // Assert
      expect(result1).toEqual(mockFamilySchema.sections[0]);
      expect(result2).toEqual(mockFamilySchema.sections[0]);
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(1); // Should only read once due to caching
    });

    it('should handle different section IDs correctly', () => {
      // Arrange
      const mockFamilySchema1 = {
        sections: [
          { id: '1.2', name: 'Status' },
          { id: '1.3', name: 'Priority Drivers' },
        ],
      };
      const mockFamilySchema2 = {
        sections: [{ id: '2.1', name: 'Overview' }],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockFamilySchema1))
        .mockReturnValueOnce(JSON.stringify(mockFamilySchema2));

      // Act
      const result1 = schemaProvider.loadSchema('1.2');
      const result2 = schemaProvider.loadSchema('2.1');

      // Assert
      expect(result1).toEqual(mockFamilySchema1.sections[0]);
      expect(result2).toEqual(mockFamilySchema2.sections[0]);
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
      expect(mockFs.readFileSync).toHaveBeenNthCalledWith(1, expect.stringContaining('1-meta.json'), 'utf-8');
      expect(mockFs.readFileSync).toHaveBeenNthCalledWith(2, expect.stringContaining('2-business-scope.json'), 'utf-8');
    });

    it('should use the correct file path for schema loading', () => {
      // Arrange
      const mockFamilySchema = {
        sections: [{ id: '3.1', name: 'Test Section' }],
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFamilySchema));

      // Act
      schemaProvider.loadSchema('3.1');

      // Assert
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/.*3-planning-decomposition\.json$/),
        'utf-8'
      );
    });
  });

  describe('clearCache', () => {
    it('should clear the schema cache', () => {
      // Arrange
      const mockFamilySchema = {
        sections: [{ id: '1.2', name: 'Status' }],
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockFamilySchema));

      // Load schema to populate cache
      schemaProvider.loadSchema('1.2');

      // Act
      schemaProvider.clearCache();
      schemaProvider.loadSchema('1.2');

      // Assert
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2); // Should read twice after cache clear
    });
  });
});
