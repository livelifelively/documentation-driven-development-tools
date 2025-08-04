import { z } from 'zod';
import { PriorityLevel, StatusKey, DependencyStatus, DependencyType } from './shared.schema.js';

// Roadmap item schema - table format for Plans
const RoadmapItemSchema = z.object({
  id: z.string().min(1), // e.g., "P1", "T1"
  childPlanTask: z.string().min(1), // e.g., "[Backend Plan](p1-backend.plan.md)"
  priority: PriorityLevel,
  priorityDrivers: z.array(z.string().min(1)).min(1), // e.g., ["CBP-Break_Block_Revenue_Legal"]
  status: StatusKey,
  dependsOn: z.string().optional(), // e.g., "—", "P1", "T1"
  summary: z.string().min(1),
});

// Backlog/Icebox item schema - list format for Plans
const BacklogItemSchema = z.object({
  name: z.string().min(1), // e.g., "Reporting Plan"
  reason: z.string().min(1), // e.g., "Deferred to Q4 due to dependency on new analytics service."
});

// Dependency schema - table format for Plans and Tasks
const DependencySchema = z.object({
  id: z.string().min(1), // e.g., "D-1", "D-2"
  dependencyOn: z.string().min(1), // e.g., "shared-ui-library v2.1+"
  type: DependencyType,
  status: DependencyStatus,
  affectedPlansTasks: z.array(z.string().min(1)).min(1), // e.g., ["p1-frontend", "p3-reporting"]
  notes: z.string().min(1),
});

// Decomposition Graph schema - Mermaid diagram content
const DecompositionGraphSchema = z.string().min(1); // Mermaid graph content

// Planning & Decomposition family schema
export const PlanningDecompositionFamilySchema = z.object({
  roadmap: z.array(RoadmapItemSchema).optional(), // For Plans
  backlog: z.array(BacklogItemSchema).optional(), // For Plans
  dependencies: z.array(DependencySchema).optional(), // For Plans and Tasks
  decompositionGraph: DecompositionGraphSchema.optional(), // For Plans
});

// Export individual schemas for specific use cases
export { RoadmapItemSchema, BacklogItemSchema, DependencySchema, DecompositionGraphSchema };

// Export types
export type PlanningDecompositionFamily = z.infer<typeof PlanningDecompositionFamilySchema>;
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
export type BacklogItem = z.infer<typeof BacklogItemSchema>;
export type Dependency = z.infer<typeof DependencySchema>;
export type DecompositionGraph = z.infer<typeof DecompositionGraphSchema>;
