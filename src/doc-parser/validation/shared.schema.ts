import { z } from 'zod';

// Shared enums for validation
export const StatusKey = z.enum(['Not Started', 'In Progress', 'Under Review', 'Complete', 'Blocked']);
export const PriorityLevel = z.enum(['High', 'Medium', 'Low']);
export const DependencyStatus = z.enum(['Complete', 'Blocked', 'In Progress']);
export const DependencyType = z.enum(['External', 'Internal']);
export const TestType = z.enum(['Unit', 'Integration', 'E2E', 'Performance', 'Security']);

// Shared types
export type StatusKey = z.infer<typeof StatusKey>;
export type PriorityLevel = z.infer<typeof PriorityLevel>;
export type DependencyStatus = z.infer<typeof DependencyStatus>;
export type DependencyType = z.infer<typeof DependencyType>;
export type TestType = z.infer<typeof TestType>;

// Shared validation helpers
export const NonEmptyString = z.string().min(1);
export const NonEmptyStringArray = z.array(NonEmptyString).min(1);

// Reusable date-time string schema for YYYY-MM-DD HH:MM format
export const DateTimeString = z.string().refine(
  (val) => {
    // Check format: YYYY-MM-DD HH:MM
    const parts = val.split(' ');
    if (parts.length !== 2) return false;

    const datePart = parts[0];
    const timePart = parts[1];

    // Date part: YYYY-MM-DD
    const dateParts = datePart.split('-');
    if (dateParts.length !== 3) return false;

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Time part: HH:MM
    const timeParts = timePart.split(':');
    if (timeParts.length !== 2) return false;

    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    if (isNaN(hour) || isNaN(minute)) return false;
    if (hour < 0 || hour > 23) return false;
    if (minute < 0 || minute > 59) return false;

    return true;
  },
  {
    message: "Date must be in format 'YYYY-MM-DD HH:MM'",
  }
);
