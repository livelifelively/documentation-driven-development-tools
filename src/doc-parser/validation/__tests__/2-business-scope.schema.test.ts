import { describe, it, expect } from 'vitest';
import {
  BusinessScopeFamilySchema,
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
} from '../2-business-scope.schema';

describe('Business & Scope Schema Validation', () => {
  describe('Overview Schema', () => {
    it('should validate a complete overview', () => {
      const validOverview = {
        coreFunction:
          'This task is to create the canonical Zod schemas that define the expected content structure for each section within a *.plan.md or *.task.md document.',
        keyCapability:
          'It will produce one or more *.ts files that export Zod schemas for validating the parsed content of markdown sections.',
        businessValue:
          'Enables automated validation of documentation content, guaranteeing that all documents are structurally correct and can be reliably parsed by tools and LLMs.',
      };

      const result = OverviewSchema.safeParse(validOverview);
      expect(result.success).toBe(true);
    });

    it('should reject overview with missing core function', () => {
      const invalidOverview = {
        keyCapability: 'It will produce one or more *.ts files that export Zod schemas.',
        businessValue: 'Enables automated validation of documentation content.',
      };

      const result = OverviewSchema.safeParse(invalidOverview);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('coreFunction');
      }
    });

    it('should reject overview with empty strings', () => {
      const invalidOverview = {
        coreFunction: '',
        keyCapability: 'It will produce one or more *.ts files that export Zod schemas.',
        businessValue: 'Enables automated validation of documentation content.',
      };

      const result = OverviewSchema.safeParse(invalidOverview);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('coreFunction');
      }
    });
  });

  describe('Business Context Schema', () => {
    it('should validate a business context', () => {
      const validBusinessContext =
        'Currently, pipeline failures are opaque, requiring developers to manually inspect logs, which slows down resolution time.';

      const result = BusinessContextSchema.safeParse(validBusinessContext);
      expect(result.success).toBe(true);
    });

    it('should accept undefined business context', () => {
      const result = BusinessContextSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should reject empty business context', () => {
      const result = BusinessContextSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('User Journey Schema', () => {
    it('should validate a complete user journey', () => {
      const validUserJourney = {
        name: 'Analyst Processes a New Document',
        description:
          'This journey describes the end-to-end path for a data analyst supervising the processing of a single document from selection to completion.',
        diagram: 'graph\nA("Start") --> B["Selects Document"];\nB --> C("Completes Pipeline");',
      };

      const result = UserJourneySchema.safeParse(validUserJourney);
      expect(result.success).toBe(true);
    });

    it('should reject user journey with missing name', () => {
      const invalidUserJourney = {
        description: 'This journey describes the end-to-end path.',
        diagram: 'graph\nA --> B;',
      };

      const result = UserJourneySchema.safeParse(invalidUserJourney);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });
  });

  describe('User Personas Schema', () => {
    it('should validate user personas', () => {
      const validUserPersonas = [
        {
          persona: 'DevOps Engineer',
          goal: 'Monitor system health and diagnose infrastructure issues.',
        },
        {
          persona: 'Support Analyst',
          goal: 'Triage user-reported errors and identify root cause.',
        },
      ];

      const result = UserPersonasSchema.safeParse(validUserPersonas);
      expect(result.success).toBe(true);
    });

    it('should reject user personas with missing fields', () => {
      const invalidUserPersonas = [
        {
          persona: 'DevOps Engineer',
          // Missing goal
        },
      ];

      const result = UserPersonasSchema.safeParse(invalidUserPersonas);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('goal');
      }
    });
  });

  describe('Core Business Rules Schema', () => {
    it('should validate core business rules', () => {
      const validBusinessRules = [
        'All personally identifiable information (PII) must be logged at the DEBUG level or lower.',
        'Any log with a FATAL level must trigger an immediate PagerDuty alert.',
        'Log retention period is 90 days for INFO and 1 year for ERROR and above.',
      ];

      const result = CoreBusinessRulesSchema.safeParse(validBusinessRules);
      expect(result.success).toBe(true);
    });

    it('should reject empty business rules array', () => {
      const result = CoreBusinessRulesSchema.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject business rules with empty strings', () => {
      const invalidBusinessRules = [
        'All personally identifiable information (PII) must be logged at the DEBUG level or lower.',
        '', // Empty string
        'Log retention period is 90 days for INFO and 1 year for ERROR and above.',
      ];

      const result = CoreBusinessRulesSchema.safeParse(invalidBusinessRules);
      expect(result.success).toBe(false);
    });
  });

  describe('User Stories Schema', () => {
    it('should validate user stories', () => {
      const validUserStories = [
        'As a DevOps Engineer, I want to receive a real-time alert when a critical error occurs, so that I can immediately begin troubleshooting.',
        'As a Support Analyst, I want to filter logs by user ID, so that I can quickly investigate user-reported issues.',
      ];

      const result = UserStoriesSchema.safeParse(validUserStories);
      expect(result.success).toBe(true);
    });

    it('should reject empty user stories array', () => {
      const result = UserStoriesSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Success Criteria Schema', () => {
    it('should validate success criteria', () => {
      const validSuccessCriteria = [
        'All pipeline stages emit structured logs for success, failure, and key business events.',
        'The central dashboard can successfully ingest and display logs from all pipeline stages.',
        'A comprehensive set of alerts for critical failures is configured and tested.',
      ];

      const result = SuccessCriteriaSchema.safeParse(validSuccessCriteria);
      expect(result.success).toBe(true);
    });

    it('should reject empty success criteria array', () => {
      const result = SuccessCriteriaSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Definition of Done Schema', () => {
    it('should validate definition of done table', () => {
      const validDefinitionOfDone = [
        {
          id: 'DoD-1',
          criterion: 'A validation library is available that can check the content of documentation files.',
        },
        {
          id: 'DoD-2',
          criterion:
            'The library correctly identifies when a document\'s "Status" or "Priority" section has missing or malformed information.',
        },
        {
          id: 'DoD-3',
          criterion:
            'The library can validate the structure of all tables, such as "Dependencies", ensuring they have the right columns.',
        },
      ];

      const result = DefinitionOfDoneSchema.safeParse(validDefinitionOfDone);
      expect(result.success).toBe(true);
    });

    it('should reject definition of done with missing ID', () => {
      const invalidDefinitionOfDone = [
        {
          criterion: 'A validation library is available that can check the content of documentation files.',
        },
      ];

      const result = DefinitionOfDoneSchema.safeParse(invalidDefinitionOfDone);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('should reject definition of done with missing criterion', () => {
      const invalidDefinitionOfDone = [
        {
          id: 'DoD-1',
          // Missing criterion
        },
      ];

      const result = DefinitionOfDoneSchema.safeParse(invalidDefinitionOfDone);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('criterion');
      }
    });
  });

  describe('In Scope Schema', () => {
    it('should validate in scope items', () => {
      const validInScope = [
        'Processing of Lok Sabha Q&A documents in PDF format.',
        'Manual verification and correction workflows for all pipeline steps.',
        'Generation of a document-level knowledge graph.',
      ];

      const result = InScopeSchema.safeParse(validInScope);
      expect(result.success).toBe(true);
    });

    it('should reject empty in scope array', () => {
      const result = InScopeSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Out of Scope Schema', () => {
    it('should validate out of scope items', () => {
      const validOutOfScope = [
        'Real-time document processing capabilities.',
        'Processing documents in formats other than PDF.',
        'Advanced user management and role-based access control.',
      ];

      const result = OutOfScopeSchema.safeParse(validOutOfScope);
      expect(result.success).toBe(true);
    });

    it('should reject empty out of scope array', () => {
      const result = OutOfScopeSchema.safeParse([]);
      expect(result.success).toBe(false);
    });
  });

  describe('Business Process Schema', () => {
    it('should validate a business process', () => {
      const validBusinessProcess = {
        name: 'Manual Review',
        participants: 'Data Scientist',
        goal: 'To validate the accuracy of automated text extraction from a source PDF.',
        workflow: [
          'Analyst selects a document in the "Pending Review" state.',
          'The UI displays the source PDF alongside the extracted text.',
          'Analyst compares the two and makes corrections to the text.',
          'Analyst approves the corrected text, advancing the document to the "Chunking" state.',
        ],
      };

      const result = BusinessProcessSchema.safeParse(validBusinessProcess);
      expect(result.success).toBe(true);
    });

    it('should reject business process with missing name', () => {
      const invalidBusinessProcess = {
        participants: 'Data Scientist',
        goal: 'To validate the accuracy of automated text extraction from a source PDF.',
        workflow: ['Analyst selects a document in the "Pending Review" state.'],
      };

      const result = BusinessProcessSchema.safeParse(invalidBusinessProcess);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject business process with empty workflow', () => {
      const invalidBusinessProcess = {
        name: 'Manual Review',
        participants: 'Data Scientist',
        goal: 'To validate the accuracy of automated text extraction from a source PDF.',
        workflow: [],
      };

      const result = BusinessProcessSchema.safeParse(invalidBusinessProcess);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('workflow');
      }
    });
  });

  describe('Business Scope Schema (Complete Family)', () => {
    it('should validate a complete business scope for a Plan', () => {
      const validBusinessScope = {
        overview: {
          coreFunction:
            'Provides a validation engine to ensure the content of *.plan.md and *.task.md files conforms to the canonical schema.',
          keyCapability:
            'This system introduces a second tier of validation that operates on the final markdown documents.',
          businessValue:
            'Enforces runtime correctness and consistency of all documentation, ensuring that generated and manually edited documents adhere to the defined structure.',
        },
        businessContext:
          'Our currently implemented schema definition system generates documentation that specifies the rules for our markdown files. However, it lacks an enforcement mechanism.',
        userPersonas: [
          {
            persona: 'Developer',
            goal: 'Ensure their documentation is schema-compliant without tedious manual checks.',
          },
        ],
        successCriteria: [
          'A comprehensive library of Zod schemas is created, covering the content structure for all sections defined in the canonical documentation schema.',
          'Each Zod schema correctly and strictly enforces the documented rules for its corresponding section.',
        ],
        inScope: [
          'Defining and maintaining a comprehensive library of Zod schemas that represent the content rules for every section in the documentation.',
          'Providing clear, typed exports for all schemas so they can be consumed by other systems.',
        ],
        outOfScope: [
          'The implementation of any tool that consumes these schemas, such as a markdown parser or linter.',
          'Auto-correction of invalid markdown content.',
        ],
      };

      const result = BusinessScopeFamilySchema.safeParse(validBusinessScope);
      expect(result.success).toBe(true);
    });

    it('should validate a complete business scope for a Task', () => {
      const validTaskBusinessScope = {
        overview: {
          coreFunction:
            'This task is to create the canonical Zod schemas that define the expected content structure for each section within a *.plan.md or *.task.md document.',
          keyCapability:
            'It will produce one or more *.ts files that export Zod schemas for validating the parsed content of markdown sections.',
          businessValue:
            'Enables automated validation of documentation content, guaranteeing that all documents are structurally correct and can be reliably parsed by tools and LLMs.',
        },
        definitionOfDone: [
          {
            id: 'DoD-1',
            criterion: 'A validation library is available that can check the content of documentation files.',
          },
          {
            id: 'DoD-2',
            criterion:
              'The library correctly identifies when a document\'s "Status" or "Priority" section has missing or malformed information.',
          },
        ],
      };

      const result = BusinessScopeFamilySchema.safeParse(validTaskBusinessScope);
      expect(result.success).toBe(true);
    });

    it('should reject business scope with missing overview', () => {
      const invalidBusinessScope = {
        businessContext: 'Our currently implemented schema definition system generates documentation.',
        successCriteria: ['A comprehensive library of Zod schemas is created.'],
      };

      const result = BusinessScopeFamilySchema.safeParse(invalidBusinessScope);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('overview');
      }
    });

    it('should reject business scope with invalid overview', () => {
      const invalidBusinessScope = {
        overview: {
          coreFunction: 'Provides a validation engine.',
          // Missing keyCapability and businessValue
        },
      };

      const result = BusinessScopeFamilySchema.safeParse(invalidBusinessScope);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('keyCapability');
      }
    });
  });
});
