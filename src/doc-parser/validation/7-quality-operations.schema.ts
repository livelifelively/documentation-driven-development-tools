import { z } from 'zod';
import { TestType } from './shared.schema.js';

// Status enum for validation
const StatusEnum = z.enum(['Not Started', 'In Progress', 'Under Review', 'Complete', 'Blocked']);

// Testing Strategy schema - table format
const TestingStrategySchema = z
  .array(
    z.object({
      acId: z.string().min(1), // e.g., "AC-1"
      dodLink: z.string().min(1), // e.g., "DoD-2"
      scenario: z.string().min(1),
      testType: TestType,
      testFile: z.string().min(1),
    })
  )
  .min(1);

// Configuration schema - table format
const ConfigurationSchema = z
  .array(
    z.object({
      settingName: z.string().min(1),
      planDependency: z.string().min(1),
      source: z.string().min(1),
      overrideMethod: z.string().min(1),
      notes: z.string().min(1),
    })
  )
  .min(1);

// Alerting & Response schema - table format
const AlertingResponseSchema = z
  .array(
    z.object({
      errorCondition: z.string().min(1),
      relevantPlans: z.string().min(1),
      responsePlan: z.string().min(1),
      status: StatusEnum,
    })
  )
  .min(1);

// Deployment Steps schema - list format (for Plans)
const DeploymentStepsSchema = z.array(z.string().min(1)).min(1);

// Local Test Commands schema - list format (for Tasks)
const LocalTestCommandsSchema = z.array(z.string().min(1)).min(1);

// Quality & Operations family schema
export const QualityOperationsFamilySchema = z.object({
  testingStrategy: TestingStrategySchema,
  configuration: ConfigurationSchema.optional(),
  alertingResponse: AlertingResponseSchema.optional(),
  deploymentSteps: DeploymentStepsSchema.optional(), // For Plans
  localTestCommands: LocalTestCommandsSchema.optional(), // For Tasks
});

// Export individual schemas for specific use cases
export {
  TestingStrategySchema,
  ConfigurationSchema,
  AlertingResponseSchema,
  DeploymentStepsSchema,
  LocalTestCommandsSchema,
};

// Export types
export type QualityOperationsFamily = z.infer<typeof QualityOperationsFamilySchema>;
export type TestingStrategy = z.infer<typeof TestingStrategySchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;
export type AlertingResponse = z.infer<typeof AlertingResponseSchema>;
export type DeploymentSteps = z.infer<typeof DeploymentStepsSchema>;
export type LocalTestCommands = z.infer<typeof LocalTestCommandsSchema>;
