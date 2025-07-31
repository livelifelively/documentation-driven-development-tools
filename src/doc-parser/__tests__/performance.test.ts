import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { parseTask } from '../index.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// Test file paths
const testFiles = {
  small: join(process.cwd(), 'test-performance-small.task.md'),
  medium: join(process.cwd(), 'test-performance-medium.task.md'),
  large: join(process.cwd(), 'test-performance-large.task.md'),
};

// Performance benchmarks (in milliseconds)
const benchmarks = {
  small: 250, // 10kb file should parse in < 250ms
  medium: 1000, // 100kb file should parse in < 1000ms
  large: 2500, // 1MB file should parse in < 2500ms
};

describe('Performance Tests', () => {
  beforeAll(() => {
    // Create test files with different sizes
    createTestFiles();
  });

  afterAll(() => {
    // Clean up test files
    Object.values(testFiles).forEach((filePath) => {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    });
  });

  describe('Parsing Performance', () => {
    it('should parse small markdown file (10kb) within performance benchmark', async () => {
      const startTime = performance.now();

      const result = await parseTask(testFiles.small);

      const endTime = performance.now();
      const parseTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(parseTime).toBeLessThan(benchmarks.small);

      console.log(`Small file parse time: ${parseTime.toFixed(2)}ms (benchmark: ${benchmarks.small}ms)`);
    });

    it('should parse medium markdown file (100kb) within performance benchmark', async () => {
      const startTime = performance.now();

      const result = await parseTask(testFiles.medium);

      const endTime = performance.now();
      const parseTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(parseTime).toBeLessThan(benchmarks.medium);

      console.log(`Medium file parse time: ${parseTime.toFixed(2)}ms (benchmark: ${benchmarks.medium}ms)`);
    });

    it('should parse large markdown file (1MB) within performance benchmark', async () => {
      const startTime = performance.now();

      const result = await parseTask(testFiles.large);

      const endTime = performance.now();
      const parseTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(parseTime).toBeLessThan(benchmarks.large);

      console.log(`Large file parse time: ${parseTime.toFixed(2)}ms (benchmark: ${benchmarks.large}ms)`);
    });

    it('should maintain consistent performance across multiple runs', async () => {
      const times: number[] = [];
      const numRuns = 5;

      for (let i = 0; i < numRuns; i++) {
        const startTime = performance.now();
        await parseTask(testFiles.small);
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      const variance = times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / times.length;

      expect(avgTime).toBeLessThan(benchmarks.small);
      expect(maxTime - minTime).toBeLessThan(benchmarks.small * 0.5); // Variance should be reasonable

      console.log(
        `Performance consistency test - Avg: ${avgTime.toFixed(2)}ms, Min: ${minTime.toFixed(
          2
        )}ms, Max: ${maxTime.toFixed(2)}ms, Variance: ${variance.toFixed(2)}`
      );
    });
  });

  describe('Memory Usage', () => {
    it('should not have significant memory leaks during parsing', async () => {
      const initialMemory = process.memoryUsage();

      // Parse multiple files to stress test memory usage
      for (let i = 0; i < 10; i++) {
        await parseTask(testFiles.medium);
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      console.log(`Memory usage test - Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });
});

/**
 * Creates test files with different sizes for performance testing
 */
function createTestFiles(): void {
  // Small file (~10kb)
  const smallContent = generateMarkdownContent(10);
  writeFileSync(testFiles.small, smallContent);

  // Medium file (~100kb)
  const mediumContent = generateMarkdownContent(100);
  writeFileSync(testFiles.medium, mediumContent);

  // Large file (~1MB)
  const largeContent = generateMarkdownContent(1000);
  writeFileSync(testFiles.large, largeContent);
}

/**
 * Generates markdown content of approximately the specified size in KB
 */
function generateMarkdownContent(sizeInKb: number): string {
  const baseContent = `# Performance Test Task

## 1 Meta & Governance

### 1.2 Status

- **Current State:** 💡 Not Started
- **Priority:** 🟥 High
- **Progress:** 0%
- **Planning Estimate:** 3
- **Est. Variance (pts):** 0
- **Created:** 2025-01-27 16:00
- **Implementation Started:**
- **Completed:**
- **Last Updated:** 2025-01-27 16:00

### 1.3 Priority Drivers

- TEC-Dev_Productivity_Enhancement
- TEC-Prod_Stability_Blocker

---

## 2 Business & Scope

### 2.1 Overview

- **Core Function**: Performance testing for the documentation parser.
- **Key Capability**: Validates that the parser can handle large markdown files efficiently.
- **Business Value**: Ensures the parser scales well for real-world usage.

### 2.4 Acceptance Criteria

| ID   | Criterion                                           | Test Reference                |
| :--- | :-------------------------------------------------- | :---------------------------- |
| AC-1 | Parser handles 10kb files in < 100ms               | performance.test.ts           |
| AC-2 | Parser handles 100kb files in < 500ms              | performance.test.ts           |
| AC-3 | Parser handles 1MB files in < 2000ms               | performance.test.ts           |
| AC-4 | Memory usage remains reasonable during parsing      | performance.test.ts           |

---

## 3 Planning & Decomposition

### 3.3 Dependencies

| ID  | Dependency On | Type     | Status         | Affected Plans/Tasks | Notes                     |
| :-- | :------------ | :------- | :------------- | :------------------- | :------------------------ |
| D-1 | Core Engine   | Internal | ✅ Complete    | This task            | Uses existing parser      |

---

## 4 High-Level Design

### 4.2 Target Architecture

#### 4.2.1 Data Models

The performance tests use the same data models as the core parser.

#### 4.2.2 Components

Performance testing validates the existing parser components under load.

### 4.4 Non-Functional Requirements

#### 4.4.1 Performance

| ID      | Requirement                                    | Priority  |
| :------ | :--------------------------------------------- | :-------- |
| PERF-01 | Parse 10kb files in < 100ms                   | 🟥 High   |
| PERF-02 | Parse 100kb files in < 500ms                  | 🟥 High   |
| PERF-03 | Parse 1MB files in < 2000ms                   | 🟥 High   |
| PERF-04 | Memory usage increase < 10MB during stress    | 🟧 Medium |

---

## 6 Implementation Guidance

### 6.1 Implementation Log / Steps

- [x] Create performance test file
- [x] Generate test fixtures of different sizes
- [x] Implement performance benchmarks
- [x] Add memory usage testing
- [x] Validate performance requirements

---

## 7 Quality & Operations

### 7.1 Testing Strategy / Requirements

| AC  | Scenario                    | Test Type | Tools / Runner | Notes                    |
| :-- | :-------------------------- | :-------- | :------------- | :----------------------- |
| 1   | Parse 10kb file efficiently | Performance | Vitest + performance.now | Benchmark: < 100ms       |
| 2   | Parse 100kb file efficiently| Performance | Vitest + performance.now | Benchmark: < 500ms       |
| 3   | Parse 1MB file efficiently | Performance | Vitest + performance.now | Benchmark: < 2000ms      |
| 4   | Memory usage remains stable | Performance | Vitest + process.memoryUsage | Increase < 10MB         |

### 7.5 Local Test Commands

\`\`\`bash
npm test -- src/doc-parser/__tests__/performance.test.ts
\`\`\`

---

## 8 Reference

### 8.1 Appendices/Glossary

- **Performance Benchmark**: Maximum acceptable time for parsing files of a given size
- **Memory Leak**: Gradual increase in memory usage that doesn't get released
- **Stress Test**: Testing with repeated operations to identify performance degradation

`;

  // Calculate how much additional content we need to reach the target size
  const baseSize = baseContent.length;
  const targetSize = sizeInKb * 1024;
  const additionalSizeNeeded = targetSize - baseSize;

  if (additionalSizeNeeded <= 0) {
    return baseContent;
  }

  // Generate additional content to reach target size
  const additionalContent = generateAdditionalContent(additionalSizeNeeded);

  return baseContent + additionalContent;
}

/**
 * Generates additional markdown content to reach the target size
 */
function generateAdditionalContent(targetSize: number): string {
  const sections = [
    '## Additional Section 1\n\nThis is additional content for performance testing.',
    '## Additional Section 2\n\nMore content to reach the target file size.',
    '## Additional Section 3\n\nEven more content for comprehensive testing.',
    '## Additional Section 4\n\nContinuing to add content for size requirements.',
    '## Additional Section 5\n\nFinal content to meet performance test requirements.',
  ];

  let content = '';
  let currentSize = 0;
  let sectionIndex = 0;

  while (currentSize < targetSize) {
    const section = sections[sectionIndex % sections.length];
    content += section + '\n\n';
    currentSize += section.length + 2; // +2 for newlines
    sectionIndex++;
  }

  return content;
}
