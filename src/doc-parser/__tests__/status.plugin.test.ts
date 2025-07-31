import { describe, it, expect } from 'vitest';
import statusPlugin from '../plugins/status.plugin.js';

describe('Status Plugin', () => {
  describe('lint', () => {
    it('should return no errors for valid status section', () => {
      const mockAst = [
        { type: 'text', value: '**Current State:** 💡 Not Started' },
        { type: 'text', value: '**Priority:** 🟥 High' },
      ];

      const errors = statusPlugin.lint(mockAst);

      expect(errors).toHaveLength(0);
    });

    it('should return error for missing Current State', () => {
      const mockAst = [{ type: 'text', value: '**Priority:** 🟥 High' }];

      const errors = statusPlugin.lint(mockAst);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Missing required field: Current State');
    });

    it('should return error for missing Priority', () => {
      const mockAst = [{ type: 'text', value: '**Current State:** 💡 Not Started' }];

      const errors = statusPlugin.lint(mockAst);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Missing required field: Priority');
    });
  });

  describe('extract', () => {
    it('should extract status data correctly', () => {
      const mockAst = [
        { type: 'text', value: '**Current State:** 💡 Not Started' },
        { type: 'text', value: '**Priority:** 🟥 High' },
        { type: 'text', value: '**Progress:** 25' },
      ];

      const data = statusPlugin.extract(mockAst);

      expect(data.currentState).toBe('💡 Not Started');
      expect(data.priority).toBe('🟥 High');
      expect(data.progress).toBe(25);
    });

    it('should handle missing fields gracefully', () => {
      const mockAst = [{ type: 'text', value: '**Current State:** 💡 Not Started' }];

      const data = statusPlugin.extract(mockAst);

      expect(data.currentState).toBe('💡 Not Started');
      expect(data.priority).toBeNull();
      expect(data.progress).toBe(0);
    });
  });
});
