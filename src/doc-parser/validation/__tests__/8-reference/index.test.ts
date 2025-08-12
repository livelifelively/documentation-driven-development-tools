// This file serves as an entry point to run all 8-reference tests
// It imports all test files to ensure they are included in the test suite

// Core schema tests
import './core.test.js';

// Section-level tests
import './sections.test.js';

// Appendices/Glossary field tests
import './appendices-glossary.test.js';

// Accessibility tests
import './accessibility.test.js';

// Original comprehensive tests (for reference)
import './original.test.js';

// Note: Additional test files will be added here as they are created:
// - integration.test.ts (for complete family validation, coverage verification)
// - README.md (for test documentation)
