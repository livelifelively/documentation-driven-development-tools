import * as path from 'path';
import { fileURLToPath } from 'url';

export const TODO_PLACEHOLDER_TEXT = '_ADD_CONTENT_HERE_';

export interface GenerationConfig {
  schema: {
    sourceDir: string;
    outputDirs: {
      src: string;
      docs: string;
    };
  };
  templates: {
    outputDirs: {
      src: string;
      docs: string;
    };
  };
}

export function getConfig(): GenerationConfig {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return {
    schema: {
      sourceDir: process.env.DDD_SCHEMA_SOURCE_DIR || path.join(__dirname, 'schema', 'ddd-schema-json'),
      outputDirs: {
        src: process.env.DDD_SCHEMA_SRC_OUTPUT || path.join(__dirname, 'generated-schema-docs'),
        docs: process.env.DDD_SCHEMA_DOCS_OUTPUT || path.join(__dirname, '..', 'docs'),
      },
    },
    templates: {
      outputDirs: {
        src: process.env.DDD_TEMPLATES_SRC_OUTPUT || path.join(__dirname, 'templates'),
        docs: process.env.DDD_TEMPLATES_DOCS_OUTPUT || path.join(__dirname, '..', 'docs', 'templates'),
      },
    },
  };
}
