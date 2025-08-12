import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createMaintenanceMonitoringSchema } from '../../5-maintenance-monitoring.schema.js';

describe('Maintenance & Monitoring Schema - Accessibility Tests', () => {
  describe('byId Index Completeness', () => {
    it('should register all plan sections in byId index', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan should have all sections
      expect(byId['5.1']).toBeDefined(); // Current Maintenance (plan only)
      expect(byId['5.2']).toBeDefined(); // Target Maintenance (plan & task)
      expect(byId['5.1.1']).toBeDefined(); // Current Error Handling (plan only)
      expect(byId['5.1.2']).toBeDefined(); // Current Logging (plan only)
      expect(byId['5.2.1']).toBeDefined(); // Target Error Handling (plan & task)
      expect(byId['5.2.2']).toBeDefined(); // Target Logging (plan & task)

      expect(Object.keys(byId)).toHaveLength(6);
    });

    it('should register all task sections in byId index', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Task should only have target sections
      expect(byId['5.2']).toBeDefined(); // Target Maintenance (plan & task)
      expect(byId['5.2.1']).toBeDefined(); // Target Error Handling (plan & task)
      expect(byId['5.2.2']).toBeDefined(); // Target Logging (plan & task)

      expect(Object.keys(byId)).toHaveLength(3);
    });

    it('should not register plan-only sections in task byId index', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Task should not have current sections
      expect(byId['5.1']).toBeUndefined(); // Current Maintenance (plan only)
      expect(byId['5.1.1']).toBeUndefined(); // Current Error Handling (plan only)
      expect(byId['5.1.2']).toBeUndefined(); // Current Logging (plan only)
    });

    it('should not register task-only sections in plan byId index', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Plan should have all sections (no task-only sections in this family)
      expect(byId['5.1']).toBeDefined(); // Current Maintenance (plan only)
      expect(byId['5.2']).toBeDefined(); // Target Maintenance (plan & task)
    });
  });

  describe('Schema Registration Verification', () => {
    it('should register schemas with correct types for plan', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should be ZodObject
      expect(byId['5.1']).toBeInstanceOf(z.ZodObject);
      expect(byId['5.2']).toBeInstanceOf(z.ZodObject);

      // Array sections should be ZodArray
      expect(byId['5.1.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['5.1.2']).toBeInstanceOf(z.ZodArray);
      expect(byId['5.2.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['5.2.2']).toBeInstanceOf(z.ZodArray);
    });

    it('should register schemas with correct types for task', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Container sections should be ZodObject
      expect(byId['5.2']).toBeInstanceOf(z.ZodObject);

      // Array sections should be ZodArray
      expect(byId['5.2.1']).toBeInstanceOf(z.ZodArray);
      expect(byId['5.2.2']).toBeInstanceOf(z.ZodArray);
    });
  });

  describe('Independent Section Validation', () => {
    it('should validate plan sections independently via byId', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test current error handling (5.1.1)
      const validErrorHandling = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];
      expect(byId['5.1.1'].safeParse(validErrorHandling).success).toBe(true);

      // Test current logging monitoring (5.1.2)
      const validLoggingMonitoring = [
        {
          component: 'Current Logging',
          strategy: 'Console output for errors and warnings',
          notes: '',
        },
      ];
      expect(byId['5.1.2'].safeParse(validLoggingMonitoring).success).toBe(true);

      // Test target error handling (5.2.1)
      expect(byId['5.2.1'].safeParse(validErrorHandling).success).toBe(true);

      // Test target logging monitoring (5.2.2)
      expect(byId['5.2.2'].safeParse(validLoggingMonitoring).success).toBe(true);
    });

    it('should validate task sections independently via byId', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      // Test target error handling (5.2.1)
      const validErrorHandling = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];
      expect(byId['5.2.1'].safeParse(validErrorHandling).success).toBe(true);

      // Test target logging monitoring (5.2.2)
      const validLoggingMonitoring = [
        {
          component: 'Metrics',
          strategy: 'Prometheus endpoint `/metrics` will be exposed.',
          notes: '',
        },
      ];
      expect(byId['5.2.2'].safeParse(validLoggingMonitoring).success).toBe(true);
    });
  });

  describe('Schema Consistency Verification', () => {
    it('should maintain consistent validation between byId and composed schema for plan', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      const validErrorHandling = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      const byIdResult = byId['5.2.1'].safeParse(validErrorHandling);
      const composedResult = shape.targetMaintenanceAndMonitoring.shape.errorHandling.safeParse(validErrorHandling);

      expect(byIdResult.success).toBe(composedResult.success);
    });

    it('should maintain consistent validation between byId and composed schema for task', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      const validLoggingMonitoring = [
        {
          component: 'Metrics',
          strategy: 'Prometheus endpoint `/metrics` will be exposed.',
          notes: '',
        },
      ];

      const byIdResult = byId['5.2.2'].safeParse(validLoggingMonitoring);
      const composedResult =
        shape.targetMaintenanceAndMonitoring.shape.loggingMonitoring.safeParse(validLoggingMonitoring);

      expect(byIdResult.success).toBe(composedResult.success);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent section IDs gracefully', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      expect(byId['5.999']).toBeUndefined();
      expect(byId['invalid-id']).toBeUndefined();
    });

    it('should handle byId access on invalid schema gracefully', () => {
      const invalidSchema = {} as any;
      expect(invalidSchema.__byId).toBeUndefined();
    });

    it('should validate that byId schemas are actual Zod schemas', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      Object.values(byId).forEach((schema) => {
        expect(schema).toBeInstanceOf(z.ZodType);
        expect(typeof schema.safeParse).toBe('function');
      });
    });
  });
});
