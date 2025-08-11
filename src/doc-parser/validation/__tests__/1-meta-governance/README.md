# Family 1: Meta & Governance Schema Tests

This directory contains comprehensive tests for the Meta & Governance schema family (Family 1), which validates the structure and content of Meta & Governance documents in the DDD documentation system.

## Overview

Family 1 consists of two main sections:

- **1.2 Status** - Document status information (Plan vs Task specific)
- **1.3 Priority Drivers** - Array of priority drivers that motivate the document

## Test Structure

### Core Tests (`core.test.ts`)

- **Factory Function Tests**: Validates schema creation and byId registration
- **Convenience Functions**: Tests helper functions for plan/task schema access
- **Complete Document Validation**: End-to-end validation of full documents

### Section Tests (`sections.test.ts`)

- **Plan-Specific Section Tests**: Validates sections in plan document context
- **Task-Specific Section Tests**: Validates sections in task document context
- **byId and Composed Schema Validation**: Tests both access patterns

### Status Section Tests (`status.test.ts`)

- **Status Section as a Whole**: Complete status validation for plan and task
- **Document Type Applicability**: Plan vs Task field requirements
- **Field-Level Validation Context**: Individual field validation within status context

### Priority Drivers Section Tests (`priority-drivers.test.ts`)

- **Priority Drivers Section as a Whole**: Complete array validation for plan and task
- **Individual Driver Validation**: Valid and invalid PriorityDriver enum values
- **Array Validation**: Structure, length, and type validation
- **Document Type Applicability**: Consistent validation rules for plan and task
- **Integration with Complete Document**: Full document validation scenarios

### Field Tests (`fields.test.ts`)

- **Status Section Field Tests**: Granular validation of individual fields
- **Plan Fields**: Created and lastUpdated field validation
- **Task Fields**: All task-specific fields (currentState, priority, progress, etc.)

### Accessibility Tests (`accessibility.test.ts`)

- **byId Index Completeness**: Verifies all sections are properly registered
- **Schema Registration Verification**: Ensures sections are accessible via byId
- **Independent Section Validation**: Tests sections in isolation
- **Schema Consistency Verification**: byId vs composed schema consistency
- **Error Handling and Edge Cases**: Non-existent IDs and integrity checks

### Original Tests (`original.test.ts`)

- **Legacy Tests**: Preserved original comprehensive test suite for reference
- **Factory Function Tests**: Original schema creation tests
- **Individual Section Tests**: Original section-level validation
- **Complete Family Validation**: Original end-to-end tests

## Test Coverage

### Status Section (1.2)

- ✅ **Plan Status**: `created`, `lastUpdated` fields only
- ✅ **Task Status**: All fields including optional ones
- ✅ **Field Validation**: Individual field validation within context
- ✅ **Document Type Separation**: Clear Plan vs Task requirements
- ✅ **Error Scenarios**: Missing fields, invalid values, wrong document types

### Priority Drivers Section (1.3)

- ✅ **Array Validation**: Structure, length, and type constraints
- ✅ **Individual Driver Validation**: All PriorityDriver enum values
- ✅ **Invalid Format Rejection**: Missing prefixes, wrong separators, special characters
- ✅ **Document Type Consistency**: Same validation rules for Plan and Task
- ✅ **Integration Testing**: Complete document validation scenarios

### byId Index

- ✅ **Complete Registration**: Both sections (1.2, 1.3) properly registered
- ✅ **Independent Access**: Sections accessible independently via byId
- ✅ **Consistency**: byId and composed schema produce same results
- ✅ **Document Type Awareness**: byId schemas respect Plan vs Task differences

## Valid PriorityDriver Values

The following PriorityDriver enum values are tested:

### Core-Business Process (CBP)

- `CBP-Break_Block_Revenue_Legal`
- `CBP-SLA_Breach`
- `CBP-Partial_Degradation_KPI`
- `CBP-Incremental_Improvement`

### Security / Compliance (SEC)

- `SEC-Critical_Vulnerability`
- `SEC-Data_Leak`
- `SEC-Upcoming_Compliance`
- `SEC-Hardening_Low_Risk`

### User Experience (UX)

- `UX-Task_Abandonment`
- `UX-Severe_Usability`
- `UX-Noticeable_Friction`
- `UX-Cosmetic_Polish`

### Marketing / Growth (MKT)

- `MKT-Launch_Critical`
- `MKT-Brand_Risk`
- `MKT-Campaign_Optimisation`
- `MKT-Long_Tail_SEO`

### Technical Foundation / Infrastructure (TEC)

- `TEC-Prod_Stability_Blocker`
- `TEC-Dev_Productivity_Blocker`
- `TEC-Dev_Productivity_Enhancement`
- `TEC-Flaky_Test`
- `TEC-Tech_Debt_Refactor`

## Test Patterns

### byId and Composed Schema Testing

Each test validates both access patterns:

```typescript
it('should validate status via byId and composed schema', () => {
  const validData = {
    /* test data */
  };
  expect(byId['1.2'].safeParse(validData).success).toBe(true);
  expect(statusSchema.safeParse(validData).success).toBe(true);
});
```

### Document Type Separation

Tests ensure proper Plan vs Task field requirements:

```typescript
// Plan should only have created and lastUpdated
expect(planShape.created).toBeDefined();
expect(planShape.lastUpdated).toBeDefined();
expect(planShape.currentState).toBeUndefined();

// Task should have all fields
expect(taskShape.currentState).toBeDefined();
expect(taskShape.priority).toBeDefined();
```

### Array Validation

Priority Drivers tests include comprehensive array validation:

```typescript
// Structure validation
expect(byId['1.3'].safeParse(['TEC-Dev_Productivity_Enhancement']).success).toBe(true);
expect(byId['1.3'].safeParse('not-an-array').success).toBe(false);

// Length validation
expect(byId['1.3'].safeParse([]).success).toBe(false); // Empty array rejected
```

## Running Tests

### Run All Family 1 Tests

```bash
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/index.test.ts
```

### Run Specific Test Files

```bash
# Core tests only
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/core.test.ts

# Status section tests only
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/status.test.ts

# Priority Drivers tests only
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/priority-drivers.test.ts

# Accessibility tests only
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/accessibility.test.ts
```

### Run with Verbose Output

```bash
npm test -- src/doc-parser/validation/__tests__/1-meta-governance/index.test.ts --reporter=verbose
```

## Test Statistics

- **Total Tests**: 168 tests
- **Test Files**: 7 files
- **Coverage**: 100% of Family 1 schema functionality
- **Test Categories**: 6 comprehensive test suites

### Test Breakdown

- **Core Tests**: 11 tests
- **Section Tests**: 24 tests
- **Status Section Tests**: 25 tests
- **Priority Drivers Section Tests**: 44 tests
- **Field Tests**: 28 tests
- **Accessibility Tests**: 13 tests
- **Original Tests**: 23 tests

## Architecture

The test suite follows the established patterns from Family 4 (High-Level Design):

- **Organized folder structure** with focused test files
- **byId and composed schema validation** for each section
- **Document type separation** (Plan vs Task)
- **Comprehensive error scenarios** and edge cases
- **Independent section validation** via byId access
- **Integration testing** with complete documents

This ensures consistent validation patterns across all schema families in the DDD documentation system.
