import { z } from 'zod';

// Priority levels enum for validation
const PriorityLevel = z.enum(['High', 'Medium', 'Low']);

// Specific Mermaid diagram type schemas
const ErDiagramSchema = z.string().refine((val) => val.trim().startsWith('erDiagram'), {
  message: 'Diagram must be a valid Mermaid erDiagram.',
});
const ClassDiagramSchema = z.string().refine((val) => val.trim().startsWith('classDiagram'), {
  message: 'Diagram must be a valid Mermaid classDiagram.',
});
const GraphDiagramSchema = z.string().refine((val) => val.trim().startsWith('graph'), {
  message: 'Diagram must be a valid Mermaid graph.',
});
const SequenceDiagramSchema = z.string().refine((val) => val.trim().startsWith('sequenceDiagram'), {
  message: 'Diagram must be a valid Mermaid sequenceDiagram.',
});

// Generic schema for a section that can contain a diagram and/or text
const createDiagramWithTextSchema = (diagramSchema: z.ZodString) =>
  z
    .object({
      diagram: diagramSchema.optional(),
      text: z.array(z.string().min(1)).optional(),
    })
    .refine((data) => data.diagram || (data.text && data.text.length > 0), {
      message: 'Section must have at least a diagram or text content.',
    });

// Data Models schema
const DataModelsSchema = createDiagramWithTextSchema(ErDiagramSchema);

// Components schema
const ComponentsSchema = createDiagramWithTextSchema(ClassDiagramSchema);

// Data Flow schema
const DataFlowSchema = createDiagramWithTextSchema(GraphDiagramSchema);

// Control Flow schema
const ControlFlowSchema = createDiagramWithTextSchema(SequenceDiagramSchema);

// Guiding Principles schema - list of architectural rules
const GuidingPrinciplesSchema = z.array(z.string().min(1)).min(1);

// Integration Point schema
const IntegrationPointSchema = z.object({
  trigger: z.string().min(1),
  inputData: z.string().min(1),
});

// Upstream Integrations schema - list of integration points
const UpstreamIntegrationsSchema = z.array(IntegrationPointSchema).min(1);

// Downstream Integrations schema - list of integration points
const DownstreamIntegrationsSchema = z.array(IntegrationPointSchema).min(1);

// Integration Points schema - container for upstream and downstream
const IntegrationPointsSchema = z.object({
  upstream: UpstreamIntegrationsSchema.optional(),
  downstream: DownstreamIntegrationsSchema.optional(),
});

// Exposed API schema - OpenAPI/Swagger content or markdown table
const ExposedAPISchema = z.string().min(1);

// Tech Stack Item schema
const TechStackItemSchema = z.object({
  category: z.string().min(1), // e.g., "Language", "Framework", "Deployment"
  technology: z.string().min(1), // e.g., "TypeScript", "Next.js", "Vercel"
});

// Tech Stack & Deployment schema - list of tech stack items
const TechStackDeploymentSchema = z.array(TechStackItemSchema).min(1);

// Non-Functional Requirement schema
const NonFunctionalRequirementSchema = z.object({
  id: z.string().min(1), // e.g., "PERF-01", "SEC-01", "REL-01"
  requirement: z.string().min(1),
  priority: PriorityLevel,
});

// Performance schema - table of performance requirements
const PerformanceSchema = z.array(NonFunctionalRequirementSchema).min(1);

// Security schema - table of security requirements
const SecuritySchema = z.array(NonFunctionalRequirementSchema).min(1);

// Reliability schema - table of reliability requirements
const ReliabilitySchema = z.array(NonFunctionalRequirementSchema).min(1);

// Permission Role schema
const PermissionRoleSchema = z.object({
  role: z.string().min(1),
  permissions: z.array(z.string().min(1)).min(1),
  notes: z.string().optional(),
});

// Permission Model schema - table of roles and permissions
const PermissionModelSchema = z.array(PermissionRoleSchema).min(1);

// Current Architecture schema (for Plans only)
const CurrentArchitectureSchema = z.object({
  dataModels: DataModelsSchema.optional(),
  components: ComponentsSchema.optional(),
  dataFlow: DataFlowSchema.optional(),
  controlFlow: ControlFlowSchema.optional(),
  integrationPoints: IntegrationPointsSchema.optional(),
});

// Target Architecture schema (for Plans and Tasks)
const TargetArchitectureSchema = z.object({
  dataModels: DataModelsSchema.optional(),
  components: ComponentsSchema.optional(),
  dataFlow: DataFlowSchema.optional(),
  controlFlow: ControlFlowSchema.optional(),
  integrationPoints: IntegrationPointsSchema.optional(),
  exposedAPI: ExposedAPISchema.optional(),
});

// Non-Functional Requirements schema
const NonFunctionalRequirementsSchema = z.object({
  performance: PerformanceSchema.optional(),
  security: SecuritySchema.optional(),
  reliability: ReliabilitySchema.optional(),
  permissionModel: PermissionModelSchema.optional(),
});

// High-Level Design family schema
export const HighLevelDesignFamilySchema = z.object({
  guidingPrinciples: GuidingPrinciplesSchema.optional(), // For Plans
  currentArchitecture: CurrentArchitectureSchema.optional(), // For Plans
  targetArchitecture: TargetArchitectureSchema,
  techStackDeployment: TechStackDeploymentSchema.optional(),
  nonFunctionalRequirements: NonFunctionalRequirementsSchema.optional(),
});

// Export individual schemas for specific use cases
export {
  GuidingPrinciplesSchema,
  DataModelsSchema,
  ComponentsSchema,
  DataFlowSchema,
  ControlFlowSchema,
  IntegrationPointSchema,
  UpstreamIntegrationsSchema,
  DownstreamIntegrationsSchema,
  IntegrationPointsSchema,
  ExposedAPISchema,
  TechStackItemSchema,
  TechStackDeploymentSchema,
  NonFunctionalRequirementSchema,
  PerformanceSchema,
  SecuritySchema,
  ReliabilitySchema,
  PermissionRoleSchema,
  PermissionModelSchema,
  CurrentArchitectureSchema,
  TargetArchitectureSchema,
  NonFunctionalRequirementsSchema,
};

// Export types
export type HighLevelDesignFamily = z.infer<typeof HighLevelDesignFamilySchema>;
export type GuidingPrinciples = z.infer<typeof GuidingPrinciplesSchema>;
export type DataModels = z.infer<typeof DataModelsSchema>;
export type Components = z.infer<typeof ComponentsSchema>;
export type DataFlow = z.infer<typeof DataFlowSchema>;
export type ControlFlow = z.infer<typeof ControlFlowSchema>;
export type IntegrationPoint = z.infer<typeof IntegrationPointSchema>;
export type UpstreamIntegrations = z.infer<typeof UpstreamIntegrationsSchema>;
export type DownstreamIntegrations = z.infer<typeof DownstreamIntegrationsSchema>;
export type IntegrationPoints = z.infer<typeof IntegrationPointsSchema>;
export type ExposedAPI = z.infer<typeof ExposedAPISchema>;
export type TechStackItem = z.infer<typeof TechStackItemSchema>;
export type TechStackDeployment = z.infer<typeof TechStackDeploymentSchema>;
export type NonFunctionalRequirement = z.infer<typeof NonFunctionalRequirementSchema>;
export type Performance = z.infer<typeof PerformanceSchema>;
export type Security = z.infer<typeof SecuritySchema>;
export type Reliability = z.infer<typeof ReliabilitySchema>;
export type PermissionRole = z.infer<typeof PermissionRoleSchema>;
export type PermissionModel = z.infer<typeof PermissionModelSchema>;
export type CurrentArchitecture = z.infer<typeof CurrentArchitectureSchema>;
export type TargetArchitecture = z.infer<typeof TargetArchitectureSchema>;
export type NonFunctionalRequirements = z.infer<typeof NonFunctionalRequirementsSchema>;
