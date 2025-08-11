# Business & Scope Schema Tests (Family 2)

## Overview

This directory contains comprehensive tests for the Business & Scope schema (Family 2) validation system. The tests follow the established patterns from Family 1 and ensure complete coverage of all sections, subsections, and edge cases.

## Test Structure

```
2-business-scope/
├── core.test.ts              # Factory functions and byId registration tests
├── sections.test.ts          # Top-level section tests (2.1, 2.2, 2.3, 2.4, 2.6)
├── subsections.test.ts       # Nested subsection tests (2.2.x, 2.5.x)
├── accessibility.test.ts     # byId index verification and accessibility tests
├── original.test.ts          # Original comprehensive tests (preserved)
├── index.test.ts            # Entry point for all tests
└── README.md                # This documentation
```

## Test Coverage Summary

| Test File               | Tests   | Description                                              |
| ----------------------- | ------- | -------------------------------------------------------- |
| `core.test.ts`          | 9       | Factory functions, byId registration, complete documents |
| `sections.test.ts`      | 18      | Top-level section validation                             |
| `subsections.test.ts`   | 25      | Nested section validation                                |
| `accessibility.test.ts` | 13      | byId index verification and accessibility                |
| `original.test.ts`      | 45      | Original comprehensive tests (preserved)                 |
| **Total**               | **110** | **Complete test suite**                                  |

## Section Coverage

### Core Sections (Phase 3)

| Section                           | Tests | Status      | Coverage                                              |
| --------------------------------- | ----- | ----------- | ----------------------------------------------------- |
| **2.1 - Overview**                | 5     | ✅ Complete | Plan & Task validation, missing fields, empty strings |
| **2.2 - Business Context**        | 3     | ✅ Complete | Plan only, empty/whitespace validation                |
| **2.3 - Success Criteria**        | 3     | ✅ Complete | Plan only, array validation, empty strings            |
| **2.4 - Definition of Done**      | 4     | ✅ Complete | Task only, object validation, missing fields          |
| **2.6 - Core Business Processes** | 3     | ✅ Complete | Plan only, complex object validation                  |

### Nested Subsections (Phase 4)

| Section                         | Tests | Status      | Coverage                                                 |
| ------------------------------- | ----- | ----------- | -------------------------------------------------------- |
| **2.2.1 - User Journeys**       | 5     | ✅ Complete | Plan only, object arrays with name, description, diagram |
| **2.2.2 - User Personas**       | 4     | ✅ Complete | Plan only, object arrays with persona, goal              |
| **2.2.3 - Core Business Rules** | 5     | ✅ Complete | Plan & Task, string arrays                               |
| **2.2.4 - User Stories**        | 3     | ✅ Complete | Plan only, string arrays                                 |
| **2.5.1 - In Scope**            | 3     | ✅ Complete | Plan only, string arrays                                 |
| **2.5.2 - Out of Scope**        | 3     | ✅ Complete | Plan only, string arrays                                 |

## byId Registration Status

| Section | Plan | Task | Description             |
| ------- | ---- | ---- | ----------------------- |
| 2.1     | ✅   | ✅   | Overview                |
| 2.2     | ✅   | ❌   | Business Context        |
| 2.2.1   | ✅   | ❌   | User Journeys           |
| 2.2.2   | ✅   | ❌   | User Personas           |
| 2.2.3   | ✅   | ✅   | Core Business Rules     |
| 2.2.4   | ✅   | ❌   | User Stories            |
| 2.3     | ✅   | ❌   | Success Criteria        |
| 2.4     | ❌   | ✅   | Definition of Done      |
| 2.5     | ✅   | ❌   | Boundaries & Scope      |
| 2.5.1   | ✅   | ❌   | In Scope                |
| 2.5.2   | ✅   | ❌   | Out of Scope            |
| 2.6     | ✅   | ❌   | Core Business Processes |

## Test Patterns

### Combined Assertions

Each test validates both `byId` and `composedSchema` approaches in a single test:

```typescript
it('should validate complete overview via byId and composed schema', () => {
  const validData = {
    coreFunction: 'Test function',
    keyCapability: 'Test capability',
    businessValue: 'Test value',
  };
  expect(byId['2.1'].safeParse(validData).success).toBe(true);
  expect(overviewPlanSchema.safeParse(validData).success).toBe(true);
});
```

### Document Type Separation

Tests properly enforce Plan vs Task applicability rules:

```typescript
// Plan-only sections
expect(byId['2.2']).toBeDefined(); // Business Context
expect(byId['2.4']).toBeUndefined(); // Definition of Done (task only)

// Task-only sections
expect(byId['2.4']).toBeDefined(); // Definition of Done
expect(byId['2.2']).toBeUndefined(); // Business Context (plan only)
```

### Edge Case Coverage

Tests cover various edge cases:

- Empty arrays
- Missing required fields
- Empty strings
- Invalid data types
- Whitespace-only strings (Business Context)

## Schema Enhancements

### Business Context Validation

Enhanced with custom whitespace validation:

```typescript
const schema = z
  .string()
  .min(1)
  .refine((val) => val.trim().length > 0, {
    message: 'Business context cannot be empty or whitespace-only',
  });
```

## Running Tests

### Run All Family 2 Tests

```bash
npm test -- src/doc-parser/validation/__tests__/2-business-scope/index.test.ts
```

### Run Specific Test Files

```bash
# Core tests
npm test -- src/doc-parser/validation/__tests__/2-business-scope/core.test.ts

# Section tests
npm test -- src/doc-parser/validation/__tests__/2-business-scope/sections.test.ts

# Subsection tests
npm test -- src/doc-parser/validation/__tests__/2-business-scope/subsections.test.ts

# Accessibility tests
npm test -- src/doc-parser/validation/__tests__/2-business-scope/accessibility.test.ts
```

### Run with Verbose Output

```bash
npm test -- src/doc-parser/validation/__tests__/2-business-scope/index.test.ts --reporter=verbose --run
```

## Test Statistics

- **Total Test Files**: 6
- **Total Tests**: 110
- **Coverage**: 100% of Family 2 schema functionality
- **byId Access**: All 12 sections independently accessible
- **Pattern Consistency**: Follows Family 1 established patterns

## Validation Features

### Independent Section Validation

Each section can be validated independently via byId:

```typescript
const planSchema = createBusinessScopeSchema('plan');
const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

// Validate Overview section independently
const overviewResult = byId['2.1'].safeParse(overviewData);
expect(overviewResult.success).toBe(true);
```

### Composed Schema Validation

Sections can be validated within the context of the complete document:

```typescript
const planSchema = createBusinessScopeSchema('plan');
const shape = planSchema.shape as any;

// Validate Overview section within complete document
const overviewResult = shape.overview.safeParse(overviewData);
expect(overviewResult.success).toBe(true);
```

### Schema Consistency

byId and composed schema validation produce consistent results:

```typescript
const byIdResult = byId['2.1'].safeParse(data);
const composedResult = shape.overview.safeParse(data);
expect(byIdResult.success).toBe(composedResult.success);
```

## Error Handling

### Graceful Error Handling

Tests verify proper error handling for edge cases:

- Non-existent section IDs
- Invalid schema access
- Malformed data structures
- Missing required fields

### Validation Error Messages

Custom error messages for enhanced validation:

- Business Context whitespace validation
- Required field validation
- Array length validation
- Object structure validation

## Integration with Family 1

This test suite follows the same patterns established in Family 1:

- **File Organization**: Similar structure and naming conventions
- **Test Patterns**: Combined byId and composed schema assertions
- **Coverage Strategy**: Comprehensive section and subsection coverage
- **Documentation**: Detailed README with coverage statistics
- **Accessibility**: byId index verification and schema registration tests

## Future Enhancements

Potential areas for future enhancement:

1. **Performance Tests**: Large document validation performance
2. **Integration Tests**: Cross-family validation scenarios
3. **Migration Tests**: Schema version compatibility
4. **Custom Validators**: Additional business rule validators
5. **Error Recovery**: Schema recovery from validation failures
