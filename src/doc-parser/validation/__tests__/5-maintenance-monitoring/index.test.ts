// This file serves as an entry point to run all 5-maintenance-monitoring tests
// It imports all test files to ensure they are included in the test suite

// Core schema tests
import './core.test.js';

// Section-level tests
import './sections.test.js';

// Subsection tests
import './subsections.test.js';

// Accessibility tests
import './accessibility.test.js';

// Original comprehensive tests (for reference)
import './original.test.js';

// Note: Additional test files will be added here as they are created:
// - integration.test.ts (for complete family validation, coverage verification)
// - README.md (for test documentation)
