import { z } from 'zod';
import { DocumentType, createSectionSchemaWithApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';
import { camelCase } from 'lodash-es';

// Load JSON definition for Family 5
const maintenanceMonitoringContent = loadDDDSchemaJsonFile('5-maintenance-monitoring.json');

// --- Field-Level Schemas (internal only) ---

// Error Handling (Target) - row schema
const ErrorHandlingRowSchema = z.object({
  id: z.string().min(1),
  errorType: z.string().min(1),
  trigger: z.string().min(1),
  action: z.string().min(1),
  userFeedback: z.string().min(1),
});

// Error Handling (Target) - table schema
const ErrorHandlingTableSchema = z.array(ErrorHandlingRowSchema).min(1);

const LoggingMonitoringRowSchema = z.object({
  component: z.string().min(1),
  strategy: z.string().min(1),
  notes: z.string().optional(),
});

// Logging & Monitoring (Target) - standardized table
const LoggingMonitoringSchema = z.array(LoggingMonitoringRowSchema).min(1);

// --- Section-Level Factory Functions ---

// 5.1.1 Error Handling (Plan: required, Task: omitted)
const createErrorHandlingSchema = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = ErrorHandlingTableSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, maintenanceMonitoringContent, byId);
};

// 5.1.2 Logging & Monitoring (Plan: required, Task: omitted)
const createLoggingMonitoringSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = LoggingMonitoringSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, maintenanceMonitoringContent, byId);
};

// 5.1 Current Maintenance and Monitoring (Plan: required, Task: omitted)
const createCurrentMaintenanceMonitoringSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const currentErrorHandlingSchema = createErrorHandlingSchema('5.1.1', docType, byId);
  const currentLoggingMonitoringSchema = createLoggingMonitoringSchema('5.1.2', docType, byId);

  const internalShape = z
    .object({
      errorHandling: currentErrorHandlingSchema,
      loggingMonitoring: currentLoggingMonitoringSchema,
    })
    .strict();

  return createSectionSchemaWithApplicability(sectionId, docType, internalShape, maintenanceMonitoringContent, byId);
};

// 5.2.1 Error Handling (Plan: required, Task: required)
const createTargetErrorHandlingSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = ErrorHandlingTableSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, maintenanceMonitoringContent, byId);
};

// 5.2.2 Logging & Monitoring (Plan: required, Task: required)
const createTargetLoggingMonitoringSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = LoggingMonitoringSchema;
  return createSectionSchemaWithApplicability(sectionId, docType, schema, maintenanceMonitoringContent, byId);
};

// 5.2 Target Maintenance and Monitoring (Plan/Task: required)
const createTargetMaintenanceMonitoringSchema = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const errorHandlingSchema = createTargetErrorHandlingSchema('5.2.1', docType, byId);
  const loggingMonitoringSchema = createTargetLoggingMonitoringSchema('5.2.2', docType, byId);

  const internalShape = z
    .object({
      errorHandling: errorHandlingSchema,
      loggingMonitoring: loggingMonitoringSchema,
    })
    .strict();

  return createSectionSchemaWithApplicability(sectionId, docType, internalShape, maintenanceMonitoringContent, byId);
};

// --- Section Factory Map (top-level only) ---
const sectionFactories: Record<
  string,
  (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny
> = {
  '5.1': createCurrentMaintenanceMonitoringSchema,
  '5.2': createTargetMaintenanceMonitoringSchema,
};

// --- Family-Level Factory Function ---

export const createMaintenanceMonitoringSchema = (docType: DocumentType) => {
  const byId: Record<string, z.ZodTypeAny> = {};
  const familyShape: Record<string, z.ZodTypeAny> = {};

  for (const section of maintenanceMonitoringContent.sections) {
    // Only process top-level sections (IDs like "5.1", "5.2"); skip nested 5.1.1, 5.2.1, etc.
    if (!/^5\.[0-9]+$/.test(section.id)) {
      continue;
    }

    const factory = sectionFactories[section.id];
    if (!factory) {
      throw new Error(
        `Schema mismatch: No factory found for section ID "${section.id}" (${section.name}). This indicates a mismatch between the schema definition and JSON files.`
      );
    }

    const schema = factory(section.id, docType, byId);
    if (schema instanceof z.ZodNever) {
      continue;
    }

    const sectionName = camelCase(section.name);
    familyShape[sectionName] = schema; // optionality handled within factories
  }

  const schema = z.object(familyShape).strict();

  // Add byId index to the schema
  (schema as any).__byId = byId;

  return schema;
};

// --- Convenience Functions ---
export const getMaintenanceMonitoringTaskSchema = () => createMaintenanceMonitoringSchema('task');
export const getMaintenanceMonitoringPlanSchema = () => createMaintenanceMonitoringSchema('plan');

// Functions-only API; no type exports
