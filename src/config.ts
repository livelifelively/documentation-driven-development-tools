import * as path from 'path';

export const TODO_PLACEHOLDER_TEXT = 'TODO__ADD_CONTENT_HERE';

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
  return {
    schema: {
      sourceDir: process.env.DDD_SCHEMA_SOURCE_DIR || path.join(__dirname, 'ddd-schema-json'),
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
