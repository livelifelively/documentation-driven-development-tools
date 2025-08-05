import { z } from 'zod';

// Document type enum for dynamic schema composition
export const DocumentType = z.enum(['plan', 'task']);
export type DocumentType = z.infer<typeof DocumentType>;

// Applicability enum for detailed validation
export const Applicability = z.enum(['required', 'optional', 'omitted']);
export type Applicability = z.infer<typeof Applicability>;

// Configuration for schema family definitions
export interface SchemaFamilyConfig {
  id: number;
  name: string;
  jsonFileName: string;
}

// Default schema family configuration
export const DEFAULT_SCHEMA_FAMILIES: SchemaFamilyConfig[] = [
  { id: 1, name: 'meta', jsonFileName: '1-meta.json' },
  { id: 2, name: 'business-scope', jsonFileName: '2-business-scope.json' },
  { id: 3, name: 'planning-decomposition', jsonFileName: '3-planning-decomposition.json' },
  { id: 4, name: 'high-level-design', jsonFileName: '4-high-level-design.json' },
  { id: 5, name: 'maintenance-monitoring', jsonFileName: '5-maintenance-monitoring.json' },
  { id: 6, name: 'implementation-guidance', jsonFileName: '6-implementation-guidance.json' },
  { id: 7, name: 'quality-operations', jsonFileName: '7-quality-operations.json' },
  { id: 8, name: 'reference', jsonFileName: '8-reference.json' },
];

// Configuration for schema loading
export interface SchemaLoadingConfig {
  schemaDirectory: string;
  families: SchemaFamilyConfig[];
}

// Default schema loading configuration
export const DEFAULT_SCHEMA_LOADING_CONFIG: SchemaLoadingConfig = {
  schemaDirectory: '../../schema/ddd-schema-json',
  families: DEFAULT_SCHEMA_FAMILIES,
};

// Shared enums for validation
export const StatusKey = z.enum(['Not Started', 'In Progress', 'Under Review', 'Complete', 'Blocked']);
export const PriorityLevel = z.enum(['High', 'Medium', 'Low']);
export const DependencyStatus = z.enum(['Complete', 'Blocked', 'In Progress']);
export const DependencyType = z.enum(['External', 'Internal']);
export const TestType = z.enum(['Unit', 'Integration', 'E2E', 'Performance', 'Security']);

// Shared types
export type StatusKey = z.infer<typeof StatusKey>;
export type PriorityLevel = z.infer<typeof PriorityLevel>;
export type DependencyStatus = z.infer<typeof DependencyStatus>;
export type DependencyType = z.infer<typeof DependencyType>;
export type TestType = z.infer<typeof TestType>;

// Shared validation helpers
export const NonEmptyString = z.string().min(1);
export const NonEmptyStringArray = z.array(NonEmptyString).min(1);

// Reusable date-time string schema for YYYY-MM-DD HH:MM format
export const DateTimeString = z.string().refine(
  (val) => {
    // Check format: YYYY-MM-DD HH:MM
    const parts = val.split(' ');
    if (parts.length !== 2) return false;

    const datePart = parts[0];
    const timePart = parts[1];

    // Date part: YYYY-MM-DD
    const dateParts = datePart.split('-');
    if (dateParts.length !== 3) return false;

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Time part: HH:MM
    const timeParts = timePart.split(':');
    if (timeParts.length !== 2) return false;

    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    if (isNaN(hour) || isNaN(minute)) return false;
    if (hour < 0 || hour > 23) return false;
    if (minute < 0 || minute > 59) return false;

    return true;
  },
  {
    message: "Date must be in format 'YYYY-MM-DD HH:MM'",
  }
);

// Helper functions to read and process applicability rules from ddd-schema-json files

/**
 * Determines the applicability of a section or field for a given document type
 * @param applicability - The applicability object from the JSON schema
 * @param docType - The document type ('plan' or 'task')
 * @returns The applicability level: 'required', 'optional', or 'omitted'
 */
export function getApplicability(applicability: { plan: string; task: string }, docType: DocumentType): Applicability {
  const value = applicability[docType];
  return Applicability.parse(value);
}

/**
 * Determines if a section or field is applicable for a given document type
 * @param applicability - The applicability object from the JSON schema
 * @param docType - The document type ('plan' or 'task')
 * @returns true if the section/field should be included, false if omitted
 */
export function isApplicable(applicability: { plan: string; task: string }, docType: DocumentType): boolean {
  const value = getApplicability(applicability, docType);
  return value === 'required' || value === 'optional';
}

/**
 * Gets the family configuration by ID
 * @param familyId - The family ID
 * @param config - The schema loading configuration (uses default if not provided)
 * @returns The family configuration
 */
export function getFamilyConfig(
  familyId: number,
  config: SchemaLoadingConfig = DEFAULT_SCHEMA_LOADING_CONFIG
): SchemaFamilyConfig {
  const family = config.families.find((f) => f.id === familyId);
  if (!family) {
    throw new Error(`Unknown family ID: ${familyId}`);
  }
  return family;
}

/**
 * Loads and validates a schema definition from the ddd-schema-json directory
 * @param familyId - The family ID
 * @param config - The schema loading configuration (uses default if not provided)
 * @returns The parsed schema definition
 */
export async function loadSchemaDefinition(
  familyId: number,
  config: SchemaLoadingConfig = DEFAULT_SCHEMA_LOADING_CONFIG
): Promise<any> {
  try {
    const familyConfig = getFamilyConfig(familyId, config);
    const module = await import(`${config.schemaDirectory}/${familyConfig.jsonFileName}`);
    return module.default;
  } catch (error) {
    throw new Error(`Failed to load schema definition for family ${familyId}: ${error}`);
  }
}

/**
 * Loads all schema definitions from the ddd-schema-json directory
 * @param config - The schema loading configuration (uses default if not provided)
 * @returns Array of all schema definitions
 */
export async function loadAllSchemaDefinitions(
  config: SchemaLoadingConfig = DEFAULT_SCHEMA_LOADING_CONFIG
): Promise<any[]> {
  const definitions: any[] = [];

  for (const family of config.families) {
    try {
      const definition = await loadSchemaDefinition(family.id, config);
      definitions.push(definition);
    } catch (error) {
      console.warn(`Warning: Could not load schema definition for family ${family.id}:`, error);
    }
  }

  return definitions;
}
