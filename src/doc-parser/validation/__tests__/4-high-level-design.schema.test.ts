import { describe, it, expect } from 'vitest';
import {
  HighLevelDesignFamilySchema,
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
} from '../4-high-level-design.schema.js';

describe('High-Level Design Schema Validation', () => {
  describe('Guiding Principles Schema', () => {
    it('should validate guiding principles', () => {
      const validGuidingPrinciples = [
        'All UI components must be stateless to allow for horizontal scaling.',
        'Communication between major components should be asynchronous and event-driven where possible.',
        'All services must be idempotent to ensure reliability.',
      ];

      const result = GuidingPrinciplesSchema.safeParse(validGuidingPrinciples);
      expect(result.success).toBe(true);
    });

    it('should reject empty guiding principles array', () => {
      const result = GuidingPrinciplesSchema.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject guiding principles with empty strings', () => {
      const invalidGuidingPrinciples = [
        'All UI components must be stateless.',
        '', // Empty string
        'All services must be idempotent.',
      ];

      const result = GuidingPrinciplesSchema.safeParse(invalidGuidingPrinciples);
      expect(result.success).toBe(false);
    });
  });

  describe('Data Models Schema', () => {
    it('should validate data models with only a diagram', () => {
      const validDataModels = {
        diagram: `erDiagram
LOG_LEVEL ||--o{ LOG_PAYLOAD : "sets severity"`,
      };
      const result = DataModelsSchema.safeParse(validDataModels);
      expect(result.success).toBe(true);
    });

    it('should validate data models with only text', () => {
      const validDataModels = {
        text: ['This is an explanation of the data model.'],
      };
      const result = DataModelsSchema.safeParse(validDataModels);
      expect(result.success).toBe(true);
    });

    it('should validate data models with both a diagram and text', () => {
      const validDataModels = {
        diagram: 'erDiagram',
        text: ['Some text.'],
      };
      const result = DataModelsSchema.safeParse(validDataModels);
      expect(result.success).toBe(true);
    });

    it('should reject data models with neither a diagram nor text', () => {
      const result = DataModelsSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject data models with an invalid diagram type', () => {
      const result = DataModelsSchema.safeParse({ diagram: 'graph TD' });
      expect(result.success).toBe(false);
    });
  });

  describe('Components Schema', () => {
    it('should validate components with only a diagram', () => {
      const validComponents = {
        diagram: 'classDiagram',
      };
      const result = ComponentsSchema.safeParse(validComponents);
      expect(result.success).toBe(true);
    });

    it('should validate components with only text', () => {
      const validComponents = {
        text: ['This is an explanation of the components.'],
      };
      const result = ComponentsSchema.safeParse(validComponents);
      expect(result.success).toBe(true);
    });

    it('should reject components with an invalid diagram type', () => {
      const result = ComponentsSchema.safeParse({ diagram: 'erDiagram' });
      expect(result.success).toBe(false);
    });
  });

  describe('Data Flow Schema', () => {
    it('should validate data flow with only a diagram', () => {
      const validDataFlow = {
        diagram: 'graph TD',
      };
      const result = DataFlowSchema.safeParse(validDataFlow);
      expect(result.success).toBe(true);
    });

    it('should validate data flow with only text', () => {
      const validDataFlow = {
        text: ['This is an explanation of the data flow.'],
      };
      const result = DataFlowSchema.safeParse(validDataFlow);
      expect(result.success).toBe(true);
    });

    it('should reject data flow with an invalid diagram type', () => {
      const result = DataFlowSchema.safeParse({ diagram: 'classDiagram' });
      expect(result.success).toBe(false);
    });
  });

  describe('Control Flow Schema', () => {
    it('should validate control flow with only a diagram', () => {
      const validControlFlow = {
        diagram: 'sequenceDiagram',
      };
      const result = ControlFlowSchema.safeParse(validControlFlow);
      expect(result.success).toBe(true);
    });

    it('should validate control flow with only text', () => {
      const validControlFlow = {
        text: ['This is an explanation of the control flow.'],
      };
      const result = ControlFlowSchema.safeParse(validControlFlow);
      expect(result.success).toBe(true);
    });

    it('should reject control flow with an invalid diagram type', () => {
      const result = ControlFlowSchema.safeParse({ diagram: 'graph TD' });
      expect(result.success).toBe(false);
    });
  });

  describe('Integration Point Schema', () => {
    it('should validate integration point', () => {
      const validIntegrationPoint = {
        trigger: 'User action via UI button click.',
        inputData: 'Receives documentId and userId from the client.',
      };

      const result = IntegrationPointSchema.safeParse(validIntegrationPoint);
      expect(result.success).toBe(true);
    });

    it('should reject integration point with missing trigger', () => {
      const invalidIntegrationPoint = {
        inputData: 'Receives documentId and userId from the client.',
      };

      const result = IntegrationPointSchema.safeParse(invalidIntegrationPoint);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('trigger');
      }
    });

    it('should reject integration point with empty input data', () => {
      const invalidIntegrationPoint = {
        trigger: 'User action via UI button click.',
        inputData: '',
      };

      const result = IntegrationPointSchema.safeParse(invalidIntegrationPoint);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('inputData');
      }
    });
  });

  describe('Upstream Integrations Schema', () => {
    it('should validate upstream integrations', () => {
      const validUpstreamIntegrations = [
        {
          trigger: 'User action via UI button click.',
          inputData: 'Receives documentId and userId from the client.',
        },
        {
          trigger: 'Scheduled job runs every hour.',
          inputData: 'Receives configuration from environment variables.',
        },
      ];

      const result = UpstreamIntegrationsSchema.safeParse(validUpstreamIntegrations);
      expect(result.success).toBe(true);
    });

    it('should reject empty upstream integrations array', () => {
      const result = UpstreamIntegrationsSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Downstream Integrations Schema', () => {
    it('should validate downstream integrations', () => {
      const validDownstreamIntegrations = [
        {
          trigger: 'Emits a DOCUMENT_PROCESSED event to the message queue.',
          inputData: 'The event payload includes documentId and status: COMPLETED.',
        },
        {
          trigger: 'Sends notification to user via email service.',
          inputData: 'Email contains processing results and next steps.',
        },
      ];

      const result = DownstreamIntegrationsSchema.safeParse(validDownstreamIntegrations);
      expect(result.success).toBe(true);
    });

    it('should reject empty downstream integrations array', () => {
      const result = DownstreamIntegrationsSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Integration Points Schema', () => {
    it('should validate integration points with both upstream and downstream', () => {
      const validIntegrationPoints = {
        upstream: [
          {
            trigger: 'User action via UI button click.',
            inputData: 'Receives documentId and userId from the client.',
          },
        ],
        downstream: [
          {
            trigger: 'Emits a DOCUMENT_PROCESSED event to the message queue.',
            inputData: 'The event payload includes documentId and status: COMPLETED.',
          },
        ],
      };

      const result = IntegrationPointsSchema.safeParse(validIntegrationPoints);
      expect(result.success).toBe(true);
    });

    it('should validate integration points with only upstream', () => {
      const validIntegrationPoints = {
        upstream: [
          {
            trigger: 'User action via UI button click.',
            inputData: 'Receives documentId and userId from the client.',
          },
        ],
      };

      const result = IntegrationPointsSchema.safeParse(validIntegrationPoints);
      expect(result.success).toBe(true);
    });

    it('should validate integration points with only downstream', () => {
      const validIntegrationPoints = {
        downstream: [
          {
            trigger: 'Emits a DOCUMENT_PROCESSED event to the message queue.',
            inputData: 'The event payload includes documentId and status: COMPLETED.',
          },
        ],
      };

      const result = IntegrationPointsSchema.safeParse(validIntegrationPoints);
      expect(result.success).toBe(true);
    });
  });

  describe('Exposed API Schema', () => {
    it('should validate exposed API OpenAPI content', () => {
      const validExposedAPI = `paths:
  /users/{userId}:
    get:
      summary: Get user by ID
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: User found
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  name:
                    type: string`;

      const result = ExposedAPISchema.safeParse(validExposedAPI);
      expect(result.success).toBe(true);
    });

    it('should reject empty exposed API', () => {
      const result = ExposedAPISchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('Tech Stack Item Schema', () => {
    it('should validate tech stack item', () => {
      const validTechStackItem = {
        category: 'Language',
        technology: 'TypeScript',
      };

      const result = TechStackItemSchema.safeParse(validTechStackItem);
      expect(result.success).toBe(true);
    });

    it('should reject tech stack item with missing category', () => {
      const invalidTechStackItem = {
        technology: 'TypeScript',
      };

      const result = TechStackItemSchema.safeParse(invalidTechStackItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('category');
      }
    });

    it('should reject tech stack item with empty technology', () => {
      const invalidTechStackItem = {
        category: 'Language',
        technology: '',
      };

      const result = TechStackItemSchema.safeParse(invalidTechStackItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('technology');
      }
    });
  });

  describe('Tech Stack & Deployment Schema', () => {
    it('should validate tech stack deployment', () => {
      const validTechStackDeployment = [
        {
          category: 'Language',
          technology: 'TypeScript',
        },
        {
          category: 'Framework',
          technology: 'Next.js',
        },
        {
          category: 'Deployment',
          technology: 'Vercel',
        },
      ];

      const result = TechStackDeploymentSchema.safeParse(validTechStackDeployment);
      expect(result.success).toBe(true);
    });

    it('should reject empty tech stack deployment array', () => {
      const result = TechStackDeploymentSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Non-Functional Requirement Schema', () => {
    it('should validate non-functional requirement', () => {
      const validNonFunctionalRequirement = {
        id: 'PERF-01',
        requirement: 'API endpoints must respond in < 200ms (95th percentile).',
        priority: 'High',
      };

      const result = NonFunctionalRequirementSchema.safeParse(validNonFunctionalRequirement);
      expect(result.success).toBe(true);
    });

    it('should reject non-functional requirement with missing ID', () => {
      const invalidNonFunctionalRequirement = {
        requirement: 'API endpoints must respond in < 200ms (95th percentile).',
        priority: 'High',
      };

      const result = NonFunctionalRequirementSchema.safeParse(invalidNonFunctionalRequirement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('should reject non-functional requirement with invalid priority', () => {
      const invalidNonFunctionalRequirement = {
        id: 'PERF-01',
        requirement: 'API endpoints must respond in < 200ms (95th percentile).',
        priority: 'Invalid', // Invalid priority
      };

      const result = NonFunctionalRequirementSchema.safeParse(invalidNonFunctionalRequirement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('priority');
      }
    });
  });

  describe('Performance Schema', () => {
    it('should validate performance requirements', () => {
      const validPerformance = [
        {
          id: 'PERF-01',
          requirement: 'API endpoints must respond in < 200ms (95th percentile).',
          priority: 'High',
        },
        {
          id: 'PERF-02',
          requirement: 'The system must support 100 concurrent users without degradation.',
          priority: 'Medium',
        },
      ];

      const result = PerformanceSchema.safeParse(validPerformance);
      expect(result.success).toBe(true);
    });

    it('should reject empty performance array', () => {
      const result = PerformanceSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Security Schema', () => {
    it('should validate security requirements', () => {
      const validSecurity = [
        {
          id: 'SEC-01',
          requirement: 'All sensitive user data must be encrypted at rest using AES-256.',
          priority: 'High',
        },
        {
          id: 'SEC-02',
          requirement: 'Access to admin endpoints must be restricted to users with Admin role.',
          priority: 'High',
        },
      ];

      const result = SecuritySchema.safeParse(validSecurity);
      expect(result.success).toBe(true);
    });

    it('should reject empty security array', () => {
      const result = SecuritySchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Reliability Schema', () => {
    it('should validate reliability requirements', () => {
      const validReliability = [
        {
          id: 'REL-01',
          requirement: 'The service must maintain 99.9% uptime, measured monthly.',
          priority: 'High',
        },
        {
          id: 'REL-02',
          requirement: 'All database transactions must be atomic and durable.',
          priority: 'High',
        },
      ];

      const result = ReliabilitySchema.safeParse(validReliability);
      expect(result.success).toBe(true);
    });

    it('should reject empty reliability array', () => {
      const result = ReliabilitySchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Permission Role Schema', () => {
    it('should validate permission role', () => {
      const validPermissionRole = {
        role: 'Admin',
        permissions: ['Full CRUD access to all documents', 'Can assign roles'],
        notes: 'For system administrators only.',
      };

      const result = PermissionRoleSchema.safeParse(validPermissionRole);
      expect(result.success).toBe(true);
    });

    it('should validate permission role without notes', () => {
      const validPermissionRole = {
        role: 'Analyst',
        permissions: ['Read/Write access to assigned documents', 'Cannot delete'],
      };

      const result = PermissionRoleSchema.safeParse(validPermissionRole);
      expect(result.success).toBe(true);
    });

    it('should reject permission role with missing role', () => {
      const invalidPermissionRole = {
        permissions: ['Full CRUD access to all documents', 'Can assign roles'],
        notes: 'For system administrators only.',
      };

      const result = PermissionRoleSchema.safeParse(invalidPermissionRole);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('role');
      }
    });

    it('should reject permission role with empty permissions', () => {
      const invalidPermissionRole = {
        role: 'Admin',
        permissions: [],
        notes: 'For system administrators only.',
      };

      const result = PermissionRoleSchema.safeParse(invalidPermissionRole);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('permissions');
      }
    });
  });

  describe('Permission Model Schema', () => {
    it('should validate permission model', () => {
      const validPermissionModel = [
        {
          role: 'Admin',
          permissions: ['Full CRUD access to all documents', 'Can assign roles'],
          notes: 'For system administrators only.',
        },
        {
          role: 'Analyst',
          permissions: ['Read/Write access to assigned documents', 'Cannot delete'],
          notes: 'The primary user role.',
        },
        {
          role: 'Viewer',
          permissions: ['Read-only access to completed documents'],
          notes: 'For stakeholders or external users.',
        },
      ];

      const result = PermissionModelSchema.safeParse(validPermissionModel);
      expect(result.success).toBe(true);
    });

    it('should reject empty permission model array', () => {
      const result = PermissionModelSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Current Architecture Schema', () => {
    it('should validate current architecture for Plans', () => {
      const validCurrentArchitecture = {
        dataModels: {
          diagram: `erDiagram
USER ||--o{ DOCUMENT : "owns"`,
        },
        components: {
          diagram: `classDiagram
direction LR
    class UserService {
        +createUser(user: User): Promise<User>
        +getUser(id: string): Promise<User>
    }`,
        },
      };

      const result = CurrentArchitectureSchema.safeParse(validCurrentArchitecture);
      expect(result.success).toBe(true);
    });

    it('should validate current architecture with partial data', () => {
      const validCurrentArchitecture = {
        dataModels: {
          diagram: `erDiagram
USER ||--o{ DOCUMENT : "owns"`,
        },
      };

      const result = CurrentArchitectureSchema.safeParse(validCurrentArchitecture);
      expect(result.success).toBe(true);
    });
  });

  describe('Target Architecture Schema', () => {
    it('should validate target architecture for Plans', () => {
      const validTargetArchitecture = {
        dataModels: {
          diagram: `erDiagram
USER ||--o{ DOCUMENT : "owns"`,
        },
        components: {
          diagram: `classDiagram
direction LR
    class UserService {
        +createUser(user: User): Promise<User>
    }`,
        },
        integrationPoints: {
          upstream: [
            {
              trigger: 'User updates document via web interface.',
              inputData: 'Receives document ID and new content.',
            },
          ],
        },
        exposedAPI: 'paths:',
      };

      const result = TargetArchitectureSchema.safeParse(validTargetArchitecture);
      expect(result.success).toBe(true);
    });

    it('should validate target architecture for Tasks', () => {
      const validTaskTargetArchitecture = {
        dataModels: {
          diagram: `erDiagram
SCHEMA ||--o{ VALIDATION_RULE : "contains"`,
        },
        components: {
          diagram: `classDiagram
direction LR
    class SchemaValidator {
        +validate(document: string): ValidationResult
    }`,
        },
        exposedAPI: 'export interface SchemaValidator {',
      };

      const result = TargetArchitectureSchema.safeParse(validTaskTargetArchitecture);
      expect(result.success).toBe(true);
    });
  });

  describe('Non-Functional Requirements Schema', () => {
    it('should validate non-functional requirements', () => {
      const validNonFunctionalRequirements = {
        performance: [
          {
            id: 'PERF-01',
            requirement: 'API endpoints must respond in < 200ms (95th percentile).',
            priority: 'High',
          },
        ],
        security: [
          {
            id: 'SEC-01',
            requirement: 'All sensitive user data must be encrypted at rest using AES-256.',
            priority: 'High',
          },
        ],
        reliability: [
          {
            id: 'REL-01',
            requirement: 'The service must maintain 99.9% uptime, measured monthly.',
            priority: 'High',
          },
        ],
        permissionModel: [
          {
            role: 'Admin',
            permissions: ['Full CRUD access to all documents'],
            notes: 'For system administrators only.',
          },
        ],
      };

      const result = NonFunctionalRequirementsSchema.safeParse(validNonFunctionalRequirements);
      expect(result.success).toBe(true);
    });

    it('should validate non-functional requirements with partial data', () => {
      const validPartialNonFunctionalRequirements = {
        performance: [
          {
            id: 'PERF-01',
            requirement: 'API endpoints must respond in < 200ms (95th percentile).',
            priority: 'High',
          },
        ],
      };

      const result = NonFunctionalRequirementsSchema.safeParse(validPartialNonFunctionalRequirements);
      expect(result.success).toBe(true);
    });
  });

  describe('High-Level Design Schema (Complete Family)', () => {
    it('should validate a complete high-level design for a Plan', () => {
      const validHighLevelDesign = {
        guidingPrinciples: ['All services must be idempotent to ensure reliability.'],
        currentArchitecture: {
          dataModels: {
            diagram: 'erDiagram',
          },
        },
        targetArchitecture: {
          dataModels: {
            diagram: 'erDiagram',
          },
        },
        techStackDeployment: [
          {
            category: 'Language',
            technology: 'TypeScript',
          },
        ],
        nonFunctionalRequirements: {
          performance: [
            {
              id: 'PERF-01',
              requirement: 'API endpoints must respond in < 200ms (95th percentile).',
              priority: 'High',
            },
          ],
        },
      };

      const result = HighLevelDesignFamilySchema.safeParse(validHighLevelDesign);
      expect(result.success).toBe(true);
    });

    it('should validate a complete high-level design for a Task', () => {
      const validTaskHighLevelDesign = {
        targetArchitecture: {
          dataModels: {
            diagram: 'erDiagram',
          },
        },
        techStackDeployment: [
          {
            category: 'Language',
            technology: 'TypeScript',
          },
        ],
        nonFunctionalRequirements: {
          performance: [
            {
              id: 'PERF-01',
              requirement: 'Schema validation must complete in < 100ms for documents up to 10KB.',
              priority: 'High',
            },
          ],
        },
      };

      const result = HighLevelDesignFamilySchema.safeParse(validTaskHighLevelDesign);
      expect(result.success).toBe(true);
    });

    it('should reject high-level design with missing target architecture', () => {
      const invalidHighLevelDesign = {
        guidingPrinciples: ['All UI components must be stateless.'],
        techStackDeployment: [
          {
            category: 'Language',
            technology: 'TypeScript',
          },
        ],
      };

      const result = HighLevelDesignFamilySchema.safeParse(invalidHighLevelDesign);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('targetArchitecture');
      }
    });
  });
});
