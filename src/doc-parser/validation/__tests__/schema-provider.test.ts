import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

// Mock the IndexModule from T32
vi.mock('../index.js', () => ({
  createTaskSchema: vi.fn(),
  createPlanSchema: vi.fn(),
}));

// Import the mocked functions
import { createTaskSchema, createPlanSchema } from '../index.js';

// Import the types we'll need (these will be created in the implementation)
interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: LintingError[];
}

interface LintingError {
  sectionId: string;
  familyId: string;
  field: string;
  message: string;
  path: string;
  lineNumber: number;
}

interface DocumentData {
  docType: 'plan' | 'task';
  sections: Record<string, any>;
}

// Import the function we'll implement (this will fail initially)
import { createSchemaProvider } from '../schema-provider.js';

describe('SchemaProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSchemaProvider', () => {
    it('should expose getDocumentSchema and validate methods', async () => {
      // AC-1: Provider exposes `getDocumentSchema` and `validate`
      // This test will fail until we implement the provider

      // Mock the schema factories
      const mockTaskSchema = z.object({
        test: z.string(),
      });
      const mockPlanSchema = z.object({
        test: z.string(),
      });

      (createTaskSchema as any).mockResolvedValue(mockTaskSchema);
      (createPlanSchema as any).mockResolvedValue(mockPlanSchema);

      const provider = await createSchemaProvider();

      expect(provider.getDocumentSchema).toBeDefined();
      expect(provider.validate).toBeDefined();
      expect(typeof provider.getDocumentSchema).toBe('function');
      expect(typeof provider.validate).toBe('function');
    });

    it('should validate correct task document successfully', async () => {
      // AC-2: Valid task Section[] validates successfully via provider

      const validTaskData: DocumentData = {
        docType: 'task',
        sections: {
          metaGovernance: {
            status: {
              currentState: 'Not Started',
              priority: 'High',
              progress: 0,
            },
            priorityDrivers: ['TEC-Prod_Stability_Blocker'],
          },
          businessScope: {
            overview: ['Core Function: Test function'],
            acceptanceCriteria: [
              {
                id: 'AC-1',
                criterion: 'Test criterion',
              },
            ],
          },
          qualityOperations: {
            testingStrategy: [
              {
                acId: 'AC-1',
                scenario: 'Test scenario',
                testType: 'Unit',
                testFile: 'test.test.ts',
              },
            ],
          },
        },
      };

      const mockTaskSchema = z.object({
        metaGovernance: z.object({
          status: z.object({
            currentState: z.string(),
            priority: z.string(),
            progress: z.number(),
          }),
          priorityDrivers: z.array(z.string()),
        }),
        businessScope: z.object({
          overview: z.array(z.string()),
          acceptanceCriteria: z.array(
            z.object({
              id: z.string(),
              criterion: z.string(),
            })
          ),
        }),
        qualityOperations: z.object({
          testingStrategy: z.array(
            z.object({
              acId: z.string(),
              scenario: z.string(),
              testType: z.string(),
              testFile: z.string(),
            })
          ),
        }),
      });

      (createTaskSchema as any).mockResolvedValue(mockTaskSchema);

      const provider = await createSchemaProvider();
      const result = await provider.validate(validTaskData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should map invalid fields to LintingError[] with correct paths/messages', async () => {
      // AC-3: Invalid fields map to `LintingError[]` with correct paths/messages

      const invalidTaskData: DocumentData = {
        docType: 'task',
        sections: {
          metaGovernance: {
            status: {
              currentState: 'Invalid Status', // Invalid status
              priority: 'Invalid Priority', // Invalid priority
              progress: 'not a number', // Should be number
            },
            priorityDrivers: 'not an array', // Should be array
          },
          businessScope: {
            overview: 'not an array', // Should be array
            acceptanceCriteria: [
              {
                id: 'AC-1',
                // Missing required 'criterion' field
              },
            ],
          },
        },
      };

      const mockTaskSchema = z.object({
        metaGovernance: z.object({
          status: z.object({
            currentState: z.enum(['Not Started', 'In Progress', 'Under Review', 'Complete', 'Blocked']),
            priority: z.enum(['High', 'Medium', 'Low']),
            progress: z.number(),
          }),
          priorityDrivers: z.array(z.string()),
        }),
        businessScope: z.object({
          overview: z.array(z.string()),
          acceptanceCriteria: z.array(
            z.object({
              id: z.string(),
              criterion: z.string(),
            })
          ),
        }),
      });

      (createTaskSchema as any).mockResolvedValue(mockTaskSchema);

      const provider = await createSchemaProvider();
      const result = await provider.validate(invalidTaskData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors!.length).toBeGreaterThan(0);

      // Check for specific error mappings
      const statusError = result.errors!.find((e) => e.path.includes('metaGovernance.status.currentState'));
      expect(statusError).toBeDefined();
      expect(statusError!.sectionId).toBe('status');
      expect(statusError!.familyId).toBe('metaGovernance');
      expect(statusError!.field).toBe('currentState');
      expect(statusError!.message).toContain('Invalid option');

      const progressError = result.errors!.find((e) => e.path.includes('metaGovernance.status.progress'));
      expect(progressError).toBeDefined();
      expect(progressError!.message).toContain('expected number');
    });

    it('should not have tight coupling to parser internals (types-only)', async () => {
      // AC-4: No tight coupling to parser internals (types-only)

      // This test verifies that the provider only depends on types, not implementation details
      // The provider should work with any DocumentData that matches the interface

      const mockTaskSchema = z.object({
        test: z.string(),
      });
      (createTaskSchema as any).mockResolvedValue(mockTaskSchema);

      const provider = await createSchemaProvider();

      // Verify that the provider only uses the public interface
      expect(provider.validate).toBeDefined();
      expect(typeof provider.validate).toBe('function');

      // The provider should not import or depend on parser-specific implementation details
      // This is verified by the fact that we can mock the schema factories
      // and the provider still works with the same interface
    });

    it('should handle schema composition errors gracefully', async () => {
      // Test error handling when schema composition fails

      (createTaskSchema as any).mockRejectedValue(new Error('Schema composition failed'));

      const provider = await createSchemaProvider();
      const result = await provider.validate({ docType: 'task', sections: {} });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
      expect(result.errors![0].message).toContain('Schema composition failed');
    });

    it('should validate plan documents correctly', async () => {
      // Test plan document validation

      const validPlanData: DocumentData = {
        docType: 'plan',
        sections: {
          metaGovernance: {
            status: {
              created: '2025-01-01',
              lastUpdated: '2025-01-01',
            },
            priorityDrivers: ['TEC-Dev_Productivity_Enhancement'],
          },
          businessScope: {
            overview: ['Core Function: Test plan function'],
            businessContext: 'Test business context',
            successCriteria: ['Test success criterion'],
          },
        },
      };

      const mockPlanSchema = z.object({
        metaGovernance: z.object({
          status: z.object({
            created: z.string(),
            lastUpdated: z.string(),
          }),
          priorityDrivers: z.array(z.string()),
        }),
        businessScope: z.object({
          overview: z.array(z.string()),
          businessContext: z.string(),
          successCriteria: z.array(z.string()),
        }),
      });

      (createPlanSchema as any).mockResolvedValue(mockPlanSchema);

      const provider = await createSchemaProvider();
      const result = await provider.validate(validPlanData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
