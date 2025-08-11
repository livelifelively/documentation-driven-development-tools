# Family 3: Planning & Decomposition Schema Tests

## Overview

This directory contains comprehensive tests for the Planning & Decomposition schema (Family 3), which handles roadmap planning, backlog management, dependency tracking, and decomposition visualization.

## Test Structure

### Test Files

| File                      | Purpose                                   | Tests |
| ------------------------- | ----------------------------------------- | ----- |
| `core.test.ts`            | Core schema factory and byId registration | 9     |
| `sections.test.ts`        | Top-level section validation              | 15    |
| `complex-objects.test.ts` | Detailed object validation                | 27    |
| `integration.test.ts`     | Integration and cross-family consistency  | 14    |
| `accessibility.test.ts`   | byId index verification and accessibility | 13    |
| `original.test.ts`        | Original comprehensive tests (preserved)  | 49    |
| `index.test.ts`           | Entry point that imports all tests        | -     |

**Total Tests: 127**

## Schema Sections

### 3.1 - Roadmap (Plan Only)

- **Purpose**: Defines the roadmap of plans and tasks
- **Structure**: Array of roadmap items
- **Fields**: id, childPlanTask, priority, priorityDrivers, status, dependsOn (optional), summary
- **Validation**: Enum validation for priority, status, priorityDrivers

### 3.2 - Backlog (Plan Only)

- **Purpose**: Defines items in the backlog/icebox
- **Structure**: Array of backlog items
- **Fields**: name, reason
- **Validation**: Non-empty strings for both fields

### 3.3 - Dependencies (Plan & Task)

- **Purpose**: Tracks dependencies between plans/tasks
- **Structure**: Array of dependency items
- **Fields**: id, dependencyOn, type, status, affectedPlansTasks, notes
- **Validation**: Enum validation for type, status; non-empty arrays

### 3.4 - Decomposition Graph (Plan Only)

- **Purpose**: Visual decomposition of plans into tasks
- **Structure**: Mermaid graph diagram with optional text
- **Fields**: diagram (required), text (optional array)
- **Validation**: Graph diagram type only; diagram required

## Test Coverage

### Core Tests (9 tests)

- ✅ Schema factory function validation
- ✅ byId registration for plan and task schemas
- ✅ Complete document validation
- ✅ Convenience function tests
- ✅ Independent section validation via byId

### Section Tests (15 tests)

- ✅ **Roadmap (3.1)**: Plan only, complex object array validation
- ✅ **Backlog (3.2)**: Plan only, object array validation
- ✅ **Dependencies (3.3)**: Plan & Task, complex object array validation
- ✅ **Decomposition Graph (3.4)**: Plan only, Mermaid diagram validation

### Complex Object Tests (27 tests)

- ✅ **Roadmap Item Validation (7 tests)**

  - Complete object validation
  - Optional field handling (dependsOn)
  - Missing required fields rejection
  - Invalid enum value rejection
  - Empty array rejection

- ✅ **Dependency Item Validation (7 tests)**

  - Complete object validation
  - Type variations (External/Internal)
  - Missing required fields rejection
  - Invalid enum value rejection
  - Empty array rejection
  - Document type support (Plan/Task)

- ✅ **Backlog Item Validation (5 tests)**

  - Complete object validation
  - Missing field rejection
  - Empty string rejection

- ✅ **Mermaid Diagram Validation (8 tests)**
  - Diagram only validation
  - Text + diagram validation
  - Multiple text lines validation
  - Text only rejection
  - Wrong diagram type rejection
  - Empty graph rejection
  - Empty text array validation

### Integration Tests (14 tests)

- ✅ **byId Index Completeness Verification (3 tests)**

  - All 4 sections registered for plan
  - Only dependencies section for task
  - Zod schema verification

- ✅ **Schema Registration Verification (2 tests)**

  - All sections accessible via byId
  - Task schema restrictions

- ✅ **Cross-Family Consistency Verification (3 tests)**

  - Same byId pattern as Family 1
  - Same byId pattern as Family 2
  - Consistent schema structure

- ✅ **Complete Document Validation (4 tests)**

  - Complete plan document validation
  - Complete task document validation
  - Missing sections rejection
  - Invalid sections rejection

- ✅ **Schema Factory Pattern Consistency (2 tests)**
  - Consistent factory pattern
  - Consistent error handling

### Accessibility Tests (13 tests)

- ✅ **byId Index Completeness (4 tests)**

  - All plan sections registered
  - All task sections registered
  - Plan-only sections not in task
  - Task-only sections not in plan

- ✅ **Schema Registration Verification (2 tests)**

  - Correct types for plan
  - Correct types for task

- ✅ **Independent Section Validation (2 tests)**

  - Plan sections independently
  - Task sections independently

- ✅ **Schema Consistency Verification (2 tests)**

  - byId vs composed schema consistency for plan
  - byId vs composed schema consistency for task

- ✅ **Error Handling and Edge Cases (3 tests)**
  - Non-existent section IDs
  - Invalid schema access
  - Zod schema validation

## Document Type Applicability

| Section                   | Plan        | Task        | Notes               |
| ------------------------- | ----------- | ----------- | ------------------- |
| 3.1 - Roadmap             | ✅ Required | ❌ Omitted  | Plan-specific       |
| 3.2 - Backlog             | ✅ Required | ❌ Omitted  | Plan-specific       |
| 3.3 - Dependencies        | ✅ Required | ✅ Required | Both document types |
| 3.4 - Decomposition Graph | ✅ Required | ❌ Omitted  | Plan-specific       |

## byId Index Structure

### Plan Document

```typescript
{
  '3.1': RoadmapSchema,      // Array of roadmap items
  '3.2': BacklogSchema,      // Array of backlog items
  '3.3': DependenciesSchema, // Array of dependency items
  '3.4': DecompositionGraphSchema // Mermaid graph with optional text
}
```

### Task Document

```typescript
{
  '3.3': DependenciesSchema  // Array of dependency items only
}
```

## Validation Patterns

### byId + Composed Schema Pattern

All tests follow the established pattern of testing both:

1. **byId validation**: Direct section validation via `byId[sectionId].safeParse(data)`
2. **Composed schema validation**: Section validation within the full document context

### Enum Validation

- **PriorityLevel**: Low, Medium, High, Critical
- **StatusKey**: Not Started, In Progress, Blocked, Completed, Deferred, Cancelled
- **PriorityDriver**: CBP-_, SEC-_, UX-_, MKT-_, TEC-\* (from shared schema)
- **DependencyType**: External, Internal
- **DependencyStatus**: Blocked, In Progress, Complete, Pending

### Array Validation

- All arrays must have minimum length of 1
- Empty arrays are rejected
- Arrays must contain valid objects

### String Validation

- Non-empty strings required
- Empty strings are rejected
- Whitespace-only strings are rejected

## Cross-Family Consistency

Family 3 follows the same patterns established in Family 1 (Meta Governance) and Family 2 (Business Scope):

- ✅ **byId Index Pattern**: All sections registered with section IDs as keys
- ✅ **Factory Pattern**: Individual schema factories for each section
- ✅ **Applicability Rules**: Document type-specific section inclusion
- ✅ **Error Handling**: Consistent Zod error structure
- ✅ **Validation Approach**: byId + composed schema testing

## Running Tests

### Run All Tests

```bash
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/index.test.ts
```

### Run Specific Test Files

```bash
# Core tests only
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/core.test.ts

# Section tests only
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/sections.test.ts

# Complex object tests only
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/complex-objects.test.ts

# Integration tests only
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/integration.test.ts

# Accessibility tests only
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/accessibility.test.ts
```

### Run with Verbose Output

```bash
npm test -- src/doc-parser/validation/__tests__/3-planning-decomposition/index.test.ts --reporter=verbose
```

## Test Data Examples

### Valid Roadmap Item

```typescript
{
  id: 'P1',
  childPlanTask: '[Backend Plan](p1-backend.plan.md)',
  priority: 'High',
  priorityDrivers: ['CBP-Break_Block_Revenue_Legal'],
  status: 'Not Started',
  dependsOn: '—',
  summary: 'Core backend services and APIs.'
}
```

### Valid Dependency Item

```typescript
{
  id: 'D-1',
  dependencyOn: 'shared-ui-library v2.1+',
  type: 'External',
  status: 'Blocked',
  affectedPlansTasks: ['p1-frontend'],
  notes: 'Awaiting release from Platform team.'
}
```

### Valid Backlog Item

```typescript
{
  name: 'Reporting Plan',
  reason: 'Deferred to Q4 due to dependency on new analytics service.'
}
```

### Valid Decomposition Graph

```typescript
{
  diagram: `graph
subgraph Plan: User Authentication
        P1["Plan: Backend Auth"]
        T1["Task: Create UI form"]
    end
    P1 --> T1`,
  text: ['This diagram shows the decomposition of our authentication system.']
}
```

## Maintenance Notes

- All tests follow the established patterns from Family 1 and Family 2
- byId index completeness is verified in integration tests
- Cross-family consistency is maintained
- Original tests are preserved for backward compatibility
- Test data examples are realistic and comprehensive
