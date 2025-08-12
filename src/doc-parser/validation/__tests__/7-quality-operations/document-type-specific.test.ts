import { describe, it, expect } from 'vitest';
import { createQualityOperationsSchema } from '../../7-quality-operations.schema.js';
import { z } from 'zod';

describe('Quality & Operations Schema - Document Type Specific Tests', () => {
  describe('Section 7.4: Deployment Steps (Plan-Only)', () => {
    it('should validate deployment steps via byId and composed schema for plan', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        'Update environment variables in Vercel dashboard.',
        'Promote the build to production.',
        'Verify deployment health checks',
        'Update DNS records if needed',
      ];

      expect(byId['7.4'].safeParse(validDeploymentSteps).success).toBe(true);
      expect(shape.deploymentSteps.safeParse(validDeploymentSteps).success).toBe(true);
    });

    it('should reject deployment steps with empty strings', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        '', // Invalid empty string
        'Promote the build to production.',
      ];

      expect(byId['7.4'].safeParse(invalidDeploymentSteps).success).toBe(false);
      expect(shape.deploymentSteps.safeParse(invalidDeploymentSteps).success).toBe(false);
    });

    it('should reject empty deployment steps array', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const emptyDeploymentSteps: any[] = [];

      expect(byId['7.4'].safeParse(emptyDeploymentSteps).success).toBe(false);
      expect(shape.deploymentSteps.safeParse(emptyDeploymentSteps).success).toBe(false);
    });

    it('should reject deployment steps with non-string items', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        123, // Invalid non-string item
        'Promote the build to production.',
      ];

      expect(byId['7.4'].safeParse(invalidDeploymentSteps).success).toBe(false);
      expect(shape.deploymentSteps.safeParse(invalidDeploymentSteps).success).toBe(false);
    });

    it('should validate complex deployment steps with various formats', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const complexDeploymentSteps = [
        'Pre-deployment: Run all tests and linting',
        'Database: Execute migration scripts',
        'Infrastructure: Update cloud resources',
        'Application: Deploy new version',
        'Post-deployment: Run smoke tests',
        'Monitoring: Verify application health',
        'Documentation: Update deployment logs',
      ];

      expect(byId['7.4'].safeParse(complexDeploymentSteps).success).toBe(true);
      expect(shape.deploymentSteps.safeParse(complexDeploymentSteps).success).toBe(true);
    });

    it('should verify deployment steps is registered in plan byId but not task byId', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan-only section should be in plan byId
      expect(planById['7.4']).toBeDefined();
      expect(typeof planById['7.4'].safeParse).toBe('function');

      // Plan-only section should NOT be in task byId
      expect(taskById['7.4']).toBeUndefined();
    });

    it('should verify deployment steps schema type is ZodArray', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['7.4']).toBeInstanceOf(z.ZodArray);
    });
  });

  describe('Section 7.5: Local Test Commands (Task-Only)', () => {
    it('should validate local test commands via byId and composed schema for task', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validLocalTestCommands = [
        'npm test',
        'npm run test:watch',
        'npm run test:coverage',
        'npm run test:integration',
        'npm run test:e2e',
        'npm run lint',
        'npm run type-check',
      ];

      expect(byId['7.5'].safeParse(validLocalTestCommands).success).toBe(true);
      expect(shape.localTestCommands.safeParse(validLocalTestCommands).success).toBe(true);
    });

    it('should reject local test commands with empty strings', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const invalidLocalTestCommands = [
        'npm test',
        '', // Invalid empty string
        'npm run test:coverage',
      ];

      expect(byId['7.5'].safeParse(invalidLocalTestCommands).success).toBe(false);
      expect(shape.localTestCommands.safeParse(invalidLocalTestCommands).success).toBe(false);
    });

    it('should reject empty local test commands array', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const emptyLocalTestCommands: any[] = [];

      expect(byId['7.5'].safeParse(emptyLocalTestCommands).success).toBe(false);
      expect(shape.localTestCommands.safeParse(emptyLocalTestCommands).success).toBe(false);
    });

    it('should reject local test commands with non-string items', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const invalidLocalTestCommands = [
        'npm test',
        456, // Invalid non-string item
        'npm run test:coverage',
      ];

      expect(byId['7.5'].safeParse(invalidLocalTestCommands).success).toBe(false);
      expect(shape.localTestCommands.safeParse(invalidLocalTestCommands).success).toBe(false);
    });

    it('should validate complex local test commands with various formats', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const complexLocalTestCommands = [
        'Unit Tests: npm test -- --coverage',
        'Integration Tests: npm run test:integration',
        'E2E Tests: npm run test:e2e',
        'Linting: npm run lint --fix',
        'Type Checking: npm run type-check',
        'Performance Tests: npm run test:perf',
        'Security Tests: npm run test:security',
      ];

      expect(byId['7.5'].safeParse(complexLocalTestCommands).success).toBe(true);
      expect(shape.localTestCommands.safeParse(complexLocalTestCommands).success).toBe(true);
    });

    it('should verify local test commands is registered in task byId but not plan byId', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Task-only section should be in task byId
      expect(taskById['7.5']).toBeDefined();
      expect(typeof taskById['7.5'].safeParse).toBe('function');

      // Task-only section should NOT be in plan byId
      expect(planById['7.5']).toBeUndefined();
    });

    it('should verify local test commands schema type is ZodArray', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['7.5']).toBeInstanceOf(z.ZodArray);
    });
  });

  describe('Cross-Schema Verification', () => {
    it('should verify plan schema does not contain task-only sections', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const shape = planSchema.shape as any;

      // Task-only sections should not exist in plan schema
      expect(shape.localTestCommands).toBeUndefined();
    });

    it('should verify task schema does not contain plan-only sections', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const shape = taskSchema.shape as any;

      // Plan-only sections should not exist in task schema
      expect(shape.deploymentSteps).toBeUndefined();
    });

    it('should verify byId registration completeness for plan schema', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedPlanSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.4'];

      expectedPlanSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      // Verify no task-only sections
      expect(byId['7.5']).toBeUndefined();

      // Verify exact count
      expect(Object.keys(byId).length).toBe(expectedPlanSections.length);
    });

    it('should verify byId registration completeness for task schema', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const expectedTaskSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3', '7.5'];

      expectedTaskSections.forEach((sectionId) => {
        expect(byId[sectionId]).toBeDefined();
        expect(typeof byId[sectionId].safeParse).toBe('function');
      });

      // Verify no plan-only sections
      expect(byId['7.4']).toBeUndefined();

      // Verify exact count
      expect(Object.keys(byId).length).toBe(expectedTaskSections.length);
    });
  });

  describe('Document Type Applicability Rules', () => {
    it('should validate that plan-only sections are only available in plan documents', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan-only sections
      expect(planById['7.4']).toBeDefined();
      expect(taskById['7.4']).toBeUndefined();
    });

    it('should validate that task-only sections are only available in task documents', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Task-only sections
      expect(taskById['7.5']).toBeDefined();
      expect(planById['7.5']).toBeUndefined();
    });

    it('should validate that shared sections are available in both document types', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const taskSchema = createQualityOperationsSchema('task');

      const planById = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const taskById = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const sharedSections = ['7.1', '7.1.1', '7.1.2', '7.2', '7.3', '7.3.1', '7.3.2', '7.3.3'];

      sharedSections.forEach((sectionId) => {
        expect(planById[sectionId]).toBeDefined();
        expect(taskById[sectionId]).toBeDefined();
        expect(typeof planById[sectionId].safeParse).toBe('function');
        expect(typeof taskById[sectionId].safeParse).toBe('function');
      });
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain consistent validation between byId and composed schema for deployment steps', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        'Update environment variables in Vercel dashboard.',
        'Promote the build to production.',
      ];

      const byIdResult = byId['7.4'].safeParse(validDeploymentSteps);
      const composedResult = shape.deploymentSteps.safeParse(validDeploymentSteps);

      expect(byIdResult.success).toBe(composedResult.success);
    });

    it('should maintain consistent validation between byId and composed schema for local test commands', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validLocalTestCommands = ['npm test', 'npm run test:watch', 'npm run test:coverage'];

      const byIdResult = byId['7.5'].safeParse(validLocalTestCommands);
      const composedResult = shape.localTestCommands.safeParse(validLocalTestCommands);

      expect(byIdResult.success).toBe(composedResult.success);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle whitespace-only strings in deployment steps', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        '   ', // Whitespace-only string (accepted by current schema)
        'Promote the build to production.',
      ];

      const result = byId['7.4'].safeParse(invalidDeploymentSteps);
      // Note: Current schema only checks min(1), not whitespace content
      expect(result.success).toBe(true);
    });

    it('should handle whitespace-only strings in local test commands', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidLocalTestCommands = [
        'npm test',
        '   ', // Whitespace-only string (accepted by current schema)
        'npm run test:coverage',
      ];

      const result = byId['7.5'].safeParse(invalidLocalTestCommands);
      // Note: Current schema only checks min(1), not whitespace content
      expect(result.success).toBe(true);
    });

    it('should handle null and undefined values in deployment steps', () => {
      const planSchema = createQualityOperationsSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidDeploymentSteps = [
        'Run database migrations: yarn db:migrate',
        null, // Invalid null value
        'Promote the build to production.',
      ];

      const result = byId['7.4'].safeParse(invalidDeploymentSteps);
      expect(result.success).toBe(false);
    });

    it('should handle null and undefined values in local test commands', () => {
      const taskSchema = createQualityOperationsSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidLocalTestCommands = [
        'npm test',
        undefined, // Invalid undefined value
        'npm run test:coverage',
      ];

      const result = byId['7.5'].safeParse(invalidLocalTestCommands);
      expect(result.success).toBe(false);
    });
  });
});
