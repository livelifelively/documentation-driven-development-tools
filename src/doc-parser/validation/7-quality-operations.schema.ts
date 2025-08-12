import { z } from 'zod';
import { camelCase } from 'lodash-es';
import { TestType, DocumentType, getApplicability, createSectionSchemaWithApplicability } from './shared.schema.js';
import { loadDDDSchemaJsonFile } from '../../index.js';

const qualityOperationsContent = loadDDDSchemaJsonFile('7-quality-operations.json');

// Status enum for validation

// Deployment Steps schema - list format (for Plans)
const DeploymentStepsSchema = z.array(z.string().min(1)).min(1);

// Local Test Commands schema - list format (for Tasks)
const LocalTestCommandsSchema = z.array(z.string().min(1)).min(1);

// Functions-only API; no constant or type exports

// ---- Pattern-based, JSON-driven section factories ----

// 7.1 container (no direct content)
const createTestingStrategyRequirementsSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(sectionId, docType, z.object({}), qualityOperationsContent);
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.1.1 Unit & Integration Tests
const TestingScenarioRowSchema = z.object({
  id: z.string().min(1),
  scenario: z.string().min(1),
  testType: TestType,
  toolsRunner: z.string().min(1),
  notes: z.string().min(1),
});
const createUnitIntegrationTestsSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    z.array(TestingScenarioRowSchema).min(1),
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.1.2 End-to-End (E2E) Testing Strategy
const createEndToEndE2ETestingStrategySection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    z.array(TestingScenarioRowSchema).min(1),
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.2 Configuration (per JSON example: includes id and default)
const ConfigurationRowJsonSchema = z.object({
  id: z.string().min(1),
  settingName: z.string().min(1),
  source: z.string().min(1),
  default: z.string().min(1),
  overrideMethod: z.string().min(1),
  notes: z.string().min(1),
});
const createConfigurationSectionJson = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    z.array(ConfigurationRowJsonSchema).min(1),
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.3 container (no direct content)
const createAlertingResponseContainerSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(sectionId, docType, z.object({}), qualityOperationsContent);
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.3.1 Event-Based Alerting
const EventBasedAlertRowSchema = z.object({
  id: z.string().min(1),
  alertCondition: z.string().min(1),
  eventType: z.string().min(1),
  consumerResponse: z.string().min(1),
  notes: z.string().min(1),
});
const createEventBasedAlertingSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    z.array(EventBasedAlertRowSchema).min(1),
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.3.2 Consumer Response Strategies
const createConsumerResponseStrategiesSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    z.array(z.string().min(1)).min(1),
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.3.3 Error Recovery
const createErrorRecoverySection = (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    z.array(z.string().min(1)).min(1),
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.4 Deployment Steps
const createDeploymentStepsSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    DeploymentStepsSchema,
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

// 7.5 Local Test Commands
const createLocalTestCommandsSection = (
  sectionId: string,
  docType: DocumentType,
  byId?: Record<string, z.ZodTypeAny>
) => {
  const schema = createSectionSchemaWithApplicability(
    sectionId,
    docType,
    LocalTestCommandsSchema,
    qualityOperationsContent
  );
  if (byId) {
    byId[sectionId] = schema;
  }
  return schema;
};

const sectionFactories: Record<
  string,
  (sectionId: string, docType: DocumentType, byId?: Record<string, z.ZodTypeAny>) => z.ZodTypeAny
> = {
  '7.1': createTestingStrategyRequirementsSection,
  '7.1.1': createUnitIntegrationTestsSection,
  '7.1.2': createEndToEndE2ETestingStrategySection,
  '7.2': createConfigurationSectionJson,
  '7.3': createAlertingResponseContainerSection,
  '7.3.1': createEventBasedAlertingSection,
  '7.3.2': createConsumerResponseStrategiesSection,
  '7.3.3': createErrorRecoverySection,
  '7.4': createDeploymentStepsSection,
  '7.5': createLocalTestCommandsSection,
};

export const createQualityOperationsSchema = (docType: DocumentType) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  const byId: Record<string, z.ZodTypeAny> = {};

  for (const section of qualityOperationsContent.sections) {
    const applicability = getApplicability(section.applicability, docType);
    if (applicability === 'omitted') continue;
    const factory = sectionFactories[section.id];
    if (!factory) {
      throw new Error(`Schema mismatch: No factory found for section ID "${section.id}" (${section.name}).`);
    }
    const base = factory(section.id, docType, byId);
    const key = camelCase(section.name);
    shape[key] = applicability === 'optional' ? base.optional() : base;
  }

  const schema = z.object(shape).strict();
  (schema as any).__byId = byId;
  return schema;
};

export const getQualityOperationsPlanSchema = () => createQualityOperationsSchema('plan');
export const getQualityOperationsTaskSchema = () => createQualityOperationsSchema('task');
