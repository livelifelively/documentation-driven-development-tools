// This file serves as an entry point to run all 1-meta-governance tests
// It imports all test files to ensure they are included in the test suite

// Core schema tests
import './core.test.js';

// Section-level tests
import './sections.test.js';

// Status section tests
import './status.test.js';

// Priority Drivers section tests
import './priority-drivers.test.js';

// Accessibility tests
import './accessibility.test.js';

// Field-level tests
import './fields.test.js';

// Original comprehensive tests (for reference)
import './original.test.js';

// Note: Additional test files will be added here as they are created:
// - integration.test.ts (for complete family validation, coverage verification)
// - accessibility.test.ts (for byId index verification)
