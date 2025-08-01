import * as fs from 'fs';
import * as path from 'path';

// Mapping of family IDs to their file names
const FAMILY_FILE_MAPPING: Record<string, string> = {
  '1': '1-meta',
  '2': '2-business-scope',
  '3': '3-planning-decomposition',
  '4': '4-high-level-design',
  '5': '5-maintenance-monitoring',
  '6': '6-implementation-guidance',
  '7': '7-quality-operations',
  '8': '8-reference',
};

/**
 * SchemaProvider handles loading JSON schema definitions from the file system.
 * It provides caching to avoid repeated file I/O operations.
 */
export class SchemaProvider {
  private schemaCache: Map<string, object> = new Map();
  private readonly schemaDirectory: string;

  constructor(schemaDirectory?: string) {
    // Default to the ddd-schema-json directory relative to the project root
    this.schemaDirectory = schemaDirectory || path.join(process.cwd(), 'src', 'ddd-schema-json');
  }

  /**
   * Loads a schema definition for a specific section.
   * @param sectionId The section identifier (e.g., '1.2', '1.3')
   * @returns The parsed JSON schema object for the specific section
   * @throws Error if the schema file doesn't exist or contains invalid JSON
   */
  loadSchema(sectionId: string): object {
    // Check cache first
    if (this.schemaCache.has(sectionId)) {
      return this.schemaCache.get(sectionId)!;
    }

    // Extract family ID from section ID (e.g., '1.2' -> '1', '2.1' -> '2')
    const familyId = sectionId.split('.')[0];

    // Get the correct file name for this family
    const familyFileName = FAMILY_FILE_MAPPING[familyId];
    if (!familyFileName) {
      throw new Error(`Unknown family ID: ${familyId}`);
    }

    const familyFilePath = path.join(this.schemaDirectory, `${familyFileName}.json`);

    // Check if family file exists
    if (!fs.existsSync(familyFilePath)) {
      throw new Error(`Schema file not found for family: ${familyId} (${familyFileName}.json)`);
    }

    try {
      // Read and parse the family JSON file
      const fileContent = fs.readFileSync(familyFilePath, 'utf-8');
      const familySchema = JSON.parse(fileContent);

      // Find the specific section within the family schema
      const section = familySchema.sections?.find((s: any) => s.id === sectionId);
      if (!section) {
        throw new Error(`Section ${sectionId} not found in family schema ${familyId}`);
      }

      // Cache the result
      this.schemaCache.set(sectionId, section);

      return section;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON schema for family: ${familyId}`);
      }
      throw error;
    }
  }

  /**
   * Clears the schema cache.
   * Useful for testing or when schemas are updated.
   */
  clearCache(): void {
    this.schemaCache.clear();
  }

  /**
   * Gets the current cache size.
   * @returns The number of cached schemas
   */
  getCacheSize(): number {
    return this.schemaCache.size;
  }

  /**
   * Checks if a schema is cached.
   * @param sectionId The section identifier
   * @returns True if the schema is cached, false otherwise
   */
  isCached(sectionId: string): boolean {
    return this.schemaCache.has(sectionId);
  }
}
