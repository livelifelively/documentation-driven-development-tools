import { describe, it, expect } from 'vitest';
import { ReferenceFamilySchema, AppendicesGlossarySchema } from '../8-reference.schema.js';

describe('Reference Schema Validation', () => {
  describe('Appendices/Glossary Schema', () => {
    it('should validate a complete appendices/glossary section', () => {
      const validAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
          {
            term: 'SSO',
            definition: 'Single Sign-On.',
          },
        ],
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation for external integrations.',
          },
          {
            title: 'Configuration Guide',
            content: 'Step-by-step configuration instructions.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(validAppendicesGlossary);
      expect(result.success).toBe(true);
    });

    it('should validate appendices/glossary with only glossary', () => {
      const validAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(validAppendicesGlossary);
      expect(result.success).toBe(true);
    });

    it('should validate appendices/glossary with only appendices', () => {
      const validAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(validAppendicesGlossary);
      expect(result.success).toBe(true);
    });

    it('should reject appendices/glossary with empty glossary term', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: '',
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('term');
      }
    });

    it('should reject appendices/glossary with empty glossary definition', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: '',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('definition');
      }
    });

    it('should reject appendices/glossary with missing glossary term', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('term');
      }
    });

    it('should reject appendices/glossary with missing glossary definition', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('definition');
      }
    });

    it('should reject appendices/glossary with empty appendix title', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: '',
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject appendices/glossary with empty appendix content', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
            content: '',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });

    it('should reject appendices/glossary with missing appendix title', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject appendices/glossary with missing appendix content', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });

    it('should reject appendices/glossary with non-string glossary term', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 123,
            definition: 'Personally Identifiable Information.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('term');
      }
    });

    it('should reject appendices/glossary with non-string glossary definition', () => {
      const invalidAppendicesGlossary = {
        glossary: [
          {
            term: 'PII',
            definition: null,
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('definition');
      }
    });

    it('should reject appendices/glossary with non-string appendix title', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 456,
            content: 'Detailed API documentation for external integrations.',
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should reject appendices/glossary with non-string appendix content', () => {
      const invalidAppendicesGlossary = {
        appendices: [
          {
            title: 'API Reference',
            content: undefined,
          },
        ],
      };

      const result = AppendicesGlossarySchema.safeParse(invalidAppendicesGlossary);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });
  });

  describe('Reference Schema (Main Schema)', () => {
    it('should validate a complete reference object', () => {
      const validReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: 'PII',
              definition: 'Personally Identifiable Information.',
            },
            {
              term: 'SSO',
              definition: 'Single Sign-On.',
            },
          ],
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
            {
              title: 'Configuration Guide',
              content: 'Step-by-step configuration instructions.',
            },
          ],
        },
      };

      const result = ReferenceFamilySchema.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should validate reference with only glossary', () => {
      const validReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: 'PII',
              definition: 'Personally Identifiable Information.',
            },
          ],
        },
      };

      const result = ReferenceFamilySchema.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should validate reference with only appendices', () => {
      const validReference = {
        appendicesGlossary: {
          appendices: [
            {
              title: 'API Reference',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        },
      };

      const result = ReferenceFamilySchema.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should validate empty reference object', () => {
      const validReference = {};

      const result = ReferenceFamilySchema.safeParse(validReference);
      expect(result.success).toBe(true);
    });

    it('should reject reference with invalid appendices/glossary', () => {
      const invalidReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: '',
              definition: 'Personally Identifiable Information.',
            },
          ],
        },
      };

      const result = ReferenceFamilySchema.safeParse(invalidReference);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('appendicesGlossary');
      }
    });

    it('should reject reference with invalid glossary term', () => {
      const invalidReference = {
        appendicesGlossary: {
          glossary: [
            {
              term: 123,
              definition: 'Personally Identifiable Information.',
            },
          ],
        },
      };

      const result = ReferenceFamilySchema.safeParse(invalidReference);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('appendicesGlossary');
      }
    });

    it('should reject reference with invalid appendix title', () => {
      const invalidReference = {
        appendicesGlossary: {
          appendices: [
            {
              title: '',
              content: 'Detailed API documentation for external integrations.',
            },
          ],
        },
      };

      const result = ReferenceFamilySchema.safeParse(invalidReference);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('appendicesGlossary');
      }
    });
  });
});
