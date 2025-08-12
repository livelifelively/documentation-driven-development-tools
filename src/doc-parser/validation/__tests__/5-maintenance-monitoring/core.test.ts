import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  createMaintenanceMonitoringSchema,
  getMaintenanceMonitoringPlanSchema,
  getMaintenanceMonitoringTaskSchema,
} from '../../5-maintenance-monitoring.schema.js';

describe('Maintenance & Monitoring Schema - Core Tests', () => {
  describe('Factory Function Tests', () => {
    describe('createMaintenanceMonitoringSchema', () => {
      it('should create plan schema with byId registration', () => {
        const planSchema = createMaintenanceMonitoringSchema('plan');
        const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(Object.keys(byId)).toContain('5.1'); // Current Maintenance (plan only)
        expect(Object.keys(byId)).toContain('5.2'); // Target Maintenance (plan & task)
        expect(Object.keys(byId)).toContain('5.1.1'); // Current Error Handling (plan only)
        expect(Object.keys(byId)).toContain('5.1.2'); // Current Logging (plan only)
        expect(Object.keys(byId)).toContain('5.2.1'); // Target Error Handling (plan & task)
        expect(Object.keys(byId)).toContain('5.2.2'); // Target Logging (plan & task)
      });

      it('should create task schema with byId registration', () => {
        const taskSchema = createMaintenanceMonitoringSchema('task');
        const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

        expect(byId).toBeDefined();
        expect(Object.keys(byId)).toContain('5.2'); // Target Maintenance (plan & task)
        expect(Object.keys(byId)).toContain('5.2.1'); // Target Error Handling (plan & task)
        expect(Object.keys(byId)).toContain('5.2.2'); // Target Logging (plan & task)

        // Verify plan-only sections are omitted from task
        expect(Object.keys(byId)).not.toContain('5.1'); // Current Maintenance (plan only)
        expect(Object.keys(byId)).not.toContain('5.1.1'); // Current Error Handling (plan only)
        expect(Object.keys(byId)).not.toContain('5.1.2'); // Current Logging (plan only)
      });

      it('should validate complete plan document', () => {
        const planSchema = createMaintenanceMonitoringSchema('plan');
        const validPlan = {
          currentMaintenanceAndMonitoring: {
            errorHandling: [
              {
                id: 'ERROR-01',
                errorType: 'File System Error',
                trigger: 'Cannot read a required file or directory.',
                action: 'Abort with exit code 1.',
                userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
              },
            ],
            loggingMonitoring: [
              {
                component: 'Current Logging',
                strategy: 'Console output for errors and warnings',
                notes: '',
              },
            ],
          },
          targetMaintenanceAndMonitoring: {
            errorHandling: [
              {
                id: 'ERROR-01',
                errorType: 'File System Error',
                trigger: 'Cannot read a required file or directory.',
                action: 'Abort with exit code 1.',
                userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
              },
            ],
            loggingMonitoring: [
              {
                component: 'Metrics',
                strategy: 'Prometheus endpoint `/metrics` will be exposed.',
                notes: '',
              },
            ],
          },
        };

        const result = planSchema.safeParse(validPlan);
        expect(result.success).toBe(true);
      });

      it('should validate complete task document', () => {
        const taskSchema = createMaintenanceMonitoringSchema('task');
        const validTask = {
          targetMaintenanceAndMonitoring: {
            errorHandling: [
              {
                id: 'ERROR-01',
                errorType: 'File System Error',
                trigger: 'Cannot read a required file or directory.',
                action: 'Abort with exit code 1.',
                userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
              },
            ],
            loggingMonitoring: [
              {
                component: 'Metrics',
                strategy: 'Prometheus endpoint `/metrics` will be exposed.',
                notes: '',
              },
            ],
          },
        };

        const result = taskSchema.safeParse(validTask);
        expect(result.success).toBe(true);
      });
    });

    describe('Convenience Functions', () => {
      it('should create plan schema via convenience function', () => {
        const planSchema = getMaintenanceMonitoringPlanSchema();
        expect(planSchema).toBeDefined();
        expect((planSchema as any).__byId).toBeDefined();
      });

      it('should create task schema via convenience function', () => {
        const taskSchema = getMaintenanceMonitoringTaskSchema();
        expect(taskSchema).toBeDefined();
        expect((taskSchema as any).__byId).toBeDefined();
      });
    });
  });

  describe('byId Index Verification', () => {
    it('should allow independent section validation via byId', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const validErrorHandling = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      const result = byId['5.2.1'].safeParse(validErrorHandling);
      expect(result.success).toBe(true);
    });

    it('should reject invalid data via byId', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      const invalidErrorHandling = [
        {
          id: 'ERROR-01',
          // Missing errorType
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      const result = byId['5.2.1'].safeParse(invalidErrorHandling);
      expect(result.success).toBe(false);
    });
  });
});
