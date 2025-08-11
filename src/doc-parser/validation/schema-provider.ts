import { z } from 'zod';
import { createTaskSchema, createPlanSchema } from './index.js';

// Types for the schema provider API
export interface LintingError {
  sectionId: string;
  familyId: string;
  field: string;
  message: string;
  path: string;
  lineNumber: number;
}

export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: LintingError[];
}

export interface DocumentData {
  docType: 'plan' | 'task';
  sections: Record<string, any>;
}

export interface SchemaProvider {
  getDocumentSchema: (docType: 'plan' | 'task') => Promise<z.ZodTypeAny>;
  validate: (document: DocumentData) => Promise<ValidationResult>;
}

/**
 * Maps Zod validation issues to standardized LintingError format
 * @param issues - Array of Zod issues from validation
 * @param documentData - The document data being validated
 * @returns Array of LintingError objects
 */
function mapZodIssuesToLintingErrors(issues: z.ZodIssue[], documentData: DocumentData): LintingError[] {
  return issues.map((issue) => {
    // Extract section and field information from the path
    const pathParts = issue.path;
    let sectionId = 'unknown';
    let familyId = 'unknown';
    let field = 'unknown';

    if (pathParts.length >= 1) {
      familyId = String(pathParts[0]);
    }
    if (pathParts.length >= 2) {
      sectionId = String(pathParts[1]);
    }
    if (pathParts.length >= 3) {
      field = String(pathParts[2]);
    }

    return {
      sectionId,
      familyId,
      field,
      message: issue.message,
      path: issue.path.join('.'),
      lineNumber: 0, // Line number not available from Zod, defaulting to 0
    };
  });
}

/**
 * Creates a schema provider that composes family schemas and provides validation
 * @returns A SchemaProvider instance
 */
export async function createSchemaProvider(): Promise<SchemaProvider> {
  // Cache for composed schemas
  const schemaCache = new Map<string, z.ZodTypeAny>();

  const provider: SchemaProvider = {
    /**
     * Gets the appropriate document schema for the given document type
     * @param docType - The document type ('plan' or 'task')
     * @returns The composed Zod schema for the document type
     */
    async getDocumentSchema(docType: 'plan' | 'task'): Promise<z.ZodTypeAny> {
      const cacheKey = docType;

      if (schemaCache.has(cacheKey)) {
        return schemaCache.get(cacheKey)!;
      }

      let schema: z.ZodTypeAny;

      try {
        if (docType === 'task') {
          schema = await createTaskSchema();
        } else {
          schema = await createPlanSchema();
        }

        schemaCache.set(cacheKey, schema);
        return schema;
      } catch (error) {
        throw new Error(`Failed to create schema for document type '${docType}': ${error}`);
      }
    },

    /**
     * Validates a document against the appropriate schema
     * @param document - The document data to validate
     * @returns ValidationResult with success status and any errors
     */
    async validate(document: DocumentData): Promise<ValidationResult> {
      try {
        // Validate input parameters
        if (!document || !document.docType || !document.sections) {
          return {
            success: false,
            errors: [
              {
                sectionId: 'validation',
                familyId: 'provider',
                field: 'input',
                message: 'Invalid input parameters: document, docType, and sections are required',
                path: 'input',
                lineNumber: 0,
              },
            ],
          };
        }

        // Get the appropriate schema for the document type
        const schema = await provider.getDocumentSchema(document.docType);

        // Validate the document against the schema
        const result = schema.safeParse(document.sections);

        if (result.success) {
          return {
            success: true,
            data: result.data,
          };
        } else {
          // Map Zod issues to LintingError format
          const errors = mapZodIssuesToLintingErrors(result.error.issues, document);

          return {
            success: false,
            errors,
          };
        }
      } catch (error) {
        // Handle schema composition errors
        return {
          success: false,
          errors: [
            {
              sectionId: 'validation',
              familyId: 'provider',
              field: 'schema',
              message: `Schema composition failed: ${error instanceof Error ? error.message : String(error)}`,
              path: 'schema',
              lineNumber: 0,
            },
          ],
        };
      }
    },
  };

  return provider;
}
