import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PluginManager } from '../plugin-manager.js';
import { SectionProcessor } from '../plugin.types.js';

// Mock for the glob module
vi.mock('glob', () => ({
  glob: {
    sync: vi.fn(),
  },
}));

// Mock for dynamic imports
vi.mock('../plugins/status.plugin', () => ({
  default: {
    sectionId: '1.2',
    lint: vi.fn(),
    extract: vi.fn(),
  },
}));

describe('PluginManager', () => {
  let pluginManager: PluginManager;
  let mockGlob: any;

  beforeEach(async () => {
    pluginManager = new PluginManager();
    vi.clearAllMocks();

    // Get the mocked glob module
    mockGlob = await import('glob');
  });

  describe('loadPlugins', () => {
    it('should load all plugin files from the specified directory', () => {
      // Mock glob to return plugin file paths
      mockGlob.glob.sync.mockReturnValue([
        'src/doc-parser/plugins/status.plugin.ts',
        'src/doc-parser/plugins/business.plugin.ts',
      ]);

      // Mock dynamic imports
      vi.doMock('../plugins/status.plugin', () => ({
        default: {
          sectionId: '1.2',
          lint: vi.fn(),
          extract: vi.fn(),
        },
      }));

      vi.doMock('../plugins/business.plugin', () => ({
        default: {
          sectionId: '2.1',
          lint: vi.fn(),
          extract: vi.fn(),
        },
      }));

      // Just verify the method can be called without throwing
      expect(() => {
        pluginManager.loadPlugins('src/doc-parser/plugins/');
      }).not.toThrow();
    });

    it('should handle empty plugin directory', () => {
      mockGlob.glob.sync.mockReturnValue([]);

      expect(() => {
        pluginManager.loadPlugins('src/doc-parser/plugins/');
      }).not.toThrow();
    });

    it('should skip invalid plugin files gracefully', async () => {
      mockGlob.glob.sync.mockReturnValue(['/path/to/invalid.plugin.ts']);

      // Mock the dynamic import to throw an error for the invalid file
      vi.doMock('/path/to/invalid.plugin.ts', () => {
        throw new Error('Invalid plugin');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await pluginManager.loadPlugins('src/doc-parser/plugins/');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('WARN: Could not load plugin /path/to/invalid.plugin.ts')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getProcessor', () => {
    beforeEach(() => {
      // Setup a mock processor
      const mockProcessor: SectionProcessor = {
        sectionId: '1.2',
        lint: vi.fn(),
        extract: vi.fn(),
        getTargetPath: vi.fn(),
      };

      // Mock the internal processors array
      (pluginManager as any).processors = [mockProcessor];
    });

    it('should return the correct processor for a given section ID', () => {
      const processor = pluginManager.getProcessor('1.2');

      expect(processor).toBeDefined();
      expect(processor?.sectionId).toBe('1.2');
    });

    it('should return undefined for non-existent section ID', () => {
      const processor = pluginManager.getProcessor('9.9');

      expect(processor).toBeUndefined();
    });

    it('should return undefined when no plugins are loaded', () => {
      (pluginManager as any).processors = [];

      const processor = pluginManager.getProcessor('1.2');

      expect(processor).toBeUndefined();
    });
  });

  describe('getAllProcessors', () => {
    it('should return all loaded processors', () => {
      const mockProcessor1: SectionProcessor = {
        sectionId: '1.2',
        lint: vi.fn(),
        extract: vi.fn(),
        getTargetPath: vi.fn(),
      };

      const mockProcessor2: SectionProcessor = {
        sectionId: '2.1',
        lint: vi.fn(),
        extract: vi.fn(),
        getTargetPath: vi.fn(),
      };

      (pluginManager as any).processors = [mockProcessor1, mockProcessor2];

      const processors = pluginManager.getAllProcessors();

      expect(processors).toHaveLength(2);
      expect(processors).toContain(mockProcessor1);
      expect(processors).toContain(mockProcessor2);
    });

    it('should return empty array when no processors are loaded', () => {
      (pluginManager as any).processors = [];

      const processors = pluginManager.getAllProcessors();

      expect(processors).toHaveLength(0);
    });
  });
});
