import { z } from 'zod';

// Implementation Plan schema - Markdown list for Plans
const ImplementationPlanSchema = z.array(z.string().min(1)).min(1);

// Implementation Log/Steps schema - Markdown list for Tasks
const ImplementationLogStepsSchema = z.array(z.string().min(1)).min(1);

// Initial Situation schema - Text description for Tasks
const InitialSituationSchema = z
  .string()
  .min(1)
  .refine((val) => val.trim().length > 0, { message: 'Initial situation cannot be only whitespace' });

// Files Change Log schema - Text description for Tasks
const FilesChangeLogSchema = z
  .string()
  .min(1)
  .refine((val) => val.trim().length > 0, { message: 'Files change log cannot be only whitespace' });

// Prompts schema - Code blocks for LLM reuse
const PromptsSchema = z
  .array(
    z.object({
      description: z.string().min(1),
      code: z.string().min(1),
      language: z.string().min(1).optional(), // e.g., "typescript", "bash", etc.
    })
  )
  .min(1);

// Implementation Guidance family schema
export const ImplementationGuidanceFamilySchema = z.object({
  implementationPlan: ImplementationPlanSchema.optional(), // For Plans
  implementationLogSteps: ImplementationLogStepsSchema.optional(), // For Tasks
  initialSituation: InitialSituationSchema.optional(), // For Tasks
  filesChangeLog: FilesChangeLogSchema.optional(), // For Tasks
  prompts: PromptsSchema.optional(), // For both Plans and Tasks
});

// Export individual schemas for specific use cases
export {
  ImplementationPlanSchema,
  ImplementationLogStepsSchema,
  InitialSituationSchema,
  FilesChangeLogSchema,
  PromptsSchema,
};

// Export types
export type ImplementationGuidanceFamily = z.infer<typeof ImplementationGuidanceFamilySchema>;
export type ImplementationPlan = z.infer<typeof ImplementationPlanSchema>;
export type ImplementationLogSteps = z.infer<typeof ImplementationLogStepsSchema>;
export type InitialSituation = z.infer<typeof InitialSituationSchema>;
export type FilesChangeLog = z.infer<typeof FilesChangeLogSchema>;
export type Prompts = z.infer<typeof PromptsSchema>;
