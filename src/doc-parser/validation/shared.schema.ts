import { z } from 'zod';

// Document type enum for dynamic schema composition
export const DocumentType = z.enum(['plan', 'task']);
export type DocumentType = z.infer<typeof DocumentType>;

// Applicability enum for detailed validation
export const Applicability = z.enum(['required', 'optional', 'omitted']);
export type Applicability = z.infer<typeof Applicability>;

// Priority Drivers Enum - Based on canonical priority drivers from ddd-2.md
export const PriorityDriver = z.enum([
  // Core-Business Process (CBP)
  'CBP-Break_Block_Revenue_Legal',
  'CBP-SLA_Breach',
  'CBP-Partial_Degradation_KPI',
  'CBP-Incremental_Improvement',

  // Security / Compliance (SEC)
  'SEC-Critical_Vulnerability',
  'SEC-Data_Leak',
  'SEC-Upcoming_Compliance',
  'SEC-Hardening_Low_Risk',

  // User Experience (UX)
  'UX-Task_Abandonment',
  'UX-Severe_Usability',
  'UX-Noticeable_Friction',
  'UX-Cosmetic_Polish',

  // Marketing / Growth (MKT)
  'MKT-Launch_Critical',
  'MKT-Brand_Risk',
  'MKT-Campaign_Optimisation',
  'MKT-Long_Tail_SEO',

  // Technical Foundation / Infrastructure (TEC)
  'TEC-Prod_Stability_Blocker',
  'TEC-Dev_Productivity_Blocker',
  'TEC-Dev_Productivity_Enhancement',
  'TEC-Flaky_Test',
  'TEC-Tech_Debt_Refactor',
]);

export type PriorityDriver = z.infer<typeof PriorityDriver>;

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

// Mermaid diagram direction enum
export const MermaidDirection = z.enum(['TB', 'TD', 'BT', 'RL', 'LR']);
export type MermaidDirection = z.infer<typeof MermaidDirection>;

// Enhanced Mermaid diagram structure with direction support
export const MermaidDiagramStructure = z.object({
  type: z.literal('mermaid'),
  diagramType: z.enum(['erDiagram', 'classDiagram', 'sequenceDiagram', 'graph', 'flowchart']),
  direction: MermaidDirection.optional(),
  content: z.string().min(1),
});
export type MermaidDiagramStructure = z.infer<typeof MermaidDiagramStructure>;

// Smart parser that detects diagram type and direction from string content
export const createSmartMermaidSchema = (
  expectedType: 'erDiagram' | 'classDiagram' | 'sequenceDiagram' | 'graph' | 'flowchart'
) => {
  return z
    .string()
    .min(1)
    .refine(
      (val) => {
        const trimmed = val.trim();
        return trimmed.startsWith(expectedType);
      },
      {
        message: `Diagram must be a valid Mermaid ${expectedType}.`,
      }
    )
    .transform((val) => {
      const trimmed = val.trim();

      // Extract direction if present (e.g., "graph TD", "flowchart LR")
      let direction: MermaidDirection | undefined;
      let content = trimmed;

      if (expectedType === 'graph' || expectedType === 'flowchart') {
        const directionMatch = trimmed.match(/^(graph|flowchart)\s+(TB|TD|BT|RL|LR)\s+/i);
        if (directionMatch) {
          direction = directionMatch[2].toUpperCase() as MermaidDirection;
          content = trimmed.substring(directionMatch[0].length);
        }
      }

      return {
        type: 'mermaid' as const,
        diagramType: expectedType,
        direction,
        content: content.trim(),
      };
    });
};

// Generic schema for a section that can contain a diagram and/or text
export const createDiagramWithTextSchema = (diagramSchema: z.ZodTypeAny) =>
  z
    .object({
      diagram: diagramSchema.optional(),
      text: z.array(z.string().min(1)).optional(),
    })
    .refine((data) => data.diagram || (data.text && data.text.length > 0), {
      message: 'Section must have at least a diagram or text content.',
    });

// Specialized schema for Mermaid diagrams with text content
export const createMermaidWithTextSchema = (
  expectedType: 'erDiagram' | 'classDiagram' | 'sequenceDiagram' | 'graph' | 'flowchart',
  config: {
    diagramRequired?: boolean;
    textRequired?: boolean;
    allowTextOnly?: boolean;
    allowDiagramOnly?: boolean;
  } = {}
) => {
  const { diagramRequired = true, textRequired = false, allowTextOnly = false, allowDiagramOnly = true } = config;

  const diagramSchema = diagramRequired
    ? createSmartMermaidSchema(expectedType)
    : createSmartMermaidSchema(expectedType).optional();

  const textSchema = textRequired ? z.array(z.string().min(1)).min(1) : z.array(z.string().min(1)).optional();

  const baseSchema = z.object({
    diagram: diagramSchema,
    text: textSchema,
  });

  // Apply refinement based on configuration
  if (allowTextOnly && allowDiagramOnly) {
    // Both allowed - at least one must be present
    return baseSchema.refine((data) => data.diagram || (data.text && data.text.length > 0), {
      message: 'Section must have at least a diagram or text content.',
    });
  } else if (allowTextOnly && !allowDiagramOnly) {
    // Only text allowed
    return baseSchema.refine((data) => data.text && data.text.length > 0, {
      message: 'Section must have text content.',
    });
  } else if (!allowTextOnly && allowDiagramOnly) {
    // Only diagram allowed
    return baseSchema.refine((data) => data.diagram, {
      message: 'Section must have a diagram.',
    });
  } else {
    // Neither allowed (invalid config)
    throw new Error('Invalid configuration: at least one of text or diagram must be allowed');
  }
};

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

/**
 * Applies applicability rules to a Zod schema object to create a document-type-specific schema
 * @param schema - The base Zod schema object
 * @param rules - The applicability rules object with 'plan' and 'task' properties
 * @param docType - The document type ('plan' or 'task')
 * @returns A Zod schema for required/optional, or null for omitted sections
 */
export function applyApplicability<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  rules: { plan: string; task: string },
  docType: DocumentType
): z.ZodTypeAny | null {
  // First validate the applicability value
  let applicability: Applicability;
  try {
    applicability = getApplicability(rules, docType);
  } catch (error) {
    throw new Error(`Invalid applicability value: ${rules[docType]}`);
  }

  switch (applicability) {
    case 'required':
      // Return the schema as-is (all fields required)
      return schema;

    case 'optional':
      // Make the entire section optional (not individual fields)
      return schema.optional();

    case 'omitted':
      // Return null to indicate this section should be omitted entirely
      return null;

    default:
      // This should never happen due to Zod validation, but handle gracefully
      throw new Error(`Invalid applicability value: ${applicability}`);
  }
}

/**
 * Applies applicability rules to a Zod schema object with field-level control
 * @param schema - The base Zod schema object
 * @param fieldRules - Object mapping field names to their applicability rules
 * @param docType - The document type ('plan' or 'task')
 * @returns A new Zod schema with fields picked, omitted, or made optional based on field-level applicability
 */
export function applyFieldLevelApplicability<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fieldRules: Record<string, { plan: string; task: string }>,
  docType: DocumentType
): z.ZodObject<any> {
  const shape = schema.shape;
  const newShape: Record<string, z.ZodTypeAny> = {};

  for (const [fieldName, fieldSchema] of Object.entries(shape)) {
    const fieldRule = fieldRules[fieldName];

    if (!fieldRule) {
      // If no rule specified, keep field as-is
      newShape[fieldName] = fieldSchema as z.ZodTypeAny;
      continue;
    }

    // Validate the applicability value
    let applicability: Applicability;
    try {
      applicability = getApplicability(fieldRule, docType);
    } catch (error) {
      throw new Error(`Invalid applicability value for field ${fieldName}: ${fieldRule[docType]}`);
    }

    switch (applicability) {
      case 'required':
        // Keep field as required
        newShape[fieldName] = fieldSchema as z.ZodTypeAny;
        break;

      case 'optional':
        // Make field optional
        newShape[fieldName] = (fieldSchema as z.ZodTypeAny).optional();
        break;

      case 'omitted':
        // Skip this field entirely (it won't be in the schema)
        break;

      default:
        throw new Error(`Invalid applicability value for field ${fieldName}: ${applicability}`);
    }
  }

  // Return a strict schema so that omitted fields are rejected
  return z.object(newShape).strict();
}

/**
 * Creates a schema with applicability handling for sections that don't have field-level applicability rules.
 * This function is designed for sections where the entire section is either required, optional, or omitted
 * based on the document type, rather than having individual fields with different applicability rules.
 *
 * @param sectionName - The name of the section to find in the JSON schema
 * @param docType - The document type ('plan' or 'task')
 * @param schema - The Zod schema to apply
 * @param jsonContent - The JSON content containing section definitions
 * @returns The schema with appropriate applicability handling (required, optional, or never)
 */
export function createSectionSchemaWithApplicability(
  sectionName: string,
  docType: DocumentType,
  schema: z.ZodTypeAny,
  jsonContent: any
): z.ZodTypeAny {
  const sectionDef = jsonContent.sections.find((s: any) => s.name === sectionName);
  if (!sectionDef) {
    throw new Error(`Section '${sectionName}' not found in JSON schema`);
  }

  const applicability = getApplicability(sectionDef.applicability, docType);

  if (applicability === 'omitted') {
    return z.never();
  }

  return applicability === 'optional' ? schema.optional() : schema;
}
