import { describe, it, expect } from 'vitest';
import {
  MaintenanceMonitoringFamilySchema,
  ErrorHandlingRowSchema,
  ErrorHandlingTableSchema,
  LoggingMonitoringSchema,
  CurrentMaintenanceMonitoringSchema,
  TargetMaintenanceMonitoringSchema,
} from '../5-maintenance-monitoring.schema.js';

describe('Maintenance & Monitoring Schema Validation', () => {
  describe('Error Handling Row Schema', () => {
    it('should validate a complete error handling row', () => {
      const validErrorRow = {
        errorType: 'File System Error',
        trigger: 'Cannot read a required file or directory.',
        action: 'Abort with exit code 1.',
        userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
      };

      const result = ErrorHandlingRowSchema.safeParse(validErrorRow);
      expect(result.success).toBe(true);
    });

    it('should reject error handling row with missing error type', () => {
      const invalidErrorRow = {
        trigger: 'Cannot read a required file or directory.',
        action: 'Abort with exit code 1.',
        userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
      };

      const result = ErrorHandlingRowSchema.safeParse(invalidErrorRow);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('errorType');
      }
    });

    it('should reject error handling row with empty strings', () => {
      const invalidErrorRow = {
        errorType: '',
        trigger: 'Cannot read a required file or directory.',
        action: 'Abort with exit code 1.',
        userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
      };

      const result = ErrorHandlingRowSchema.safeParse(invalidErrorRow);
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
          errorType: 'File System Error',
          trigger: 'Cannot read a required file or directory.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
        },
        {
          errorType: 'Schema Validation Error',
          trigger: 'A document violates the canonical schema.',
          action: 'Abort with exit code 1.',
          userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
        },
      ];

      const result = ErrorHandlingTableSchema.safeParse(validErrorTable);
      expect(result.success).toBe(true);
    });

    it('should reject empty error handling table', () => {
      const result = ErrorHandlingTableSchema.safeParse([]);
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

      const result = ErrorHandlingTableSchema.safeParse(invalidErrorTable);
      expect(result.success).toBe(false);
    });
  });

  describe('Logging & Monitoring Schema', () => {
    it('should validate logging monitoring as list', () => {
      const validLoggingList = [
        'Metrics: Prometheus endpoint /metrics will be exposed.',
        'Logs: Structured JSON logs sent to stdout for collection by Fluentd.',
        'Tracing: OpenTelemetry SDK will be used for distributed tracing.',
      ];

      const result = LoggingMonitoringSchema.safeParse(validLoggingList);
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

      const result = LoggingMonitoringSchema.safeParse(validLoggingTable);
      expect(result.success).toBe(true);
    });

    it('should reject empty logging monitoring list', () => {
      const result = LoggingMonitoringSchema.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('should reject logging monitoring with empty strings', () => {
      const invalidLoggingList = [
        'Metrics: Prometheus endpoint /metrics will be exposed.',
        '', // Invalid empty string
        'Tracing: OpenTelemetry SDK will be used for distributed tracing.',
      ];

      const result = LoggingMonitoringSchema.safeParse(invalidLoggingList);
      expect(result.success).toBe(false);
    });
  });

  describe('Current Maintenance Monitoring Schema', () => {
    it('should validate current maintenance monitoring with all fields', () => {
      const validCurrentMonitoring = {
        errorHandling: 'Current error handling uses basic try-catch blocks.',
        loggingMonitoring: 'Current logging uses console.log statements.',
      };

      const result = CurrentMaintenanceMonitoringSchema.safeParse(validCurrentMonitoring);
      expect(result.success).toBe(true);
    });

    it('should validate current maintenance monitoring with optional fields', () => {
      const validCurrentMonitoring = {
        errorHandling: 'Current error handling uses basic try-catch blocks.',
      };

      const result = CurrentMaintenanceMonitoringSchema.safeParse(validCurrentMonitoring);
      expect(result.success).toBe(true);
    });

    it('should validate empty current maintenance monitoring', () => {
      const result = CurrentMaintenanceMonitoringSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should reject current maintenance monitoring with empty strings', () => {
      const invalidCurrentMonitoring = {
        errorHandling: '',
        loggingMonitoring: 'Current logging uses console.log statements.',
      };

      const result = CurrentMaintenanceMonitoringSchema.safeParse(invalidCurrentMonitoring);
      expect(result.success).toBe(false);
    });
  });

  describe('Target Maintenance Monitoring Schema', () => {
    it('should validate target maintenance monitoring', () => {
      const validTargetMonitoring = {
        errorHandling: [
          {
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ],
        loggingMonitoring: [
          'Metrics: Prometheus endpoint /metrics will be exposed.',
          'Logs: Structured JSON logs sent to stdout for collection by Fluentd.',
        ],
      };

      const result = TargetMaintenanceMonitoringSchema.safeParse(validTargetMonitoring);
      expect(result.success).toBe(true);
    });

    it('should reject target maintenance monitoring with missing error handling', () => {
      const invalidTargetMonitoring = {
        loggingMonitoring: [
          'Metrics: Prometheus endpoint /metrics will be exposed.',
          'Logs: Structured JSON logs sent to stdout for collection by Fluentd.',
        ],
      };

      const result = TargetMaintenanceMonitoringSchema.safeParse(invalidTargetMonitoring);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('errorHandling');
      }
    });

    it('should reject target maintenance monitoring with missing logging monitoring', () => {
      const invalidTargetMonitoring = {
        errorHandling: [
          {
            errorType: 'File System Error',
            trigger: 'Cannot read a required file or directory.',
            action: 'Abort with exit code 1.',
            userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
          },
        ],
      };

      const result = TargetMaintenanceMonitoringSchema.safeParse(invalidTargetMonitoring);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('loggingMonitoring');
      }
    });
  });

  describe('Maintenance Monitoring Schema (Complete Family)', () => {
    it('should validate a complete maintenance monitoring for a Plan', () => {
      const validPlanMaintenanceMonitoring = {
        current: {
          errorHandling: 'Current error handling uses basic try-catch blocks.',
          loggingMonitoring: 'Current logging uses console.log statements.',
        },
        target: {
          errorHandling: [
            {
              errorType: 'File System Error',
              trigger: 'Cannot read a required file or directory.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Cannot access [path]. Please check permissions.',
            },
          ],
          loggingMonitoring: [
            'Metrics: Prometheus endpoint /metrics will be exposed.',
            'Logs: Structured JSON logs sent to stdout for collection by Fluentd.',
          ],
        },
      };

      const result = MaintenanceMonitoringFamilySchema.safeParse(validPlanMaintenanceMonitoring);
      expect(result.success).toBe(true);
    });

    it('should validate a complete maintenance monitoring for a Task', () => {
      const validTaskMaintenanceMonitoring = {
        target: {
          errorHandling: [
            {
              errorType: 'Schema Validation Error',
              trigger: 'A document violates the canonical schema.',
              action: 'Abort with exit code 1.',
              userFeedback: 'ERROR: Schema validation failed in [file]: [validation_details].',
            },
          ],
          loggingMonitoring: ['Tracing: OpenTelemetry SDK will be used for distributed tracing.'],
        },
      };

      const result = MaintenanceMonitoringFamilySchema.safeParse(validTaskMaintenanceMonitoring);
      expect(result.success).toBe(true);
    });

    it('should reject maintenance monitoring with missing target', () => {
      const invalidMaintenanceMonitoring = {
        current: {
          errorHandling: 'Current error handling uses basic try-catch blocks.',
          loggingMonitoring: 'Current logging uses console.log statements.',
        },
      };

      const result = MaintenanceMonitoringFamilySchema.safeParse(invalidMaintenanceMonitoring);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('target');
      }
    });

    it('should reject maintenance monitoring with invalid target', () => {
      const invalidMaintenanceMonitoring = {
        target: {
          errorHandling: [], // Invalid empty array
          loggingMonitoring: ['Metrics: Prometheus endpoint /metrics will be exposed.'],
        },
      };

      const result = MaintenanceMonitoringFamilySchema.safeParse(invalidMaintenanceMonitoring);
      expect(result.success).toBe(false);
    });
  });
});
