import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createMaintenanceMonitoringSchema } from '../../5-maintenance-monitoring.schema.js';

describe('Maintenance & Monitoring Schema - Subsection Tests', () => {
  describe('Current Error Handling Section (5.1.1) - Plan Only', () => {
    const planSchema = createMaintenanceMonitoringSchema('plan');
    const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

    it('should validate current error handling via byId', () => {
      const validData = [
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
      ];

      expect(byId['5.1.1'].safeParse(validData).success).toBe(true);
    });

    it('should validate current error handling with single error scenario via byId', () => {
      const validData = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(validData).success).toBe(true);
    });

    it('should validate current error handling with complex error scenarios via byId', () => {
      const validData = [
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
        {
          id: 'ERROR-03',
          errorType: 'Network Error',
          trigger: 'External API is unreachable.',
          action: 'Retry with exponential backoff.',
          userFeedback: 'ERROR: Network connection failed. Retrying...',
        },
      ];

      expect(byId['5.1.1'].safeParse(validData).success).toBe(true);
    });

    it('should reject current error handling with missing ID via byId', () => {
      const invalidData = [
        {
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current error handling with missing error type via byId', () => {
      const invalidData = [
        {
          id: 'ERROR-01',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current error handling with missing trigger via byId', () => {
      const invalidData = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current error handling with missing action via byId', () => {
      const invalidData = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current error handling with missing user feedback via byId', () => {
      const invalidData = [
        {
          id: 'ERROR-01',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty current error handling array via byId', () => {
      expect(byId['5.1.1'].safeParse([]).success).toBe(false);
    });

    it('should reject current error handling with empty strings via byId', () => {
      const invalidData = [
        {
          id: 'ERROR-01',
          errorType: '',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current error handling with empty ID via byId', () => {
      const invalidData = [
        {
          id: '',
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current error handling with mixed valid and invalid entries via byId', () => {
      const invalidData = [
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
      ];

      expect(byId['5.1.1'].safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Current Logging & Monitoring Section (5.1.2) - Plan Only', () => {
    const planSchema = createMaintenanceMonitoringSchema('plan');
    const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

    it('should validate current logging monitoring via byId', () => {
      const validData = [
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
      ];

      expect(byId['5.1.2'].safeParse(validData).success).toBe(true);
    });

    it('should validate current logging monitoring with single component via byId', () => {
      const validData = [
        {
          component: 'Current Logging',
          strategy: 'Console output for errors and warnings',
          notes: '',
        },
      ];

      expect(byId['5.1.2'].safeParse(validData).success).toBe(true);
    });

    it('should validate current logging monitoring with multiple components via byId', () => {
      const validData = [
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
        {
          component: 'Current Metrics',
          strategy: 'No metrics collection implemented',
          notes: 'Future enhancement needed',
        },
      ];

      expect(byId['5.1.2'].safeParse(validData).success).toBe(true);
    });

    it('should reject current logging monitoring with missing component via byId', () => {
      const invalidData = [
        {
          strategy: 'Console output for errors and warnings',
          notes: '',
        },
      ];

      expect(byId['5.1.2'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current logging monitoring with missing strategy via byId', () => {
      const invalidData = [
        {
          component: 'Current Logging',
          notes: '',
        },
      ];

      expect(byId['5.1.2'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current logging monitoring with empty component via byId', () => {
      const invalidData = [
        {
          component: '',
          strategy: 'Console output for errors and warnings',
          notes: '',
        },
      ];

      expect(byId['5.1.2'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject current logging monitoring with empty strategy via byId', () => {
      const invalidData = [
        {
          component: 'Current Logging',
          strategy: '',
          notes: '',
        },
      ];

      expect(byId['5.1.2'].safeParse(invalidData).success).toBe(false);
    });

    it('should reject empty current logging monitoring array via byId', () => {
      expect(byId['5.1.2'].safeParse([]).success).toBe(false);
    });

    it('should validate current logging monitoring with optional notes via byId', () => {
      const validData = [
        {
          component: 'Current Logging',
          strategy: 'Console output for errors and warnings',
          // notes is optional
        },
      ];

      expect(byId['5.1.2'].safeParse(validData).success).toBe(true);
    });

    it('should validate current logging monitoring with detailed notes via byId', () => {
      const validData = [
        {
          component: 'Current Logging',
          strategy: 'Console output for errors and warnings',
          notes: 'Basic logging strategy - needs enhancement for production',
        },
      ];

      expect(byId['5.1.2'].safeParse(validData).success).toBe(true);
    });

    it('should reject current logging monitoring with mixed valid and invalid entries via byId', () => {
      const invalidData = [
        {
          component: 'Current Logging',
          strategy: 'Console output for errors and warnings',
          notes: '',
        },
        {
          // Missing component
          strategy: 'No formal monitoring in place',
          notes: 'Basic monitoring only',
        },
      ];

      expect(byId['5.1.2'].safeParse(invalidData).success).toBe(false);
    });
  });

  describe('Target Error Handling Section (5.2.1) - Plan and Task', () => {
    describe('Plan Target Error Handling', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate target error handling via byId', () => {
        const validData = [
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
          {
            id: 'ERROR-03',
            errorType: 'API/Network Error',
            trigger: 'External API is unreachable or returns > 299.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Failed to transmit status to [endpoint]: [HTTP_status_or_error].',
          },
        ];

        expect(byId['5.2.1'].safeParse(validData).success).toBe(true);
      });

      it('should validate target error handling with single error scenario via byId', () => {
        const validData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(validData).success).toBe(true);
      });

      it('should validate target error handling with complex error scenarios via byId', () => {
        const validData = [
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
          {
            id: 'ERROR-03',
            errorType: 'API/Network Error',
            trigger: 'External API is unreachable or returns > 299.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Failed to transmit status to [endpoint]: [HTTP_status_or_error].',
          },
          {
            id: 'ERROR-04',
            errorType: 'Database Error',
            trigger: 'Database connection fails or query times out.',
            action: 'Retry with exponential backoff.',
            userFeedback: 'ERROR: Database operation failed. Please try again.',
          },
        ];

        expect(byId['5.2.1'].safeParse(validData).success).toBe(true);
      });

      it('should reject target error handling with missing fields via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            // Missing trigger, action, userFeedback
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing ID via byId', () => {
        const invalidData = [
          {
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing error type via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing trigger via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing action via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing user feedback via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty target error handling array via byId', () => {
        expect(byId['5.2.1'].safeParse([]).success).toBe(false);
      });

      it('should reject target error handling with empty strings via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: '',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with empty ID via byId', () => {
        const invalidData = [
          {
            id: '',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with mixed valid and invalid entries via byId', () => {
        const invalidData = [
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
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Target Error Handling', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate target error handling via byId', () => {
        const validData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(validData).success).toBe(true);
      });

      it('should validate target error handling with multiple scenarios via byId', () => {
        const validData = [
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
        ];

        expect(byId['5.2.1'].safeParse(validData).success).toBe(true);
      });

      it('should reject target error handling with invalid data via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: '', // Empty string not allowed
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing ID via byId', () => {
        const invalidData = [
          {
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing error type via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing trigger via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing action via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with missing user feedback via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty target error handling array via byId', () => {
        expect(byId['5.2.1'].safeParse([]).success).toBe(false);
      });

      it('should reject target error handling with empty strings via byId', () => {
        const invalidData = [
          {
            id: 'ERROR-01',
            errorType: '',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with empty ID via byId', () => {
        const invalidData = [
          {
            id: '',
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target error handling with mixed valid and invalid entries via byId', () => {
        const invalidData = [
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
        ];

        expect(byId['5.2.1'].safeParse(invalidData).success).toBe(false);
      });
    });
  });

  describe('Target Logging & Monitoring Section (5.2.2) - Plan and Task', () => {
    describe('Plan Target Logging Monitoring', () => {
      const planSchema = createMaintenanceMonitoringSchema('plan');
      const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate target logging monitoring via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
          {
            component: 'Logs',
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'Centralized logging',
          },
          {
            component: 'Tracing',
            strategy: 'OpenTelemetry SDK will be used for distributed tracing.',
            notes: 'Performance monitoring',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target logging monitoring with single component via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target logging monitoring with comprehensive components via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: 'Business and technical metrics',
          },
          {
            component: 'Logs',
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'Centralized logging',
          },
          {
            component: 'Tracing',
            strategy: 'OpenTelemetry SDK will be used for distributed tracing.',
            notes: 'Performance monitoring',
          },
          {
            component: 'Alerts',
            strategy: 'AlertManager integration with Slack notifications.',
            notes: 'Real-time alerting',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should reject target logging monitoring with missing component via byId', () => {
        const invalidData = [
          {
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target logging monitoring with missing strategy via byId', () => {
        const invalidData = [
          {
            component: 'Metrics',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target logging monitoring with empty component via byId', () => {
        const invalidData = [
          {
            component: '',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target logging monitoring with empty strategy via byId', () => {
        const invalidData = [
          {
            component: 'Metrics',
            strategy: '',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty target logging monitoring array via byId', () => {
        expect(byId['5.2.2'].safeParse([]).success).toBe(false);
      });

      it('should validate target logging monitoring with optional notes via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            // notes is optional
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target logging monitoring with detailed notes via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: 'Comprehensive metrics collection for production monitoring',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should reject target logging monitoring with mixed valid and invalid entries via byId', () => {
        const invalidData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
          {
            // Missing component
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'Centralized logging',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });
    });

    describe('Task Target Logging Monitoring', () => {
      const taskSchema = createMaintenanceMonitoringSchema('task');
      const byId = (taskSchema as any).__byId as Record<string, z.ZodTypeAny>;

      it('should validate target logging monitoring via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
          {
            component: 'Logs',
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'Centralized logging',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target logging monitoring with single component via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target logging monitoring with comprehensive components via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: 'Business and technical metrics',
          },
          {
            component: 'Logs',
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'Centralized logging',
          },
          {
            component: 'Tracing',
            strategy: 'OpenTelemetry SDK will be used for distributed tracing.',
            notes: 'Performance monitoring',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should reject target logging monitoring with missing component via byId', () => {
        const invalidData = [
          {
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target logging monitoring with missing strategy via byId', () => {
        const invalidData = [
          {
            component: 'Metrics',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target logging monitoring with empty component via byId', () => {
        const invalidData = [
          {
            component: '',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject target logging monitoring with empty strategy via byId', () => {
        const invalidData = [
          {
            component: 'Metrics',
            strategy: '', // Empty string not allowed
            notes: '',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });

      it('should reject empty target logging monitoring array via byId', () => {
        expect(byId['5.2.2'].safeParse([]).success).toBe(false);
      });

      it('should validate target logging monitoring with optional notes via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            // notes is optional
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should validate target logging monitoring with detailed notes via byId', () => {
        const validData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: 'Enhanced metrics collection for task monitoring',
          },
        ];

        expect(byId['5.2.2'].safeParse(validData).success).toBe(true);
      });

      it('should reject target logging monitoring with mixed valid and invalid entries via byId', () => {
        const invalidData = [
          {
            component: 'Metrics',
            strategy: 'Prometheus endpoint `/metrics` will be exposed.',
            notes: '',
          },
          {
            // Missing component
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'Centralized logging',
          },
        ];

        expect(byId['5.2.2'].safeParse(invalidData).success).toBe(false);
      });
    });
  });
});
