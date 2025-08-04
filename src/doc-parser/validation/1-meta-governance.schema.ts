import { z } from 'zod';
import { PriorityLevel, StatusKey, DateTimeString } from './shared.schema.js';

// Status section schema for Tasks
const TaskStatusSchema = z.object({
  currentState: StatusKey,
  priority: PriorityLevel,
  progress: z.number().min(0).max(100),
  planningEstimate: z.number().min(0),
  estVariance: z.number(),
  created: DateTimeString,
  implementationStarted: DateTimeString.optional(),
  completed: DateTimeString.optional(),
  lastUpdated: DateTimeString,
});

// Status section schema for Plans
const PlanStatusSchema = z
  .object({
    created: DateTimeString,
    lastUpdated: DateTimeString,
  })
  .strict(); // Reject any additional properties

// Priority drivers schema
const PriorityDriversSchema = z
  .array(
    z.string().refine(
      (val) => {
        // Check format: 3 uppercase letters, hyphen, then letters and underscores
        const parts = val.split('-');
        if (parts.length !== 2) return false;

        const prefix = parts[0];
        const suffix = parts[1];

        // Prefix must be exactly 3 uppercase letters
        if (prefix.length !== 3 || !/^[A-Z]{3}$/.test(prefix)) return false;

        // Suffix must contain only letters and underscores
        if (suffix.length === 0 || !/^[A-Za-z_]+$/.test(suffix)) return false;

        return true;
      },
      {
        message:
          "Priority driver must be in format 'XXX-Description' where XXX is 3 uppercase letters and Description contains only letters and underscores",
      }
    )
  )
  .min(1); // Require at least one priority driver

// Meta & Governance family schema
export const MetaGovernanceFamilySchema = z.object({
  status: z.union([TaskStatusSchema, PlanStatusSchema]),
  priorityDrivers: PriorityDriversSchema,
});

// Export individual schemas for specific use cases
export { TaskStatusSchema, PlanStatusSchema, PriorityDriversSchema };

// Export types
export type MetaGovernanceFamily = z.infer<typeof MetaGovernanceFamilySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type PlanStatus = z.infer<typeof PlanStatusSchema>;
export type PriorityDrivers = z.infer<typeof PriorityDriversSchema>;
