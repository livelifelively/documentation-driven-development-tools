import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  SchemaFamilySchema,
  SchemaSectionSchema,
  SchemaFieldSchema,
  ContentElementSchema,
  RenderingControlSchema,
} from '../schema.zod';

describe('Schema Zod Validation', () => {
  describe('SchemaFamilySchema', () => {
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
        SchemaFamilySchema.parse(validSchemaFamily);
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
        SchemaFamilySchema.parse(invalidSchemaFamily);
      }).toThrow();
    });
  });

  describe('SchemaSectionSchema', () => {
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
                items: ['**Created:** [YYYY-MM-DD HH:MM]'],
                rendering: {
                  renderAsCodeBlockForHuman: false,
                  renderAsCodeBlockForMachine: true,
                },
              },
            ],
          },
        ],
      };

      // This test should pass with the implemented schema
      expect(() => {
        SchemaSectionSchema.parse(validSection);
      }).not.toThrow();
    });
  });

  describe('SchemaFieldSchema', () => {
    it('should validate a valid SchemaField object', () => {
      const validField = {
        name: 'Created',
        type: 'timestamp',
        applicability: { plan: 'required', task: 'required' },
        description: 'The timestamp when the document was created.',
      };

      // This test should pass with the implemented schema
      expect(() => {
        SchemaFieldSchema.parse(validField);
      }).not.toThrow();
    });
  });

  describe('ContentElementSchema', () => {
    it('should validate a valid ContentElement object', () => {
      const validContentElement = {
        type: 'list',
        items: ['**Created:** [YYYY-MM-DD HH:MM]'],
        rendering: {
          renderAsCodeBlockForHuman: false,
          renderAsCodeBlockForMachine: true,
        },
      };

      // This test should pass with the implemented schema
      expect(() => {
        ContentElementSchema.parse(validContentElement);
      }).not.toThrow();
    });
  });

  describe('RenderingControlSchema', () => {
    it('should validate a valid RenderingControl object', () => {
      const validRenderingControl = {
        renderAsCodeBlockForHuman: false,
        renderAsCodeBlockForMachine: true,
      };

      // This test should pass with the implemented schema
      expect(() => {
        RenderingControlSchema.parse(validRenderingControl);
      }).not.toThrow();
    });
  });
});
