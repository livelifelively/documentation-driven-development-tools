import { describe, it, expect } from 'vitest';
import { createMaintenanceMonitoringSchema } from '../../5-maintenance-monitoring.schema.js';

describe('Maintenance & Monitoring Schema Validation', () => {
  describe('Error Handling Row Schema', () => {
    it('should validate a complete error handling row', () => {
      const validErrorRow = {
        id: 'ERROR-01',
        errorType: 'File System Error',
        trigger: 'Cannot read a required file or directory.',
        action: 'Abort with exit code 1.',
        userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
      };

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .errorHandling.element;
      const result = section.safeParse(validErrorRow);
      expect(result.success).toBe(true);
    });

    it('should reject error handling row with missing error type', () => {
      const invalidErrorRow = {
        id: 'ERROR-01',
        trigger: 'Cannot read a required file or directory.',
        action: 'Abort with exit code 1.',
        userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
      };

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .errorHandling.element;
      const result = section.safeParse(invalidErrorRow as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('errorType');
      }
    });

    it('should reject error handling row with empty strings', () => {
      const invalidErrorRow = {
        id: 'ERROR-01',
        errorType: '',
        trigger: 'Cannot read a required file or directory.',
        action: 'Abort with exit code 1.',
        userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
      };

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .errorHandling.element;
      const result = section.safeParse(invalidErrorRow as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('errorType');
      }
    });
  });

  describe('Error Handling Table Schema', () => {
    it('should validate a complete error handling table', () => {
      const validErrorTable = [
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

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .errorHandling;
      const result = section.safeParse(validErrorTable);
      expect(result.success).toBe(true);
    });

    it('should reject empty error handling table', () => {
      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .errorHandling;
      const result = section.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject error handling table with invalid row', () => {
      const invalidErrorTable = [
        {
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
        {
          errorType: '', // Invalid empty string
          trigger: 'A document violates the canonical schema.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
        },
      ];

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .errorHandling;
      const result = section.safeParse(invalidErrorTable as any);
      expect(result.success).toBe(false);
    });
  });

  describe('Logging & Monitoring Schema', () => {
    it('should validate logging monitoring as table', () => {
      const validLoggingTable = [
        { component: 'Metrics', strategy: 'Prometheus endpoint /metrics will be exposed.' },
        { component: 'Logs', strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.' },
        { component: 'Tracing', strategy: 'OpenTelemetry SDK will be used for distributed tracing.' },
      ];

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .loggingMonitoring;
      const result = section.safeParse(validLoggingTable);
      expect(result.success).toBe(true);
    });

    it('should validate logging monitoring as table', () => {
      const validLoggingTable = [
        {
          component: 'Metrics',
          strategy: 'Prometheus endpoint /metrics will be exposed.',
        },
        {
          component: 'Logs',
          strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
        },
      ];

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .loggingMonitoring;
      const result = section.safeParse(validLoggingTable);
      expect(result.success).toBe(true);
    });

    it('should reject empty logging monitoring list', () => {
      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .loggingMonitoring;
      const result = section.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject logging monitoring with empty strings', () => {
      const invalidLoggingList = [
        'Metrics: Prometheus endpoint /metrics will be exposed.',
        '', // Invalid empty string
        'Tracing: OpenTelemetry SDK will be used for distributed tracing.',
      ];

      const section = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring.shape
        .loggingMonitoring;
      const result = section.safeParse(invalidLoggingList as any);
      expect(result.success).toBe(false);
    });
  });

  describe('Current Maintenance Monitoring Schema', () => {
    it('should validate current maintenance monitoring with all fields', () => {
      const validCurrentMonitoring = {
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
          { component: 'Current Logging', strategy: 'Console output for errors and warnings', notes: '' },
          { component: 'Current Monitoring', strategy: 'No formal monitoring in place', notes: '' },
          { component: 'Current Metrics', strategy: 'No metrics collection implemented', notes: '' },
        ],
      };

      const current = (createMaintenanceMonitoringSchema('plan').shape as any).currentMaintenanceAndMonitoring;
      const result = current.safeParse(validCurrentMonitoring);
      expect(result.success).toBe(true);
    });

    it('should reject current maintenance monitoring when any required field is missing', () => {
      const invalidCurrentMonitoring = {
        errorHandling: [
          {
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ],
      };

      const current = (createMaintenanceMonitoringSchema('plan').shape as any).currentMaintenanceAndMonitoring;
      const result = current.safeParse(invalidCurrentMonitoring as any);
      expect(result.success).toBe(false);
    });

    it('should validate empty current maintenance monitoring', () => {
      const current = (createMaintenanceMonitoringSchema('plan').shape as any).currentMaintenanceAndMonitoring;
      const result = current.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject current maintenance monitoring with empty strings', () => {
      const invalidCurrentMonitoring = {
        errorHandling: [
          {
            errorType: '',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ],
        loggingMonitoring: ['Current Logging: Console output for errors and warnings', ''],
      };

      const current = (createMaintenanceMonitoringSchema('plan').shape as any).currentMaintenanceAndMonitoring;
      const result = current.safeParse(invalidCurrentMonitoring as any);
      expect(result.success).toBe(false);
    });
  });

  describe('Target Maintenance Monitoring Schema', () => {
    it('should validate target maintenance monitoring', () => {
      const validTargetMonitoring = {
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
          { component: 'Metrics', strategy: 'Prometheus endpoint /metrics will be exposed.', notes: 'N/A' },
          {
            component: 'Logs',
            strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
            notes: 'N/A',
          },
        ],
      };

      const target = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring;
      const result = target.safeParse(validTargetMonitoring);
      expect(result.success).toBe(true);
    });

    it('should reject target maintenance monitoring with missing error handling', () => {
      const invalidTargetMonitoring = {
        loggingMonitoring: [
          'Metrics: Prometheus endpoint /metrics will be exposed.',
          'Logs: Structured JSON logs sent to stdout for collection by Fluentd.',
        ],
      };

      const target = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring;
      const result = target.safeParse(invalidTargetMonitoring as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('errorHandling');
      }
    });

    it('should reject target maintenance monitoring with missing logging monitoring', () => {
      const invalidTargetMonitoring = {
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

      const target = (createMaintenanceMonitoringSchema('plan').shape as any).targetMaintenanceAndMonitoring;
      const result = target.safeParse(invalidTargetMonitoring as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('loggingMonitoring');
      }
    });
  });

  describe('Maintenance Monitoring Schema (Complete Family)', () => {
    it('should validate a complete maintenance monitoring for a Plan', () => {
      const validPlanMaintenanceMonitoring = {
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
            { component: 'Current Logging', strategy: 'Console output for errors and warnings', notes: 'N/A' },
            { component: 'Current Monitoring', strategy: 'No formal monitoring in place', notes: 'N/A' },
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
            { component: 'Metrics', strategy: 'Prometheus endpoint /metrics will be exposed.', notes: 'N/A' },
            {
              component: 'Logs',
              strategy: 'Structured JSON logs sent to stdout for collection by Fluentd.',
              notes: 'N/A',
            },
          ],
        },
      };

      const family = createMaintenanceMonitoringSchema('plan');
      const result = family.safeParse(validPlanMaintenanceMonitoring);
      expect(result.success).toBe(true);
    });

    it('should validate a complete maintenance monitoring for a Task', () => {
      const validTaskMaintenanceMonitoring = {
        targetMaintenanceAndMonitoring: {
          errorHandling: [
            {
              id: 'ERROR-01',
              errorType: 'Schema Validation Error',
              trigger: 'A document violates the canonical schema.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
            },
          ],
          loggingMonitoring: [
            { component: 'Tracing', strategy: 'OpenTelemetry SDK will be used for distributed tracing.', notes: '' },
          ],
        },
      };

      const family = createMaintenanceMonitoringSchema('task');
      const result = family.safeParse(validTaskMaintenanceMonitoring);
      expect(result.success).toBe(true);
    });

    it('should reject maintenance monitoring with missing target', () => {
      const invalidMaintenanceMonitoring = {
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
            { component: 'Current Logging', strategy: 'Console output for errors and warnings', notes: 'N/A' },
          ],
        },
      };

      const family = createMaintenanceMonitoringSchema('plan');
      const result = family.safeParse(invalidMaintenanceMonitoring as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('targetMaintenanceAndMonitoring');
      }
    });

    it('should reject maintenance monitoring with invalid target', () => {
      const invalidMaintenanceMonitoring = {
        target: {
          errorHandling: [], // Invalid empty array
          loggingMonitoring: ['Metrics: Prometheus endpoint /metrics will be exposed.'],
        },
      };

      const family = createMaintenanceMonitoringSchema('plan');
      const result = family.safeParse(invalidMaintenanceMonitoring as any);
      expect(result.success).toBe(false);
    });
  });
});
