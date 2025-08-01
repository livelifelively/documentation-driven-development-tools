import { SchemaProvider } from './schema-provider.js';
import { LintingError } from '../plugin.types.js';

/**
 * SchemaValidator provides validation utilities for data objects against schema definitions.
 * It validates required fields and field types based on the canonical schema.
 */
export class SchemaValidator {
  private schemaProvider: SchemaProvider;

  constructor(schemaProvider: SchemaProvider) {
    this.schemaProvider = schemaProvider;
  }

  /**
   * Validates a data object against a section's schema.
   * @param data The key-value data object extracted by a plugin.
   * @param sectionId The schema identifier to load (e.g., '1.2').
   * @param documentType The type of document ('plan' or 'task').
   * @returns Array of LintingError objects (empty if no errors).
   */
  public validate(
    data: Record<string, any>,
    sectionId: string,
    documentType: 'plan' | 'task' = 'task'
  ): LintingError[] {
    const errors: LintingError[] = [];
    const schema = this.schemaProvider.loadSchema(sectionId) as any;

    if (!schema || !schema.fields) {
      // If schema or fields are not defined, we cannot validate.
      return errors;
    }

    const dataKeysLower = Object.keys(data).map((k) => k.toLowerCase());
    const schemaFieldsLower = schema.fields.map((f: any) => f.name.toLowerCase().replace(/\s+/g, ''));

    for (const field of schema.fields) {
      const schemaFieldNameCamel = field.name.replace(/\s+/g, '').replace(/^\w/, (c: string) => c.toLowerCase());

      const applicability = field.applicability?.[documentType];

      // Find the corresponding key in the data object, case-insensitively
      const dataKey = Object.keys(data).find((k) => k.toLowerCase() === schemaFieldNameCamel.toLowerCase());

      // 1. Check for required fields
      if (applicability === 'required' && !dataKey) {
        errors.push({
          section: `${schema.id} ${schema.name}`,
          message: `Required field "${field.name}" is missing.`,
        });
        continue; // No need to type-check a missing field
      }

      // 2. Check for field type if the field exists in the data
      if (dataKey) {
        const value = data[dataKey];
        if (!this.isValidType(value, field.type)) {
          errors.push({
            section: `${schema.id} ${schema.name}`,
            message: `Field "${field.name}" must be a ${field.type}, but received type ${typeof value}.`,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validates if a value matches the expected type from the schema.
   * @param value The value to validate.
   * @param expectedType The expected type from the schema.
   * @returns True if the value matches the type, false otherwise.
   */
  private isValidType(value: any, expectedType: string): boolean {
    if (value === null || value === undefined) {
      return false; // or true if optional, but required check handles this
    }

    switch (expectedType) {
      case 'string':
      case 'status_key':
      case 'priority_level':
      case 'timestamp':
        return typeof value === 'string';
      case 'number':
      case 'percentage':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      default:
        return true; // Unknown types are considered valid
    }
  }
}
