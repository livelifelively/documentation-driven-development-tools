import { describe, it, expect } from 'vitest';
import statusPlugin from '../plugins/status.plugin.js';
import { Root } from 'mdast';

const createMockAst = (lines: string[]): Root => ({
  type: 'root',
  children: [
    {
      type: 'list',
      children: lines.map((line) => ({
        type: 'listItem',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: line }],
          },
        ],
      })),
    },
  ],
});

describe('Status Plugin', () => {
  describe('lint', () => {
    it('should return no errors for valid status section', () => {
      const mockAst = createMockAst(['Current State: 💡 Not Started', 'Priority: 🟥 High']);
      const errors = statusPlugin.lint(mockAst);
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing Current State', () => {
      const mockAst = createMockAst(['Priority: 🟥 High']);
      const errors = statusPlugin.lint(mockAst);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Current State');
    });

    it('should return error for missing Priority', () => {
      const mockAst = createMockAst(['Current State: 💡 Not Started']);
      const errors = statusPlugin.lint(mockAst);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Priority');
    });
  });

  describe('extract', () => {
    it('should extract status data correctly', () => {
      const mockAst = createMockAst(['Current State: 💡 Not Started', 'Priority: 🟥 High', 'Progress: 25']);
      const data = statusPlugin.extract(mockAst);
      expect(data.currentState).toBe('💡 Not Started');
      expect(data.priority).toBe('🟥 High');
      expect(data.progress).toBe(25);
    });

    it('should handle missing fields gracefully', () => {
      const mockAst = createMockAst(['Current State: 💡 Not Started']);
      const data = statusPlugin.extract(mockAst);
      expect(data.currentState).toBe('💡 Not Started');
      expect(data.priority).toBeUndefined();
      expect(data.progress).toBeUndefined();
    });
  });
});
