import { describe, it, expect } from 'vitest';

import fs from 'fs';
import path from 'path';
import {
  SchemaFamily,
  SchemaSection,
  SchemaField,
  SchemaExample,
  ContentElement,
  RenderingControl,
  SchemaApplicability,
  Applicability,
} from '../schema.zod';

describe('Schema Zod Validation', () => {
  describe('SchemaFamily', () => {
    it('should validate a valid SchemaFamily JSON object', () => {
      const validSchemaFamily = {
        id: 1,
        name: 'Meta & Governance',
        anchor: 'meta--governance',
        primaryQuestion: 'How critical is this work, what is its current status?',
        rationale:
          'Keeps humans and CI aware of health, urgency, and blockers at any zoom level without polluting design content.',
        applicability: {
          plan: 'required',
          task: 'required',
        },
        notes: 'Required at all levels; Task-level includes detailed progress tracking',
        sections: [
          {
            id: '1.2',
            name: 'Status',
            headingLevel: 3,
            description: 'A section containing key status metrics for the document.',
            contentFormat: 'Markdown `###` heading followed by a bulleted list.',
            reference: 'See the corresponding template file.',
            applicability: {
              plan: 'required',
              task: 'required',
            },
            notes: 'Plan: Document lifecycle + strategic phase. Task: Implementation tracking + execution metrics.',
            fields: [
              {
                name: 'Created',
                type: 'timestamp',
                applicability: { plan: 'required', task: 'required' },
                description: 'The timestamp when the document was created.',
              },
            ],
            examples: [
              {
                context: 'Plan',
                content: [
                  {
                    type: 'list',
                    items: ['**Created:** [YYYY-MM-DD HH:MM]', '**Last Updated:** [YYYY-MM-DD HH:MM]'],
                    rendering: {
                      renderAsCodeBlockForHuman: false,
                      renderAsCodeBlockForMachine: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // This test should pass with the implemented schema
      expect(() => {
        SchemaFamily.parse(validSchemaFamily);
      }).not.toThrow();
    });

    it('should fail validation for invalid SchemaFamily object', () => {
      const invalidSchemaFamily = {
        id: 'not a number', // Should be number
        name: 123, // Should be string
        // Missing required fields
      };

      // This test should fail validation for invalid data
      expect(() => {
        SchemaFamily.parse(invalidSchemaFamily);
      }).toThrow();
    });

    it('should fail validation for SchemaFamily with missing required fields', () => {
      const invalidSchemaFamily = {
        id: 1,
        name: 'Meta & Governance',
        // Missing anchor, primaryQuestion, rationale, applicability, notes, sections
      };

      expect(() => {
        SchemaFamily.parse(invalidSchemaFamily);
      }).toThrow();
    });

    it('should fail validation for SchemaFamily with invalid applicability values', () => {
      const invalidSchemaFamily = {
        id: 1,
        name: 'Meta & Governance',
        anchor: 'meta--governance',
        primaryQuestion: 'How critical is this work, what is its current status?',
        rationale: 'Keeps humans and CI aware of health, urgency, and blockers.',
        applicability: {
          plan: 'invalid_value', // Should be 'required', 'optional', or 'omitted'
          task: 'required',
        },
        notes: 'Required at all levels; Task-level includes detailed progress tracking',
        sections: [],
      };

      expect(() => {
        SchemaFamily.parse(invalidSchemaFamily);
      }).toThrow();
    });
  });

  describe('SchemaSection', () => {
    it('should validate a valid SchemaSection object', () => {
      const validSection = {
        id: '1.2',
        name: 'Status',
        headingLevel: 3,
        description: 'A section containing key status metrics for the document.',
        contentFormat: 'Markdown `###` heading followed by a bulleted list.',
        reference: 'See the corresponding template file.',
        applicability: {
          plan: 'required',
          task: 'required',
        },
        notes: 'Plan: Document lifecycle + strategic phase. Task: Implementation tracking + execution metrics.',
        fields: [
          {
            name: 'Created',
            type: 'timestamp',
            applicability: { plan: 'required', task: 'required' },
            description: 'The timestamp when the document was created.',
          },
        ],
        examples: [
          {
            context: 'Plan',
            content: [
              {
                type: 'list',
                items: ['**Created:** [YYYY-MM-DD HH:MM]', '**Last Updated:** [YYYY-MM-DD HH:MM]'],
                rendering: {
                  renderAsCodeBlockForHuman: false,
                  renderAsCodeBlockForMachine: true,
                },
              },
            ],
          },
        ],
      };

      expect(() => {
        SchemaSection.parse(validSection);
      }).not.toThrow();
    });

    it('should fail validation for invalid SchemaSection object', () => {
      const invalidSection = {
        id: 123, // Should be string
        name: 456, // Should be string
        headingLevel: 'not a number', // Should be number
        // Missing required fields
      };

      expect(() => {
        SchemaSection.parse(invalidSection);
      }).toThrow();
    });

    it('should fail validation for SchemaSection with missing required fields', () => {
      const invalidSection = {
        id: '1.2',
        name: 'Status',
        // Missing headingLevel, applicability
      };

      expect(() => {
        SchemaSection.parse(invalidSection);
      }).toThrow();
    });
  });

  describe('SchemaField', () => {
    it('should validate a valid SchemaField object', () => {
      const validField = {
        name: 'Created',
        type: 'timestamp',
        applicability: { plan: 'required', task: 'required' },
        description: 'The timestamp when the document was created.',
      };

      expect(() => {
        SchemaField.parse(validField);
      }).not.toThrow();
    });

    it('should fail validation for invalid SchemaField object', () => {
      const invalidField = {
        name: 123, // Should be string
        type: 456, // Should be string
        applicability: 'not an object', // Should be object
        description: 789, // Should be string
      };

      expect(() => {
        SchemaField.parse(invalidField);
      }).toThrow();
    });

    it('should fail validation for SchemaField with missing required fields', () => {
      const invalidField = {
        name: 'Created',
        type: 'timestamp',
        // Missing applicability, description
      };

      expect(() => {
        SchemaField.parse(invalidField);
      }).toThrow();
    });
  });

  describe('SchemaExample', () => {
    it('should validate a valid SchemaExample object', () => {
      const validExample = {
        context: 'Plan',
        content: [
          {
            type: 'list',
            items: ['**Created:** [YYYY-MM-DD HH:MM]', '**Last Updated:** [YYYY-MM-DD HH:MM]'],
            rendering: {
              renderAsCodeBlockForHuman: false,
              renderAsCodeBlockForMachine: true,
            },
          },
        ],
      };

      expect(() => {
        SchemaExample.parse(validExample);
      }).not.toThrow();
    });

    it('should fail validation for invalid SchemaExample object', () => {
      const invalidExample = {
        context: 123, // Should be string
        content: 'not an array', // Should be array
      };

      expect(() => {
        SchemaExample.parse(invalidExample);
      }).toThrow();
    });

    it('should fail validation for SchemaExample with missing required fields', () => {
      const invalidExample = {
        context: 'Plan',
        // Missing content
      };

      expect(() => {
        SchemaExample.parse(invalidExample);
      }).toThrow();
    });
  });

  describe('ContentElement', () => {
    it('should validate a valid ContentElement with list type', () => {
      const validContentElement = {
        type: 'list',
        items: ['Item 1', 'Item 2', 'Item 3'],
        rendering: {
          renderAsCodeBlockForHuman: false,
          renderAsCodeBlockForMachine: true,
        },
      };

      expect(() => {
        ContentElement.parse(validContentElement);
      }).not.toThrow();
    });

    it('should validate a valid ContentElement with text type', () => {
      const validContentElement = {
        type: 'text',
        content: 'This is some text content.',
        rendering: {
          renderAsCodeBlockForHuman: false,
          renderAsCodeBlockForMachine: false,
        },
      };

      expect(() => {
        ContentElement.parse(validContentElement);
      }).not.toThrow();
    });

    it('should validate a valid ContentElement with table type', () => {
      const validContentElement = {
        type: 'table',
        headers: ['Header 1', 'Header 2', 'Header 3'],
        rows: [
          ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
          ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
        ],
        rendering: {
          renderAsCodeBlockForHuman: false,
          renderAsCodeBlockForMachine: true,
        },
      };

      expect(() => {
        ContentElement.parse(validContentElement);
      }).not.toThrow();
    });

    it('should validate a valid ContentElement with codeblock type', () => {
      const validContentElement = {
        type: 'codeblock',
        content: 'console.log("Hello, World!");',
        language: 'javascript',
        rendering: {
          renderAsCodeBlockForHuman: true,
          renderAsCodeBlockForMachine: true,
        },
      };

      expect(() => {
        ContentElement.parse(validContentElement);
      }).not.toThrow();
    });

    it('should validate a valid ContentElement with mermaid type', () => {
      const validContentElement = {
        type: 'mermaid',
        content: 'graph TD; A-->B; B-->C;',
        diagramType: 'flowchart',
        rendering: {
          renderAsCodeBlockForHuman: true,
          renderAsCodeBlockForMachine: false,
        },
      };

      expect(() => {
        ContentElement.parse(validContentElement);
      }).not.toThrow();
    });

    it('should validate a ContentElement with nested children', () => {
      const validContentElement = {
        type: 'text',
        content: 'Parent content',
        rendering: {
          renderAsCodeBlockForHuman: false,
          renderAsCodeBlockForMachine: false,
        },
        children: [
          {
            type: 'list',
            items: ['Child item 1', 'Child item 2'],
            rendering: {
              renderAsCodeBlockForHuman: false,
              renderAsCodeBlockForMachine: true,
            },
          },
        ],
      };

      expect(() => {
        ContentElement.parse(validContentElement);
      }).not.toThrow();
    });

    it('should fail validation for invalid ContentElement object', () => {
      const invalidContentElement = {
        type: 'invalid_type', // Should be one of the valid types
        rendering: {
          renderAsCodeBlockForHuman: false,
          renderAsCodeBlockForMachine: true,
        },
      };

      expect(() => {
        ContentElement.parse(invalidContentElement);
      }).toThrow();
    });

    it('should fail validation for ContentElement with missing required fields', () => {
      const invalidContentElement = {
        type: 'list',
        items: ['Item 1', 'Item 2'],
        // Missing rendering
      };

      expect(() => {
        ContentElement.parse(invalidContentElement);
      }).toThrow();
    });

    it('should fail validation for ContentElement with invalid rendering control', () => {
      const invalidContentElement = {
        type: 'list',
        items: ['Item 1', 'Item 2'],
        rendering: {
          renderAsCodeBlockForHuman: 'not a boolean', // Should be boolean
          renderAsCodeBlockForMachine: true,
        },
      };

      expect(() => {
        ContentElement.parse(invalidContentElement);
      }).toThrow();
    });
  });

  describe('RenderingControl', () => {
    it('should validate a valid RenderingControl object', () => {
      const validRenderingControl = {
        renderAsCodeBlockForHuman: false,
        renderAsCodeBlockForMachine: true,
      };

      expect(() => {
        RenderingControl.parse(validRenderingControl);
      }).not.toThrow();
    });

    it('should fail validation for invalid RenderingControl object', () => {
      const invalidRenderingControl = {
        renderAsCodeBlockForHuman: 'not a boolean', // Should be boolean
        renderAsCodeBlockForMachine: 123, // Should be boolean
      };

      expect(() => {
        RenderingControl.parse(invalidRenderingControl);
      }).toThrow();
    });

    it('should fail validation for RenderingControl with missing required fields', () => {
      const invalidRenderingControl = {
        renderAsCodeBlockForHuman: false,
        // Missing renderAsCodeBlockForMachine
      };

      expect(() => {
        RenderingControl.parse(invalidRenderingControl);
      }).toThrow();
    });
  });

  describe('SchemaApplicability', () => {
    it('should validate a valid SchemaApplicability object', () => {
      const validApplicability = {
        plan: 'required',
        task: 'optional',
      };

      expect(() => {
        SchemaApplicability.parse(validApplicability);
      }).not.toThrow();
    });

    it('should validate all valid applicability values', () => {
      const validValues = ['required', 'optional', 'omitted'];

      for (const planValue of validValues) {
        for (const taskValue of validValues) {
          const validApplicability = {
            plan: planValue,
            task: taskValue,
          };

          expect(() => {
            SchemaApplicability.parse(validApplicability);
          }).not.toThrow();
        }
      }
    });

    it('should fail validation for invalid SchemaApplicability object', () => {
      const invalidApplicability = {
        plan: 'invalid_value', // Should be 'required', 'optional', or 'omitted'
        task: 'required',
      };

      expect(() => {
        SchemaApplicability.parse(invalidApplicability);
      }).toThrow();
    });

    it('should fail validation for SchemaApplicability with missing required fields', () => {
      const invalidApplicability = {
        plan: 'required',
        // Missing task
      };

      expect(() => {
        SchemaApplicability.parse(invalidApplicability);
      }).toThrow();
    });
  });

  describe('Applicability', () => {
    it('should validate individual applicability values', () => {
      const validValues = ['required', 'optional', 'omitted'];

      for (const value of validValues) {
        expect(() => {
          Applicability.parse(value);
        }).not.toThrow();
      }
    });

    it('should fail validation for invalid applicability value', () => {
      expect(() => {
        Applicability.parse('invalid_value');
      }).toThrow();
    });
  });

  describe('Integration Tests - Real JSON Files', () => {
    it('should validate all JSON schema files in the ddd-schema-json directory', () => {
      const schemaDir = path.join(__dirname, '../ddd-schema-json');
      const jsonFiles = fs.readdirSync(schemaDir).filter((file) => file.endsWith('.json'));

      expect(jsonFiles.length).toBeGreaterThan(0);

      for (const jsonFile of jsonFiles) {
        const filePath = path.join(schemaDir, jsonFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // Each JSON file should be a valid SchemaFamily
        expect(() => {
          SchemaFamily.parse(jsonData);
        }).not.toThrow(`File ${jsonFile} should be a valid SchemaFamily`);
      }
    });

    it('should validate context-examples.json file', () => {
      const contextExamplesPath = path.join(__dirname, '../ddd-schema-json/context-examples.json');
      const fileContent = fs.readFileSync(contextExamplesPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // The context-examples.json file should be a valid SchemaFamily
      expect(() => {
        SchemaFamily.parse(jsonData);
      }).not.toThrow('context-examples.json should be a valid SchemaFamily');
    });
  });
});
