# Implementation Guidance Schema Tests (Family 6)

## Overview

This directory contains comprehensive tests for the Implementation Guidance schema (Family 6), which handles practical implementation steps, logs, and LLM prompts for both plans and tasks.

## Test Structure

### Test Files

| File                      | Purpose                                   | Tests |
| ------------------------- | ----------------------------------------- | ----- |
| `core.test.ts`            | Core schema factory and byId registration | 9     |
| `sections.test.ts`        | Top-level section validation              | 51    |
| `complex-objects.test.ts` | Detailed object validation                | 46    |
| `integration.test.ts`     | Integration and cross-family consistency  | 14    |
| `accessibility.test.ts`   | byId index verification and accessibility | 13    |
| `original.test.ts`        | Original comprehensive tests (preserved)  | 28    |
| `index.test.ts`           | Entry point that imports all tests        | -     |

**Total Tests: 162**

## Schema Sections

### 6.1 - Implementation Plan (Plan Only)

- **Purpose**: Defines phased rollout strategy for child Plans/Tasks
- **Structure**: Array of strings (Markdown list)
- **Validation**: Non-empty strings, minimum 1 item
- **Applicability**: Plan required, Task omitted

### 6.1 - Implementation Log/Steps (Task Only)

- **Purpose**: Detailed step-by-step execution log for tasks
- **Structure**: Array of strings (Markdown list with checkboxes)
- **Validation**: Non-empty strings, minimum 1 item
- **Applicability**: Task required, Plan omitted

### 6.1.1 - Initial Situation (Task Only)

- **Purpose**: Baseline state before implementation begins
- **Structure**: String (text description)
- **Validation**: Non-empty, non-whitespace-only string
- **Applicability**: Task required, Plan omitted

### 6.1.2 - Files Change Log (Task Only)

- **Purpose**: File modifications tracking during implementation
- **Structure**: String (text description)
- **Validation**: Non-empty, non-whitespace-only string
- **Applicability**: Task required, Plan omitted

### 6.2 - Prompts (LLM reuse) (Plan & Task Optional)

- **Purpose**: Collection of prompts for LLM assistance
- **Structure**: Array of prompt objects
- **Fields**: description (required), code (required), language (optional)
- **Validation**: Non-empty arrays, valid prompt objects
- **Applicability**: Both Plan and Task optional

## Test Coverage

### Core Tests (9 tests)

- ✅ Schema factory function validation
- ✅ byId registration for plan and task schemas
- ✅ Complete document validation for both types
- ✅ Convenience function tests
- ✅ Independent section validation via byId
- ✅ Error handling for invalid data

### Section Tests (51 tests)

- ✅ **Implementation Plan (6.1)**: Plan only, Markdown list validation (8 tests)
  - Single item validation, various phase formats, empty string rejection, whitespace handling, non-string rejection, cross-schema verification
- ✅ **Implementation Log/Steps (6.1)**: Task only, Markdown list validation (8 tests)
  - Single item validation, various checkbox formats, no-checkbox format, empty string rejection, whitespace handling, non-string rejection, cross-schema verification
- ✅ **Initial Situation (6.1.1)**: Task only, text validation (9 tests)
  - Short description, multi-line text, technical details, empty text rejection, whitespace rejection, newline rejection, non-string rejection, cross-schema verification
- ✅ **Files Change Log (6.1.2)**: Task only, text validation (9 tests)
  - Short description, multi-line text, various file operations, file paths, empty text rejection, whitespace rejection, newline rejection, non-string rejection, cross-schema verification
- ✅ **Prompts (6.2)**: Both Plan and Task, object array validation (17 tests)
  - Single item validation, optional language handling, various programming languages, missing field rejection, empty field rejection, non-string rejection, cross-schema verification

### Complex Object Tests (46 tests)

- ✅ **Markdown List Validation (13 tests)**
  - Implementation plan and log steps validation, single item validation, various formats, checkbox formats, empty string rejection, whitespace handling, empty array rejection, non-string/null/undefined rejection
- ✅ **Text Content Validation (15 tests)**
  - Initial situation and files change log validation, short description, multi-line content, various file operations, file paths, empty text rejection, whitespace rejection, newline rejection, non-string/null/undefined rejection
- ✅ **Code Block Validation (18 tests)**

  - Prompt object validation, various programming languages, complex code blocks, optional language handling, missing field rejection, empty field rejection, multiple prompts validation, non-string/null/undefined rejection

- ✅ **Duplicate Section ID Handling (3 tests)**

  - Correct handling for plan (Implementation Plan)
  - Correct handling for task (Implementation Log/Steps)
  - Content type acceptance for both formats

### Integration Tests (14 tests)

- ✅ **byId Index Completeness Verification (3 tests)**

  - All plan sections registered
  - All task sections registered
  - Zod schema verification

- ✅ **Schema Registration Verification (2 tests)**

  - All sections accessible via byId
  - Task schema restrictions

- ✅ **Cross-Family Consistency Verification (4 tests)**

  - Same byId pattern as Family 1
  - Same byId pattern as Family 2
  - Same byId pattern as Family 3
  - Consistent schema structure

- ✅ **Complete Document Validation (4 tests)**

  - Complete plan document validation
  - Complete task document validation
  - Missing required sections rejection
  - Invalid sections rejection

- ✅ **Schema Factory Pattern Consistency (2 tests)**

  - Consistent factory pattern usage
  - Consistent error handling

### Accessibility Tests (13 tests)

- ✅ **byId Index Completeness (4 tests)**

  - All plan sections registered
  - All task sections registered
  - Task-only sections not in plan
  - Plan-only sections not in task

- ✅ **Schema Registration Verification (2 tests)**

  - Correct schema types for plan
  - Correct schema types for task

- ✅ **Independent Section Validation (2 tests)**

  - Plan sections independently accessible
  - Task sections independently accessible

- ✅ **Schema Consistency Verification (2 tests)**

  - Consistent validation between byId and composed schema for plan
  - Consistent validation between byId and composed schema for task

- ✅ **Error Handling and Edge Cases (3 tests)**

  - Non-existent section ID handling
  - Invalid schema handling
  - Duplicate section ID 6.1 handling

## Special Considerations

### Duplicate Section ID Handling

Family 6 has a unique challenge with duplicate section ID `6.1`:

- **Plan**: "Implementation Plan" (phased rollout strategy)
- **Task**: "Implementation Log/Steps" (step-by-step execution log)

The schema correctly handles this by:

1. **Name-based disambiguation**: Checking section name for "log" or "steps"
2. **Different content types**: Plan expects phase descriptions, Task expects checkbox items
3. **Proper byId registration**: Each document type gets the correct schema for section 6.1

### Content Format Validation

- **Markdown Lists**: Arrays of non-empty strings for implementation plans and logs
- **Text Content**: Non-empty, non-whitespace-only strings for situation and change logs
- **Code Blocks**: Objects with description, code, and optional language for LLM prompts

### Applicability Rules

| Section                            | Plan        | Task        | byId Registration |
| ---------------------------------- | ----------- | ----------- | ----------------- |
| **6.1 - Implementation Plan**      | ✅ Required | ❌ Omitted  | Plan only         |
| **6.1 - Implementation Log/Steps** | ❌ Omitted  | ✅ Required | Task only         |
| **6.1.1 - Initial Situation**      | ❌ Omitted  | ✅ Required | Task only         |
| **6.1.2 - Files Change Log**       | ❌ Omitted  | ✅ Required | Task only         |
| **6.2 - Prompts**                  | ✅ Optional | ✅ Optional | Both              |

## Usage Examples

### Plan Document Structure

```typescript
{
  implementationPlan: [
    'Phase 1: Set up project structure and basic configuration',
    'Phase 2: Implement core validation logic',
    'Phase 3: Add comprehensive test coverage',
    'Phase 4: Create integration tests and documentation'
  ],
  promptsLlmReuse: [
    {
      description: 'Generate a Vitest test for this function:',
      code: 'export const add = (a: number, b: number): number => a + b;',
      language: 'typescript'
    }
  ]
}
```

### Task Document Structure

```typescript
{
  implementationLogSteps: [
    '[x] Create `logger/types.ts` with core interfaces.',
    '[x] Implement `ConsoleTransport`.',
    '[ ] Implement `HttpTransport`.',
    '[ ] Write unit tests for transports.'
  ],
  initialSituation: 'The project currently has no validation system in place. All documentation is manually reviewed, which is error-prone and time-consuming.',
  filesChangeLog: 'Created new files: logger/types.ts, logger/transports.ts. Modified: package.json to add Zod dependency.',
  promptsLlmReuse: [
    {
      description: 'Generate a Vitest test for this function:',
      code: 'export const add = (a: number, b: number): number => a + b;',
      language: 'typescript'
    }
  ]
}
```

## Running Tests

```bash
# Run all Family 6 tests
npm test -- src/doc-parser/validation/__tests__/6-implementation-guidance/index.test.ts

# Run specific test file
npm test -- src/doc-parser/validation/__tests__/6-implementation-guidance/core.test.ts

# Run with verbose output
npm test -- src/doc-parser/validation/__tests__/6-implementation-guidance/index.test.ts --reporter=verbose
```

## Integration and Validation Summary

### Phase 5 Completion Status

✅ **All Phase 5 tasks completed successfully:**

| Task                                       | Status          | Details                               |
| ------------------------------------------ | --------------- | ------------------------------------- |
| **Run all tests**                          | ✅ **COMPLETE** | 162 tests passing with no regressions |
| **Verify byId index completeness**         | ✅ **COMPLETE** | All sections registered correctly     |
| **Test schema registration**               | ✅ **COMPLETE** | All sections properly accessible      |
| **Cross-family validation**                | ✅ **COMPLETE** | Consistent with established patterns  |
| **Handle duplicate section ID complexity** | ✅ **COMPLETE** | 6.1 sections properly disambiguated   |
| **Documentation update**                   | ✅ **COMPLETE** | Comprehensive test documentation      |

### byId Index Verification

**Plan Schema byId Index:**

- ✅ `6.1` - Implementation Plan (array of strings)
- ✅ `6.2` - Prompts (array of objects, optional)

**Task Schema byId Index:**

- ✅ `6.1` - Implementation Log/Steps (array of strings)
- ✅ `6.1.1` - Initial Situation (string)
- ✅ `6.1.2` - Files Change Log (string)
- ✅ `6.2` - Prompts (array of objects, optional)

### Cross-Family Consistency

✅ **Consistent with established patterns:**

- **Family 1 (Meta Governance)**: 2 sections (1.2, 1.3)
- **Family 2 (Business Scope)**: 6 sections (2.1-2.6)
- **Family 3 (Planning & Decomposition)**: 4 sections (3.1-3.4)
- **Family 6 (Implementation Guidance)**: 4 sections (6.1, 6.1.1, 6.1.2, 6.2)

### Schema Factory Pattern Consistency

✅ **All sections follow consistent factory pattern:**

- Individual factory functions for each section
- Proper byId registration
- Document type applicability handling
- Consistent error handling

### Duplicate Section ID Resolution

✅ **Section 6.1 properly handles both document types:**

- **Plan**: Implementation Plan (phase descriptions)
- **Task**: Implementation Log/Steps (checkbox items)
- **Validation**: Both content types accepted for same ID
- **Disambiguation**: Based on document type context

## Maintenance

- **Test Coverage**: All sections have comprehensive byId and composed schema validation
- **Cross-Family Consistency**: Follows established patterns from other families
- **Error Handling**: Robust validation of edge cases and invalid data
- **Documentation**: Comprehensive examples and usage patterns
