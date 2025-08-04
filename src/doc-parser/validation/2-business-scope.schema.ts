import { z } from 'zod';

// Overview schema - bulleted list of core functions, capabilities, and business value
const OverviewSchema = z.object({
  coreFunction: z.string().min(1),
  keyCapability: z.string().min(1),
  businessValue: z.string().min(1),
});

// Business Context schema - narrative text (optional for Tasks)
const BusinessContextSchema = z.string().min(1).optional();

// User Journey schema
const UserJourneySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  diagram: z.string().min(1), // Mermaid diagram content
});

// User Personas schema - table format
const UserPersonasSchema = z.array(
  z.object({
    persona: z.string().min(1),
    goal: z.string().min(1),
  })
);

// Core Business Rules schema - list of rules
const CoreBusinessRulesSchema = z.array(z.string().min(1)).min(1);

// User Stories schema - list of user stories
const UserStoriesSchema = z.array(z.string().min(1)).min(1);

// Success Criteria schema - list of measurable criteria (for Plans)
const SuccessCriteriaSchema = z.array(z.string().min(1)).min(1);

// Definition of Done schema - table format (for Tasks)
const DefinitionOfDoneSchema = z
  .array(
    z.object({
      id: z.string().min(1), // e.g., "DoD-1"
      criterion: z.string().min(1),
    })
  )
  .min(1);

// In Scope schema - bulleted list
const InScopeSchema = z.array(z.string().min(1)).min(1);

// Out of Scope schema - bulleted list
const OutOfScopeSchema = z.array(z.string().min(1)).min(1);

// Business Process schema
const BusinessProcessSchema = z.object({
  name: z.string().min(1),
  participants: z.string().min(1),
  goal: z.string().min(1),
  workflow: z.array(z.string().min(1)).min(1),
});

// Business & Scope family schema
export const BusinessScopeFamilySchema = z.object({
  overview: OverviewSchema,
  businessContext: BusinessContextSchema,
  userJourneys: z.array(UserJourneySchema).optional(),
  userPersonas: UserPersonasSchema.optional(),
  coreBusinessRules: CoreBusinessRulesSchema.optional(),
  userStories: UserStoriesSchema.optional(),
  successCriteria: SuccessCriteriaSchema.optional(), // For Plans
  definitionOfDone: DefinitionOfDoneSchema.optional(), // For Tasks
  inScope: InScopeSchema.optional(),
  outOfScope: OutOfScopeSchema.optional(),
  coreBusinessProcesses: z.array(BusinessProcessSchema).optional(),
});

// Export individual schemas for specific use cases
export {
  OverviewSchema,
  BusinessContextSchema,
  UserJourneySchema,
  UserPersonasSchema,
  CoreBusinessRulesSchema,
  UserStoriesSchema,
  SuccessCriteriaSchema,
  DefinitionOfDoneSchema,
  InScopeSchema,
  OutOfScopeSchema,
  BusinessProcessSchema,
};

// Export types
export type BusinessScopeFamily = z.infer<typeof BusinessScopeFamilySchema>;
export type Overview = z.infer<typeof OverviewSchema>;
export type BusinessContext = z.infer<typeof BusinessContextSchema>;
export type UserJourney = z.infer<typeof UserJourneySchema>;
export type UserPersonas = z.infer<typeof UserPersonasSchema>;
export type CoreBusinessRules = z.infer<typeof CoreBusinessRulesSchema>;
export type UserStories = z.infer<typeof UserStoriesSchema>;
export type SuccessCriteria = z.infer<typeof SuccessCriteriaSchema>;
export type DefinitionOfDone = z.infer<typeof DefinitionOfDoneSchema>;
export type InScope = z.infer<typeof InScopeSchema>;
export type OutOfScope = z.infer<typeof OutOfScopeSchema>;
export type BusinessProcess = z.infer<typeof BusinessProcessSchema>;
