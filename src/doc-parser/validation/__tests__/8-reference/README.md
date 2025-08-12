# Family 8: Reference Schema Tests

## Overview

This directory contains comprehensive tests for the **Reference** family (Family 8) schema validation. The Reference family provides supplementary information that doesn't fit into other categories but is still relevant to the artifact.

## Family Structure

### **Family 8: Reference**

- **Primary Question**: "What other info might we need?"
- **Rationale**: Catch-all for supplementary information that doesn't fit into other categories
- **Applicability**: Optional for both Plan and Task document types

### **Sections**

- **8.1 Appendices/Glossary**: Optional section for glossaries, appendices, or links to external resources

## Test Structure

### **File Organization**

```
src/doc-parser/validation/__tests__/8-reference/
├── index.test.ts              # Entry point - imports all test files
├── core.test.ts               # Core schema factory and byId tests
├── sections.test.ts           # Top-level section tests
├── appendices-glossary.test.ts # Comprehensive field-level tests
├── accessibility.test.ts      # byId index and accessibility tests
├── original.test.ts           # Original comprehensive tests (preserved)
└── README.md                  # This documentation
```

### **Test Coverage Summary**

| Test File                     | Tests   | Description                                                        |
| ----------------------------- | ------- | ------------------------------------------------------------------ |
| `core.test.ts`                | 14      | Factory functions, byId registration, complete document validation |
| `sections.test.ts`            | 14      | Section-level validation for Plan and Task                         |
| `appendices-glossary.test.ts` | 45      | Comprehensive field-level validation                               |
| `accessibility.test.ts`       | 15      | byId index completeness and accessibility                          |
| `original.test.ts`            | 27      | Original comprehensive tests (preserved)                           |
| **Total**                     | **115** | **Complete test coverage**                                         |

## Schema Structure

### **Appendices/Glossary Schema (8.1)**

```typescript
const AppendicesGlossarySchema = z
  .object({
    glossary: z.array(GlossaryItemSchema).optional(),
    appendices: z.array(AppendixItemSchema).optional(),
  })
  .refine(
    (data) => {
      // If both fields are present, both must be non-empty
      // If only one field is present, it must be non-empty
      const hasGlossary = data.glossary !== undefined;
      const hasAppendices = data.appendices !== undefined;
      const hasValidGlossary = data.glossary && data.glossary.length > 0;
      const hasValidAppendices = data.appendices && data.appendices.length > 0;

      if (hasGlossary && hasAppendices) {
        return hasValidGlossary && hasValidAppendices;
      } else if (hasGlossary) {
        return hasValidGlossary;
      } else if (hasAppendices) {
        return hasValidAppendices;
      } else {
        return false;
      }
    },
    {
      message:
        'If both glossary and appendices are present, both must be non-empty. If only one is present, it must be non-empty.',
    }
  );
```

### **Glossary Item Schema**

```typescript
const GlossaryItemSchema = z.object({
  term: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Term cannot be empty or whitespace-only',
    }),
  definition: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Definition cannot be empty or whitespace-only',
    }),
});
```

### **Appendix Item Schema**

```typescript
const AppendixItemSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Title cannot be empty or whitespace-only',
    }),
  content: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, {
      message: 'Content cannot be empty or whitespace-only',
    }),
});
```

## Validation Rules

### **String Validation**

- All required string fields must be non-empty
- Whitespace-only strings are rejected
- Invalid types (numbers, etc.) are rejected

### **Array Validation**

- Empty arrays are rejected when no other valid field is present
- When both fields are present, both must be non-empty
- Mixed valid/invalid entries are rejected

### **Combination Validation**

- At least one field (glossary or appendices) must be present and non-empty
- If both fields are present, both must be non-empty
- Optional section can be omitted entirely

### **Document Type Applicability**

- **Plan**: Optional section, can be omitted
- **Task**: Optional section, can be omitted
- Both document types have identical validation rules

## byId Index Registration

### **Registered Sections**

- **8.1**: Appendices/Glossary (ZodOptional for both Plan and Task)

### **Independent Validation**

All sections can be validated independently via the `byId` index:

```typescript
const planSchema = createReferenceSchema('plan');
const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;

// Independent validation
const result = byId['8.1'].safeParse(validData);
```

## Detailed Test Coverage

### **Core Tests (`core.test.ts`)**

- **Factory Function Tests**: Schema creation, byId registration
- **Complete Document Validation**: Full document validation for Plan and Task
- **Convenience Functions**: `getReferencePlanSchema()`, `getReferenceTaskSchema()`
- **byId Index Verification**: Independent section validation

### **Section Tests (`sections.test.ts`)**

- **Appendices/Glossary Section (8.1)**: Plan and Task validation
- **Valid Scenarios**: Glossary only, appendices only, both present
- **Invalid Scenarios**: Empty arrays, missing fields, invalid combinations

### **Field-Level Tests (`appendices-glossary.test.ts`)**

#### **Glossary Validation (14 tests)**

- **Valid Entries**: Single, multiple, complex terms/definitions
- **Invalid Entries**: Missing fields, empty strings, whitespace-only, invalid types
- **Edge Cases**: Mixed valid/invalid entries, empty arrays

#### **Appendices Validation (14 tests)**

- **Valid Entries**: Single, multiple, complex titles/content
- **Invalid Entries**: Missing fields, empty strings, whitespace-only, invalid types
- **Edge Cases**: Mixed valid/invalid entries, empty arrays

#### **Combined Validation (7 tests)**

- **Valid Combinations**: Both present, only glossary, only appendices
- **Invalid Combinations**: Neither present, both empty, mixed empty/valid

#### **Document Type Applicability (10 tests)**

- **Plan Document**: All scenarios for plan documents
- **Task Document**: All scenarios for task documents
- **Optional Handling**: Undefined values and empty documents

### **Accessibility Tests (`accessibility.test.ts`)**

- **byId Index Completeness**: Verification of all registered sections
- **Schema Registration Verification**: Correct schema types and consistency
- **Independent Section Validation**: byId access for Plan and Task
- **Schema Consistency Verification**: byId vs composed schema consistency
- **Error Handling and Edge Cases**: Non-existent IDs, invalid schemas

## Test Patterns

### **Dual Validation Pattern**

All tests use both `byId` and `composed schema` validation:

```typescript
it('should validate via byId and composed schema', () => {
  const planSchema = createReferenceSchema('plan');
  const byId = (planSchema as any).__byId as Record<string, z.ZodTypeAny>;
  const shape = planSchema.shape as any;

  const validData = {
    /* test data */
  };

  expect(byId['8.1'].safeParse(validData).success).toBe(true);
  expect(shape.appendicesGlossary.safeParse(validData).success).toBe(true);
});
```

### **Document Type Testing**

Tests cover both Plan and Task document types with appropriate scenarios:

```typescript
describe('Plan Document Type', () => {
  // Plan-specific tests
});

describe('Task Document Type', () => {
  // Task-specific tests
});
```

### **Error Scenario Testing**

Comprehensive testing of invalid scenarios:

```typescript
it('should reject invalid data', () => {
  const invalidData = {
    /* invalid data */
  };
  expect(byId['8.1'].safeParse(invalidData).success).toBe(false);
});
```

## Integration with Other Families

### **Consistency with Established Patterns**

- **Factory Function Pattern**: Consistent with Families 1, 2, 4, 5
- **byId Registration**: Follows established byId index patterns
- **Test Organization**: Consistent folder structure and test categorization
- **Validation Logic**: Enhanced string validation with whitespace checking

### **Cross-Family Compatibility**

- **Schema Factory Pattern**: Compatible with other family schemas
- **Document Type Handling**: Consistent Plan/Task applicability
- **Error Handling**: Consistent error messages and validation behavior

## Running Tests

### **Run All Family 8 Tests**

```bash
npm test -- src/doc-parser/validation/__tests__/8-reference/index.test.ts
```

### **Run Specific Test Files**

```bash
# Core tests only
npm test -- src/doc-parser/validation/__tests__/8-reference/core.test.ts

# Field-level tests only
npm test -- src/doc-parser/validation/__tests__/8-reference/appendices-glossary.test.ts

# Accessibility tests only
npm test -- src/doc-parser/validation/__tests__/8-reference/accessibility.test.ts
```

### **Run with Verbose Output**

```bash
npm test -- src/doc-parser/validation/__tests__/8-reference/index.test.ts --reporter=verbose
```

## Maintenance Notes

### **Schema Updates**

When updating the Reference schema:

1. Update `src/doc-parser/validation/8-reference.schema.ts`
2. Run all tests to ensure no regressions
3. Update this documentation if schema structure changes

### **Test Maintenance**

- **Adding New Tests**: Follow established patterns in existing test files
- **Updating Tests**: Ensure both `byId` and `composed schema` validation are tested
- **Test Organization**: Keep tests organized by functionality and document type

### **Validation Rule Changes**

When modifying validation rules:

1. Update schema definition
2. Update corresponding tests
3. Verify cross-family compatibility
4. Update documentation

### **byId Index Changes**

When modifying byId registration:

1. Update factory functions
2. Update accessibility tests
3. Verify independent validation still works
4. Update documentation

## Key Features

### **Enhanced String Validation**

- Rejects whitespace-only strings
- Provides clear error messages
- Consistent across all string fields

### **Strict Combination Logic**

- Enforces proper field combination rules
- Prevents empty arrays when other field is present
- Clear error messages for validation failures

### **Optional Section Handling**

- Properly handles optional sections for both Plan and Task
- Allows undefined values
- Maintains validation when section is present

### **Comprehensive Test Coverage**

- 115 total tests covering all scenarios
- Both valid and invalid cases
- Edge cases and error conditions
- Document type applicability

## Success Criteria

✅ **All 115 tests passing**  
✅ **byId index working correctly**  
✅ **Consistent with other families**  
✅ **Complete documentation**  
✅ **Enhanced validation logic**  
✅ **Cross-family compatibility verified**  
✅ **Independent section validation functional**  
✅ **Optional section handling correct**

Family 8 Reference schema is now fully implemented with comprehensive test coverage and enhanced validation logic.

