import { SchemaProvider } from './schema-provider.js';
import { LintingError } from '../plugin.types.js';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

/**
 * SchemaValidator provides validation utilities for AST nodes against schema definitions.
 * It validates required fields and field types based on the canonical schema.
 */
export class SchemaValidator {
  private schemaProvider: SchemaProvider;

  constructor(schemaProvider: SchemaProvider) {
    this.schemaProvider = schemaProvider;
  }

  /**
   * Validates that all required fields defined in the schema exist in the AST.
   * @param astNode The AST node to validate
   * @param schemaId The schema identifier to load
   * @param documentType The type of document ('plan' or 'task')
   * @returns Array of LintingError objects (empty if no errors)
   */
  validateRequiredFields(astNode: Root, schemaId: string, documentType: 'plan' | 'task' = 'task'): LintingError[] {
    const errors: LintingError[] = [];
    const schema = this.schemaProvider.loadSchema(schemaId);

    // Extract the section from the schema based on the AST node
    const section = this.findSectionForNode(astNode, schema);
    if (!section || !section.fields) {
      return errors;
    }

    // Get all text content from the AST
    const content = toString(astNode);

    // Check each field's applicability
    for (const field of section.fields) {
      const applicability = field.applicability?.[documentType];
      if (applicability === 'required') {
        if (!this.fieldExistsInContent(field.name, content)) {
          errors.push({
            section: `${section.id} ${section.name}`,
            message: `Required field "${field.name}" is missing`,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validates that a specific field's value matches the type defined in the schema.
   * @param fieldName The field name to validate
   * @param value The field value to validate
   * @param schemaId The schema identifier to load
   * @returns Array of LintingError objects (empty if no errors)
   */
  validateFieldType(fieldName: string, value: any, schemaId: string): LintingError[] {
    const errors: LintingError[] = [];
    const schema = this.schemaProvider.loadSchema(schemaId);

    // Find the section that contains this field
    const section = this.findSectionForField(fieldName, schema);
    if (!section || !section.fields) {
      return errors; // Field not defined in schema, skip validation
    }

    const field = section.fields.find((f: any) => f.name === fieldName);
    if (!field) {
      return errors; // Field not found
    }

    const expectedType = field.type;
    const stringValue = String(value);

    if (!this.isValidType(stringValue, expectedType)) {
      errors.push({
        section: `${section.id} ${section.name}`,
        message: `Field "${fieldName}" must be a ${expectedType}, got "${stringValue}"`,
      });
    }

    return errors;
  }

  /**
   * Validates both required fields and field types for a section.
   * @param astNode The AST node to validate
   * @param schemaId The schema identifier to load
   * @param documentType The type of document ('plan' or 'task')
   * @returns Array of LintingError objects (empty if no errors)
   */
  validateSection(astNode: Root, schemaId: string, documentType: 'plan' | 'task' = 'task'): LintingError[] {
    const errors: LintingError[] = [];

    // Validate required fields
    errors.push(...this.validateRequiredFields(astNode, schemaId, documentType));

    // Validate field types for fields that exist
    const content = toString(astNode);
    const schema = this.schemaProvider.loadSchema(schemaId);
    const section = this.findSectionForNode(astNode, schema);

    if (section && section.fields) {
      for (const field of section.fields) {
        const fieldValue = this.extractFieldValue(field.name, content);
        if (fieldValue !== null) {
          errors.push(...this.validateFieldType(field.name, fieldValue, schemaId));
        }
      }
    }

    return errors;
  }

  /**
   * Finds the appropriate section in the schema for the given AST node.
   * @param astNode The AST node
   * @param schema The loaded schema
   * @returns The matching section or null
   */
  private findSectionForNode(astNode: Root, schema: any): any {
    if (!schema.sections) {
      return null;
    }

    // Try to match by heading text
    const headingText = this.extractHeadingText(astNode);
    if (headingText) {
      return schema.sections.find((section: any) => section.name.toLowerCase() === headingText.toLowerCase());
    }

    return null;
  }

  /**
   * Finds the section that contains the specified field.
   * @param fieldName The field name
   * @param schema The loaded schema
   * @returns The matching section or null
   */
  private findSectionForField(fieldName: string, schema: any): any {
    if (!schema.sections) {
      return null;
    }

    return schema.sections.find(
      (section: any) => section.fields && section.fields.some((field: any) => field.name === fieldName)
    );
  }

  /**
   * Extracts the heading text from an AST node.
   * @param astNode The AST node
   * @returns The heading text or null
   */
  private extractHeadingText(astNode: Root): string | null {
    let headingText: string | null = null;

    visit(astNode, 'heading', (node) => {
      if (node.depth === 3) {
        // Level 3 heading
        headingText = toString(node);
      }
    });

    return headingText;
  }

  /**
   * Checks if a field exists in the content.
   * @param fieldName The field name to check
   * @param content The content to search in
   * @returns True if the field exists, false otherwise
   */
  private fieldExistsInContent(fieldName: string, content: string): boolean {
    const searchPattern = `**${fieldName}:**`;
    return content.toLowerCase().includes(searchPattern.toLowerCase());
  }

  /**
   * Extracts the value of a field from the content.
   * @param fieldName The field name
   * @param content The content to search in
   * @returns The field value or null if not found
   */
  private extractFieldValue(fieldName: string, content: string): string | null {
    const searchPattern = `**${fieldName}:**`;
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.toLowerCase().includes(searchPattern.toLowerCase())) {
        // Find the exact pattern match
        const patternIndex = line.toLowerCase().indexOf(searchPattern.toLowerCase());
        if (patternIndex !== -1) {
          const afterPattern = line.substring(patternIndex + searchPattern.length);
          return afterPattern.trim();
        }
      }
    }

    return null;
  }

  /**
   * Validates if a value matches the expected type.
   * @param value The value to validate
   * @param expectedType The expected type
   * @returns True if the value matches the type, false otherwise
   */
  private isValidType(value: string, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
      case 'status_key':
      case 'priority_level':
      case 'timestamp':
        return true; // All values are strings in markdown
      case 'number':
      case 'percentage':
        return !isNaN(Number(value)) && value.trim() !== '';
      case 'boolean':
        return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
      default:
        return true; // Unknown types are considered valid
    }
  }
}
