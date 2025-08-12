import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createMaintenanceMonitoringSchema } from '../../5-maintenance-monitoring.schema.js';

describe('Maintenance & Monitoring Schema - Section Tests', () => {
  describe('Current Maintenance and Monitoring Section (5.1) - Plan Only', () => {
    const planSchema = createMaintenanceMonitoringSchema('plan');
    const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
    const shape = planSchema.shape as any;

    it('should validate current maintenance monitoring via byId and composed schema', () => {
      const validData = {
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
      };

      expect(byId['5.1'].safeParse(validData).success).toBe(true);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(validData).success).toBe(true);
    });

    it('should validate current maintenance monitoring with multiple error scenarios via byId and composed schema', () => {
      const validData = {
        errorHandling: [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
          {
            id: 'ERROR-02',
            errorType: 'Schema Validation Error',
            trigger: 'A document violates the canonical schema.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
          },
        ],
        loggingMonitoring: [
          {
            component: 'Current Logging',
            strategy: 'Console output for errors and warnings',
            notes: '',
          },
          {
            component: 'Current Monitoring',
            strategy: 'No formal monitoring in place',
            notes: 'Basic monitoring only',
          },
        ],
      };

      expect(byId['5.1'].safeParse(validData).success).toBe(true);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(validData).success).toBe(true);
    });

    it('should reject current maintenance monitoring with missing error handling via byId and composed schema', () => {
      const invalidData = {
        loggingMonitoring: [
          {
            component: 'Current Logging',
            strategy: 'Console output for errors and warnings',
            notes: '',
          },
        ],
      };

      expect(byId['5.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
    });

    it('should reject current maintenance monitoring with missing logging monitoring via byId and composed schema', () => {
      const invalidData = {
        errorHandling: [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ],
      };

      expect(byId['5.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
    });

    it('should reject current maintenance monitoring with empty error handling via byId and composed schema', () => {
      const invalidData = {
        errorHandling: [],
        loggingMonitoring: [
          {
            component: 'Current Logging',
            strategy: 'Console output for errors and warnings',
            notes: '',
          },
        ],
      };

      expect(byId['5.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
    });

    it('should reject current maintenance monitoring with empty logging monitoring via byId and composed schema', () => {
      const invalidData = {
        errorHandling: [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ],
        loggingMonitoring: [],
      };

      expect(byId['5.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
    });

    it('should reject current maintenance monitoring with invalid error handling structure via byId and composed schema', () => {
      const invalidData = {
        errorHandling: [
          {
            id: 'ERROR-01',
            // Missing errorType
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
      };

      expect(byId['5.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
    });

    it('should reject current maintenance monitoring with invalid logging monitoring structure via byId and composed schema', () => {
      const invalidData = {
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
            // Missing component
            strategy: 'Console output for errors and warnings',
            notes: '',
          },
        ],
      };

      expect(byId['5.1'].safeParse(invalidData).success).toBe(false);
      expect(shape.currentMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Target Maintenance and Monitoring Section (5.2) - Plan and Task', () => {
    describe('Plan Target Maintenance', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = planSchema.shape as any;

      it('should validate target maintenance monitoring via byId and composed schema', () => {
        const validData = {
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
        };

        expect(byId['5.2'].safeParse(validData).success).toBe(true);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(validData).success).toBe(true);
      });

      it('should validate target maintenance monitoring with comprehensive scenarios via byId and composed schema', () => {
        const validData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
            {
              id: 'ERROR-02',
              errorType: 'Schema Validation Error',
              trigger: 'A document violates the canonical schema.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
            },
          ],
          loggingMonitoring: [
            {
              component: 'Target Logging',
              strategy: 'Structured logging with log levels',
              notes: 'Enhanced logging for production',
            },
            {
              component: 'Target Monitoring',
              strategy: 'Real-time monitoring with alerts',
              notes: 'Comprehensive monitoring solution',
            },
          ],
        };

        expect(byId['5.2'].safeParse(validData).success).toBe(true);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(validData).success).toBe(true);
      });

      it('should reject target maintenance monitoring with missing error handling via byId and composed schema', () => {
        const invalidData = {
          loggingMonitoring: [
            {
              component: 'Metrics',
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with missing logging monitoring via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with empty error handling via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [],
          loggingMonitoring: [
            {
              component: 'Metrics',
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with empty logging monitoring via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
          ],
          loggingMonitoring: [],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with invalid error handling structure via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              // Missing errorType
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
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with invalid logging monitoring structure via byId and composed schema', () => {
        const invalidData = {
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
              // Missing component
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Target Maintenance', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;
      const shape = taskSchema.shape as any;

      it('should validate target maintenance monitoring via byId and composed schema', () => {
        const validData = {
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
        };

        expect(byId['5.2'].safeParse(validData).success).toBe(true);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(validData).success).toBe(true);
      });

      it('should reject target maintenance monitoring with invalid error handling via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              // Missing errorType
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
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with empty logging monitoring via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
          ],
          loggingMonitoring: [],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with missing error handling via byId and composed schema', () => {
        const invalidData = {
          loggingMonitoring: [
            {
              component: 'Metrics',
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with missing logging monitoring via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with empty error handling via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [],
          loggingMonitoring: [
            {
              component: 'Metrics',
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with invalid logging monitoring structure via byId and composed schema', () => {
        const invalidData = {
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
              // Missing component
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });

      it('should reject target maintenance monitoring with mixed valid and invalid entries via byId and composed schema', () => {
        const invalidData = {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
            {
              id: 'ERROR-02',
              // Missing errorType
              trigger: 'A document violates the canonical schema.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
            },
          ],
          loggingMonitoring: [
            {
              component: 'Metrics',
              strategy: 'Prometheus endpoint `/metrics` will be exposed.',
              notes: '',
            },
          ],
        };

        expect(byId['5.2'].safeParse(invalidData).success).toBe(false);
        expect(shape.targetMaintenanceAndMonitoring.safeParse(invalidData).success).toBe(false);
      });
    });
  });
});
