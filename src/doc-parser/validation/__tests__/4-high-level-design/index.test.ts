// This file serves as an entry point to run all 4-high-level-design tests
// It imports all test files to ensure they are included in the test suite

// Core schema tests
import './core.test.js';

// Section-level tests
import './sections.test.js';

// Subsection tests
import './subsections.test.js';

// Original comprehensive tests (for reference)
import './original.test.js';

// ID-specific tests
import './ids.test.js';

// Note: Additional test files will be added here as they are created:
// - deep-nested.test.ts (for deep nested sections like 4.1.5.1, 4.2.5.1, 4.4.1-4.4.4)
// - fields.test.ts (for individual field schemas)
// - integration.test.ts (for complete family validation, coverage verification)
