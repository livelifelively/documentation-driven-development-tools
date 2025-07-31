import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { parseTask } from '../index.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// Memory test file paths
const memoryTestFiles = {
  shallow: join(process.cwd(), 'test-memory-shallow.task.md'),
  deep: join(process.cwd(), 'test-memory-deep.task.md'),
  wide: join(process.cwd(), 'test-memory-wide.task.md'),
  mixed: join(process.cwd(), 'test-memory-mixed.task.md'),
};

// Memory usage limits (in MB)
const memoryLimits = {
  singleParse: 50, // Single parse should not exceed 50MB
  repeatedParse: 150, // Repeated parsing should not exceed 150MB
  deepAst: 200, // Deep AST parsing should not exceed 200MB
  stressTest: 150, // Stress test should not exceed 150MB
};

describe('Memory Tests', () => {
  beforeAll(() => {
    // Create memory-intensive test files
    createMemoryTestFiles();
  });

  afterAll(() => {
    // Clean up test files
    Object.values(memoryTestFiles).forEach((filePath) => {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    });
  });

  beforeEach(() => {
    // Force garbage collection before each test to get clean baseline
    if (global.gc) {
      global.gc();
    }
  });

  describe('Memory Usage Patterns', () => {
    it('should not exceed memory limit for shallow AST parsing', async () => {
      const initialMemory = process.memoryUsage();

      const result = await parseTask(memoryTestFiles.shallow);

      const finalMemory = process.memoryUsage();
      const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryUsedMB = memoryUsed / 1024 / 1024;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(memoryUsedMB).toBeLessThan(memoryLimits.singleParse);

      console.log(`Shallow AST memory usage: ${memoryUsedMB.toFixed(2)}MB (limit: ${memoryLimits.singleParse}MB)`);
    });

    it('should not exceed memory limit for deep AST parsing', async () => {
      const initialMemory = process.memoryUsage();

      const result = await parseTask(memoryTestFiles.deep);

      const finalMemory = process.memoryUsage();
      const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryUsedMB = memoryUsed / 1024 / 1024;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(memoryUsedMB).toBeLessThan(memoryLimits.deepAst);

      console.log(`Deep AST memory usage: ${memoryUsedMB.toFixed(2)}MB (limit: ${memoryLimits.deepAst}MB)`);
    });

    it('should not exceed memory limit for wide AST parsing', async () => {
      const initialMemory = process.memoryUsage();

      const result = await parseTask(memoryTestFiles.wide);

      const finalMemory = process.memoryUsage();
      const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryUsedMB = memoryUsed / 1024 / 1024;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(memoryUsedMB).toBeLessThan(memoryLimits.deepAst);

      console.log(`Wide AST memory usage: ${memoryUsedMB.toFixed(2)}MB (limit: ${memoryLimits.deepAst}MB)`);
    });
  });

  describe('Memory Leak Detection', () => {
    it('should not have memory leaks during repeated parsing', async () => {
      const initialMemory = process.memoryUsage();
      const memorySnapshots: number[] = [];

      // Parse the same file multiple times to detect memory leaks
      for (let i = 0; i < 20; i++) {
        const beforeMemory = process.memoryUsage();

        await parseTask(memoryTestFiles.mixed);

        const afterMemory = process.memoryUsage();
        const memoryUsed = afterMemory.heapUsed - beforeMemory.heapUsed;
        memorySnapshots.push(memoryUsed);

        // Force garbage collection every 5 iterations
        if (i % 5 === 0 && global.gc) {
          global.gc();
        }
      }

      const finalMemory = process.memoryUsage();
      const totalMemoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const totalMemoryIncreaseMB = totalMemoryIncrease / 1024 / 1024;

      // Check that total memory increase is reasonable
      expect(totalMemoryIncreaseMB).toBeLessThan(memoryLimits.repeatedParse);

      // Check that memory usage doesn't consistently increase
      const averageMemoryPerParse = memorySnapshots.reduce((sum, usage) => sum + usage, 0) / memorySnapshots.length;
      const averageMemoryPerParseMB = averageMemoryPerParse / 1024 / 1024;

      expect(averageMemoryPerParseMB).toBeLessThan(10); // Average per parse should be < 10MB

      console.log(
        `Repeated parsing - Total increase: ${totalMemoryIncreaseMB.toFixed(
          2
        )}MB, Average per parse: ${averageMemoryPerParseMB.toFixed(2)}MB`
      );
    });

    it('should not have memory leaks during stress testing', async () => {
      const initialMemory = process.memoryUsage();

      // Stress test with different file types (reduced iterations for faster execution)
      const testFiles = [memoryTestFiles.shallow, memoryTestFiles.deep, memoryTestFiles.wide, memoryTestFiles.mixed];

      for (let i = 0; i < 20; i++) {
        const fileIndex = i % testFiles.length;
        await parseTask(testFiles[fileIndex]);

        // Force garbage collection every 5 iterations
        if (i % 5 === 0 && global.gc) {
          global.gc();
        }
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;

      expect(memoryIncreaseMB).toBeLessThan(memoryLimits.stressTest);

      console.log(
        `Stress test memory increase: ${memoryIncreaseMB.toFixed(2)}MB (limit: ${memoryLimits.stressTest}MB)`
      );
    }, 10000); // 10 second timeout
  });

  describe('Memory Efficiency', () => {
    it('should efficiently handle large ASTs without excessive memory usage', async () => {
      const initialMemory = process.memoryUsage();

      // Parse the largest test file
      const result = await parseTask(memoryTestFiles.mixed);

      const finalMemory = process.memoryUsage();
      const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryUsedMB = memoryUsed / 1024 / 1024;

      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);

      // Memory usage should be reasonable relative to file size
      const fileSizeKB = getFileSize(memoryTestFiles.mixed);
      const memoryEfficiencyRatio = memoryUsedMB / (fileSizeKB / 1024); // MB per MB of file

      // Memory usage should be reasonable relative to file size (ASTs can be larger than file size)
      expect(memoryEfficiencyRatio).toBeLessThan(500); // Allow up to 500x for very complex ASTs

      console.log(
        `Memory efficiency - Used: ${memoryUsedMB.toFixed(2)}MB, File: ${(fileSizeKB / 1024).toFixed(
          2
        )}MB, Ratio: ${memoryEfficiencyRatio.toFixed(2)}x`
      );
    });

    it('should release memory after parsing operations', async () => {
      const baselineMemory = process.memoryUsage();

      // Parse multiple files
      for (let i = 0; i < 10; i++) {
        await parseTask(memoryTestFiles.deep);
      }

      // Force garbage collection
      if (global.gc) {
        global.gc();
      }

      const afterGCMemory = process.memoryUsage();
      const memoryAfterGC = afterGCMemory.heapUsed - baselineMemory.heapUsed;
      const memoryAfterGCMB = memoryAfterGC / 1024 / 1024;

      // After GC, memory should be reasonable (some memory may be retained for performance)
      expect(memoryAfterGCMB).toBeLessThan(200); // Should be within 200MB of baseline

      console.log(`Memory after GC: ${memoryAfterGCMB.toFixed(2)}MB above baseline`);
    });
  });

  describe('Memory Monitoring', () => {
    it('should provide detailed memory usage statistics', async () => {
      const initialMemory = process.memoryUsage();

      await parseTask(memoryTestFiles.mixed);

      const finalMemory = process.memoryUsage();

      const memoryStats = {
        heapUsed: (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024,
        heapTotal: (finalMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024,
        external: (finalMemory.external - initialMemory.external) / 1024 / 1024,
        rss: (finalMemory.rss - initialMemory.rss) / 1024 / 1024,
      };

      // All memory metrics should be reasonable
      expect(memoryStats.heapUsed).toBeLessThan(100);
      expect(memoryStats.heapTotal).toBeLessThan(200);
      expect(memoryStats.external).toBeLessThan(50);
      expect(memoryStats.rss).toBeLessThan(300);

      console.log(
        `Memory stats - Heap Used: ${memoryStats.heapUsed.toFixed(2)}MB, Heap Total: ${memoryStats.heapTotal.toFixed(
          2
        )}MB, External: ${memoryStats.external.toFixed(2)}MB, RSS: ${memoryStats.rss.toFixed(2)}MB`
      );
    });
  });
});

/**
 * Creates memory-intensive test files
 */
function createMemoryTestFiles(): void {
  // Shallow but wide AST
  const shallowContent = generateShallowWideAST();
  writeFileSync(memoryTestFiles.shallow, shallowContent);

  // Deep nested AST
  const deepContent = generateDeepNestedAST();
  writeFileSync(memoryTestFiles.deep, deepContent);

  // Wide AST with many siblings
  const wideContent = generateWideAST();
  writeFileSync(memoryTestFiles.wide, wideContent);

  // Mixed complexity AST
  const mixedContent = generateMixedComplexityAST();
  writeFileSync(memoryTestFiles.mixed, mixedContent);
}

/**
 * Generates a shallow but wide AST (many top-level sections)
 */
function generateShallowWideAST(): string {
  let content = `# Memory Test - Shallow Wide AST

## 1 Meta & Governance

### 1.2 Status

- **Current State:** 💡 Not Started
- **Priority:** 🟥 High
- **Progress:** 0%

### 1.3 Priority Drivers

- TEC-Dev_Productivity_Enhancement
- TEC-Prod_Stability_Blocker

---

## 2 Business & Scope

### 2.1 Overview

- **Core Function**: Memory testing for the documentation parser.
- **Key Capability**: Validates memory usage patterns with wide ASTs.
- **Business Value**: Ensures efficient memory usage for large documents.

---

## 3 Planning & Decomposition

### 3.1 Roadmap

| ID | Item | Priority | Status |
|----|------|----------|--------|
| 1  | Test 1 | High | Not Started |
| 2  | Test 2 | High | Not Started |
| 3  | Test 3 | Medium | Not Started |
| 4  | Test 4 | Medium | Not Started |
| 5  | Test 5 | Low | Not Started |

---

## 4 High-Level Design

### 4.2 Target Architecture

#### 4.2.1 Data Models

The memory tests validate efficient AST handling.

#### 4.2.2 Components

Memory testing ensures components don't leak memory.

---

## 5 Maintenance and Monitoring

### 5.2 Target Maintenance and Monitoring

#### 5.2.1 Error Handling

| Error Type | Trigger | Action | User Feedback |
|------------|---------|--------|---------------|
| Memory Error | Out of memory | Abort gracefully | "Memory limit exceeded" |

---

## 6 Implementation Guidance

### 6.1 Implementation Log / Steps

- [x] Create memory test files
- [x] Implement memory monitoring
- [x] Add memory leak detection
- [x] Validate memory efficiency

---

## 7 Quality & Operations

### 7.1 Testing Strategy / Requirements

| AC | Scenario | Test Type | Tools / Runner | Notes |
|----|----------|-----------|----------------|-------|
| 1 | Memory usage monitoring | Memory | Vitest + process.memoryUsage | Monitor heap usage |
| 2 | Memory leak detection | Memory | Vitest + repeated operations | Detect gradual increases |
| 3 | Memory efficiency | Memory | Vitest + file size ratio | Validate efficiency |

---

## 8 Reference

### 8.1 Appendices/Glossary

- **Memory Leak**: Gradual increase in memory usage that doesn't get released
- **AST**: Abstract Syntax Tree representation of markdown
- **Garbage Collection**: Automatic memory cleanup process

`;

  // Add many more sections to create a wide AST
  for (let i = 6; i <= 100; i++) {
    content += `\n## ${i} Additional Section ${i}\n\nThis is additional section ${i} for memory testing.\n`;
  }

  return content;
}

/**
 * Generates a deep nested AST (many nested levels)
 */
function generateDeepNestedAST(): string {
  let content = `# Memory Test - Deep Nested AST

## 1 Meta & Governance

### 1.2 Status

- **Current State:** 💡 Not Started
- **Priority:** 🟥 High

### 1.3 Priority Drivers

- TEC-Dev_Productivity_Enhancement

---

## 2 Business & Scope

### 2.1 Overview

- **Core Function**: Memory testing with deep ASTs.
- **Key Capability**: Validates memory usage with deeply nested structures.

`;

  // Add deeply nested content
  for (let level1 = 1; level1 <= 10; level1++) {
    content += `\n### 2.${level1} Level 1 Section ${level1}\n\n`;

    for (let level2 = 1; level2 <= 5; level2++) {
      content += `#### 2.${level1}.${level2} Level 2 Section ${level2}\n\n`;

      for (let level3 = 1; level3 <= 3; level3++) {
        content += `##### 2.${level1}.${level2}.${level3} Level 3 Section ${level3}\n\n`;

        for (let level4 = 1; level4 <= 2; level4++) {
          content += `###### 2.${level1}.${level2}.${level3}.${level4} Level 4 Section ${level4}\n\n`;

          for (let level5 = 1; level5 <= 2; level5++) {
            content += `####### 2.${level1}.${level2}.${level3}.${level4}.${level5} Level 5 Section ${level5}\n\n`;
            content += `This is the deepest level content for memory testing.\n\n`;
          }
        }
      }
    }
  }

  return content;
}

/**
 * Generates a wide AST with many siblings at each level
 */
function generateWideAST(): string {
  let content = `# Memory Test - Wide AST

## 1 Meta & Governance

### 1.2 Status

- **Current State:** 💡 Not Started
- **Priority:** 🟥 High

---

## 2 Business & Scope

### 2.1 Overview

- **Core Function**: Memory testing with wide ASTs.
- **Key Capability**: Validates memory usage with many siblings.

`;

  // Add many siblings at each level
  for (let section = 1; section <= 50; section++) {
    content += `\n## ${section} Wide Section ${section}\n\n`;

    for (let subsection = 1; subsection <= 20; subsection++) {
      content += `### ${section}.${subsection} Subsection ${subsection}\n\n`;

      for (let item = 1; item <= 10; item++) {
        content += `- Item ${item} in subsection ${subsection}\n`;
      }
      content += `\n`;
    }
  }

  return content;
}

/**
 * Generates a mixed complexity AST with various patterns
 */
function generateMixedComplexityAST(): string {
  let content = `# Memory Test - Mixed Complexity AST

## 1 Meta & Governance

### 1.2 Status

- **Current State:** 💡 Not Started
- **Priority:** 🟥 High

---

## 2 Business & Scope

### 2.1 Overview

- **Core Function**: Memory testing with mixed complexity.
- **Key Capability**: Validates memory usage with various AST patterns.

`;

  // Mix of deep, wide, and complex structures
  for (let section = 1; section <= 20; section++) {
    content += `\n## ${section} Mixed Section ${section}\n\n`;

    if (section % 3 === 0) {
      // Deep structure
      for (let level = 1; level <= 5; level++) {
        content += `${'#'.repeat(level + 2)} Deep Level ${level}\n\n`;
        content += `This is deep level ${level} content.\n\n`;
      }
    } else if (section % 3 === 1) {
      // Wide structure
      for (let item = 1; item <= 15; item++) {
        content += `### ${section}.${item} Wide Item ${item}\n\n`;
        content += `This is wide item ${item} content.\n\n`;
      }
    } else {
      // Complex structure with lists and tables
      content += `### ${section}.1 Complex Structure\n\n`;
      content += `| Column 1 | Column 2 | Column 3 |\n`;
      content += `|----------|----------|----------|\n`;
      for (let row = 1; row <= 10; row++) {
        content += `| Row ${row} Col 1 | Row ${row} Col 2 | Row ${row} Col 3 |\n`;
      }
      content += `\n`;

      content += `### ${section}.2 Nested Lists\n\n`;
      for (let level1 = 1; level1 <= 3; level1++) {
        content += `${'  '.repeat(level1 - 1)}- Level ${level1} item\n`;
        for (let level2 = 1; level2 <= 2; level2++) {
          content += `${'  '.repeat(level1)}- Level ${level1}.${level2} item\n`;
          for (let level3 = 1; level3 <= 2; level3++) {
            content += `${'  '.repeat(level1 + 1)}- Level ${level1}.${level2}.${level3} item\n`;
          }
        }
      }
      content += `\n`;
    }
  }

  return content;
}

/**
 * Gets the file size in KB
 */
function getFileSize(filePath: string): number {
  try {
    const fs = require('fs');
    const stats = fs.statSync(filePath);
    return stats.size / 1024; // Convert to KB
  } catch (error) {
    return 0;
  }
}
