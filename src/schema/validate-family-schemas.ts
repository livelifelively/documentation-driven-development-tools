#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { glob } from 'glob';
import { SchemaFamily } from './schema.zod.js';

/**
 * Validates all JSON schema files against the canonical Zod schema
 *
 * This script:
 * 1. Finds all *.json files in src/schema/ddd-schema-json/
 * 2. Reads each file and parses as JSON
 * 3. Validates against the SchemaFamily Zod schema
 * 4. Exits with code 0 if all valid, code 1 if any invalid
 */

const SCHEMA_DIR = 'src/schema/ddd-schema-json';

// Export the main validation logic for testing
export async function validateSchemaFiles(): Promise<{ hasErrors: boolean; errorCount: number }> {
  let hasErrors = false;
  let errorCount = 0;

  try {
    // Find all JSON files in the schema directory that follow the SchemaFamily pattern
    // Only validate numbered files (1-meta.json, 2-business-scope.json, etc.)
    const jsonFiles = glob.sync(`${SCHEMA_DIR}/[0-9]-*.json`);

    if (jsonFiles.length === 0) {
      console.log('No JSON files found in schema directory');
      return { hasErrors: false, errorCount: 0 };
    }

    console.log(`Found ${jsonFiles.length} JSON files to validate...`);

    // Validate each file
    for (const filePath of jsonFiles) {
      try {
        // Read and parse the JSON file
        const fileContent = readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // Validate against the Zod schema
        SchemaFamily.parse(jsonData);

        console.log(`✅ Validated: ${filePath}`);
      } catch (error) {
        hasErrors = true;
        errorCount++;

        if (error instanceof SyntaxError) {
          // JSON parsing error
          console.error(`❌ JSON Syntax Error in ${filePath}:`);
          console.error(`   ${error.message}`);
        } else if (error instanceof Error && 'issues' in error) {
          // Zod validation error
          console.error(`❌ Schema Validation Error in ${filePath}:`);
          console.error(`   ${error.message}`);
        } else {
          // File system or other error
          console.error(`❌ Error reading ${filePath}:`);
          console.error(`   ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    if (hasErrors) {
      console.error('\n❌ Validation failed. Please fix the errors above.');
    } else {
      console.log('\n✅ All schema files are valid!');
    }

    return { hasErrors, errorCount };
  } catch (error) {
    console.error('❌ Fatal error during validation:');
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    return { hasErrors: true, errorCount: 1 };
  }
}

// CLI entry point - only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateSchemaFiles()
    .then(({ hasErrors }) => {
      process.exit(hasErrors ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}
