# Family 5: Maintenance & Monitoring - Test Documentation

## Overview

This document provides comprehensive documentation for the test suite covering Family 5: Maintenance & Monitoring schema validation. The tests ensure proper validation of maintenance and monitoring configurations for both Plan and Task document types.

## Test Structure

### Test Files Organization

```
src/doc-parser/validation/__tests__/5-maintenance-monitoring/
├── core.test.ts              # Core schema factory and convenience function tests
├── sections.test.ts          # Top-level section validation tests
├── subsections.test.ts       # Nested subsection validation tests
├── accessibility.test.ts     # byId index and accessibility verification
├── original.test.ts          # Original comprehensive tests (for reference)
├── index.test.ts            # Entry point for all tests
└── README.md                # This documentation file
```

## Test Coverage Summary

### Total Tests: 136 tests

- **Core Tests**: 8 tests
- **Section Tests**: 28 tests (14 for Current, 14 for Target)
- **Subsection Tests**: 67 tests (30 for Current, 37 for Target)
- **Accessibility Tests**: 13 tests
- **Original Tests**: 20 tests

### byId Index Registration

#### Plan Schema (6 sections)

- `5.1` - Current Maintenance and Monitoring (ZodObject)
- `5.2` - Target Maintenance and Monitoring (ZodObject)
- `5.1.1` - Current Error Handling (ZodArray)
- `5.1.2` - Current Logging & Monitoring (ZodArray)
- `5.2.1` - Target Error Handling (ZodArray)
- `5.2.2` - Target Logging & Monitoring (ZodArray)

#### Task Schema (3 sections)

- `5.2` - Target Maintenance and Monitoring (ZodObject)
- `5.2.1` - Target Error Handling (ZodArray)
- `5.2.2` - Target Logging & Monitoring (ZodArray)

## Detailed Test Coverage

### 1. Core Tests (`core.test.ts`)

#### Factory Function Tests

- **Schema Creation**: Verifies `createMaintenanceMonitoringSchema` creates valid schemas
- **byId Registration**: Ensures all sections are properly registered in byId index
- **Document Validation**: Tests complete document validation for both Plan and Task
- **Convenience Functions**: Tests `getMaintenanceMonitoringPlanSchema` and `getMaintenanceMonitoringTaskSchema`

#### byId Index Verification

- **Independent Validation**: Tests that sections can be validated independently via byId
- **Error Handling**: Verifies proper rejection of invalid data via byId

### 2. Section Tests (`sections.test.ts`)

#### Current Maintenance and Monitoring Section (5.1) - Plan Only

- **Valid Scenarios**: Basic validation, multiple error scenarios
- **Missing Fields**: Error handling, logging monitoring
- **Empty Arrays**: Error handling, logging monitoring
- **Invalid Structure**: Error handling structure, logging monitoring structure

#### Target Maintenance and Monitoring Section (5.2) - Plan and Task

- **Plan Tests**: 7 comprehensive tests covering all validation scenarios
- **Task Tests**: 7 comprehensive tests covering all validation scenarios
- **Mixed Scenarios**: Valid and invalid entries combinations

### 3. Subsection Tests (`subsections.test.ts`)

#### Current Error Handling Section (5.1.1) - Plan Only

- **Valid Scenarios**: Single error, multiple errors, complex scenarios
- **Missing Fields**: ID, error type, trigger, action, user feedback
- **Empty Values**: Empty strings, empty arrays
- **Mixed Validation**: Valid and invalid entries combinations

#### Current Logging & Monitoring Section (5.1.2) - Plan Only

- **Valid Scenarios**: Single component, multiple components, complex scenarios
- **Missing Fields**: Component, strategy
- **Empty Values**: Empty strings, empty arrays
- **Optional Notes**: With and without notes, detailed notes

#### Target Error Handling Section (5.2.1) - Plan and Task

- **Plan Tests**: 12 comprehensive tests covering all validation scenarios
- **Task Tests**: 12 comprehensive tests covering all validation scenarios
- **Complex Scenarios**: Multiple error types including Database Error

#### Target Logging & Monitoring Section (5.2.2) - Plan and Task

- **Plan Tests**: 11 comprehensive tests covering all validation scenarios
- **Task Tests**: 11 comprehensive tests covering all validation scenarios
- **Comprehensive Components**: Metrics, Logs, Tracing, Alerts

### 4. Accessibility Tests (`accessibility.test.ts`)

#### byId Index Completeness

- **Plan Registration**: Verifies all 6 sections are registered
- **Task Registration**: Verifies all 3 sections are registered
- **Document Type Separation**: Ensures plan-only sections are omitted from task

#### Schema Registration Verification

- **Schema Types**: Verifies correct Zod types (ZodObject, ZodArray)
- **Type Consistency**: Ensures consistent types across document types

#### Independent Section Validation

- **Plan Sections**: Tests independent validation of all plan sections
- **Task Sections**: Tests independent validation of all task sections

#### Schema Consistency Verification

- **byId vs Composed**: Ensures consistent validation between byId and composed schema
- **Cross-Validation**: Verifies both validation methods produce same results

#### Error Handling and Edge Cases

- **Non-existent IDs**: Graceful handling of invalid section IDs
- **Invalid Schema Access**: Proper error handling for invalid schema access
- **Schema Validation**: Ensures byId schemas are actual Zod schemas

## Document Type Applicability

### Plan Document Type

- **Current Maintenance (5.1)**: Required
- **Target Maintenance (5.2)**: Required
- **Current Error Handling (5.1.1)**: Required
- **Current Logging & Monitoring (5.1.2)**: Required
- **Target Error Handling (5.2.1)**: Required
- **Target Logging & Monitoring (5.2.2)**: Required

### Task Document Type

- **Current Maintenance (5.1)**: Omitted
- **Target Maintenance (5.2)**: Required
- **Current Error Handling (5.1.1)**: Omitted
- **Current Logging & Monitoring (5.1.2)**: Omitted
- **Target Error Handling (5.2.1)**: Required
- **Target Logging & Monitoring (5.2.2)**: Required

## Schema Structure

### Error Handling Schema

```typescript
{
  id: string,           // Required: Unique error identifier
  errorType: string,    // Required: Type of error
  trigger: string,      // Required: What triggers this error
  action: string,       // Required: Action to take when error occurs
  userFeedback: string  // Required: User-facing error message
}
```

### Logging & Monitoring Schema

```typescript
{
  component: string,    // Required: Component being monitored
  strategy: string,     // Required: Monitoring strategy
  notes?: string        // Optional: Additional notes
}
```

### Container Schema

```typescript
{
  errorHandling: ErrorHandlingSchema[],      // Required: Array of error handling configs
  loggingMonitoring: LoggingMonitoringSchema[] // Required: Array of monitoring configs
}
```

## Validation Rules

### Required Fields

- All error handling entries must have: `id`, `errorType`, `trigger`, `action`, `userFeedback`
- All logging monitoring entries must have: `component`, `strategy`
- Container sections must have both `errorHandling` and `loggingMonitoring` arrays

### Array Validation

- Error handling arrays cannot be empty
- Logging monitoring arrays cannot be empty
- Arrays must contain at least one valid entry

### String Validation

- All required string fields must be non-empty
- Empty strings are rejected for required fields
- Optional fields (like `notes`) can be omitted

### Document Type Validation

- Plan documents include both current and target sections
- Task documents only include target sections
- Current sections are omitted from task documents

## Test Patterns

### byId Validation Pattern

```typescript
const schema = createMaintenanceMonitoringSchema('plan');
const byId = (schema as any).__byId as Record<string, z.ZodTypeAny>;

// Test individual section validation
expect(byId['5.1.1'].safeParse(validData).success).toBe(true);
```

### Composed Schema Validation Pattern

```typescript
const schema = createMaintenanceMonitoringSchema('plan');
const shape = schema.shape as any;

// Test section within parent context
expect(shape.currentMaintenanceAndMonitoring.safeParse(validData).success).toBe(true);
```

### Combined Validation Pattern

```typescript
// Test both byId and composed schema for consistency
expect(byId['5.2.1'].safeParse(validData).success).toBe(true);
expect(shape.targetMaintenanceAndMonitoring.shape.errorHandling.safeParse(validData).success).toBe(true);
```

## Integration with Other Families

### Consistency Patterns

- **byId Registration**: Consistent with Family 1 and 2 patterns
- **Document Type Applicability**: Follows established rules
- **Schema Factory Pattern**: Uses same factory function approach
- **Error Handling**: Consistent validation error patterns

### Cross-Family Validation

- **Schema Registration**: All families use same byId index pattern
- **Independent Validation**: All sections can be validated independently
- **Composed Validation**: All sections work within parent context
- **Type Safety**: All schemas are properly typed Zod schemas

## Running Tests

### Run All Family 5 Tests

```bash
npm test -- src/doc-parser/validation/__tests__/5-maintenance-monitoring/index.test.ts
```

### Run Specific Test Categories

```bash
# Core tests only
npm test -- src/doc-parser/validation/__tests__/5-maintenance-monitoring/core.test.ts

# Section tests only
npm test -- src/doc-parser/validation/__tests__/5-maintenance-monitoring/sections.test.ts

# Subsection tests only
npm test -- src/doc-parser/validation/__tests__/5-maintenance-monitoring/subsections.test.ts

# Accessibility tests only
npm test -- src/doc-parser/validation/__tests__/5-maintenance-monitoring/accessibility.test.ts
```

### Run Cross-Family Tests

```bash
# All completed families (1, 2, 5)
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/index.test.ts src/doc-parser/validation/__tests__/2-business-scope/index.test.ts src/doc-parser/validation/__tests__/5-maintenance-monitoring/index.test.ts
```

## Maintenance Notes

### Adding New Tests

1. Follow established patterns in existing test files
2. Include both byId and composed schema validation
3. Test both valid and invalid scenarios
4. Ensure document type applicability is tested
5. Add tests to appropriate test file based on scope

### Updating Schema

1. Update corresponding test data in test files
2. Ensure all validation rules are tested
3. Verify byId registration still works
4. Run full test suite to check for regressions

### Debugging Test Failures

1. Check byId registration in accessibility tests
2. Verify schema factory functions in core tests
3. Test individual sections in subsection tests
4. Validate document type applicability
5. Ensure consistent validation between byId and composed schema

## Conclusion

The Family 5 test suite provides comprehensive coverage of Maintenance & Monitoring schema validation, ensuring:

- **Complete Coverage**: All sections and subsections are tested
- **Document Type Support**: Both Plan and Task document types are validated
- **Independent Validation**: All sections can be validated independently via byId
- **Composed Validation**: All sections work correctly within parent context
- **Error Handling**: Comprehensive validation of all required fields and edge cases
- **Consistency**: Follows established patterns from other families
- **Maintainability**: Well-organized test structure for easy maintenance

The test suite serves as a reliable foundation for validating Maintenance & Monitoring documents in the DDD documentation system.
