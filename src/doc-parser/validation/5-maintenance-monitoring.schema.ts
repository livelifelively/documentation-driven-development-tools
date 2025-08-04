import { z } from 'zod';

// Error handling table row schema
const ErrorHandlingRowSchema = z.object({
  errorType: z.string().min(1),
  trigger: z.string().min(1),
  action: z.string().min(1),
  userFeedback: z.string().min(1),
});

// Error handling table schema
const ErrorHandlingTableSchema = z.array(ErrorHandlingRowSchema).min(1); // Require at least one error handling scenario

// Logging & Monitoring schema - can be list or table
const LoggingMonitoringSchema = z.union([
  // List format
  z.array(z.string().min(1)).min(1),
  // Table format (if needed in the future)
  z
    .array(
      z.object({
        component: z.string().min(1),
        strategy: z.string().min(1),
      })
    )
    .min(1),
]);

// Current Maintenance and Monitoring schema (for Plans only)
const CurrentMaintenanceMonitoringSchema = z.object({
  errorHandling: z.string().min(1).optional(), // Current error handling analysis
  loggingMonitoring: z.string().min(1).optional(), // Current observability analysis
});

// Target Maintenance and Monitoring schema
const TargetMaintenanceMonitoringSchema = z.object({
  errorHandling: ErrorHandlingTableSchema,
  loggingMonitoring: LoggingMonitoringSchema,
});

// Maintenance and Monitoring family schema
export const MaintenanceMonitoringFamilySchema = z.object({
  current: CurrentMaintenanceMonitoringSchema.optional(), // For Plans only
  target: TargetMaintenanceMonitoringSchema,
});

// Export individual schemas for specific use cases
export {
  ErrorHandlingRowSchema,
  ErrorHandlingTableSchema,
  LoggingMonitoringSchema,
  CurrentMaintenanceMonitoringSchema,
  TargetMaintenanceMonitoringSchema,
};

// Export types
export type MaintenanceMonitoringFamily = z.infer<typeof MaintenanceMonitoringFamilySchema>;
export type ErrorHandlingRow = z.infer<typeof ErrorHandlingRowSchema>;
export type ErrorHandlingTable = z.infer<typeof ErrorHandlingTableSchema>;
export type LoggingMonitoring = z.infer<typeof LoggingMonitoringSchema>;
export type CurrentMaintenanceMonitoring = z.infer<typeof CurrentMaintenanceMonitoringSchema>;
export type TargetMaintenanceMonitoring = z.infer<typeof TargetMaintenanceMonitoringSchema>;
