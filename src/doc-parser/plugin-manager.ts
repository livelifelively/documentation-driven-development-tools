import { glob } from 'glob';
import { SectionProcessor } from './plugin.types.js';

/**
 * Manages the loading and access to section processor plugins.
 * Dynamically loads plugins from a specified directory and provides
 * access to them by section ID.
 */
export class PluginManager {
  private processors: SectionProcessor[] = [];

  /**
   * Loads all plugin files from the specified directory.
   * @param directory The directory containing plugin files
   */
  async loadPlugins(directory: string): Promise<void> {
    try {
      const pluginFiles = glob.sync(`${directory}/*.plugin.ts`);

      for (const filePath of pluginFiles) {
        try {
          const pluginModule = await import(filePath);
          const processor = pluginModule.default as SectionProcessor;

          if (processor && processor.sectionId) {
            this.processors.push(processor);
          } else {
            console.warn(`WARN: Invalid plugin format in ${filePath}`);
          }
        } catch (error) {
          console.warn(`WARN: Could not load plugin ${filePath}: ${error}`);
        }
      }
    } catch (error) {
      console.warn(`WARN: Error loading plugins from ${directory}: ${error}`);
    }
  }

  /**
   * Gets a processor for a specific section ID.
   * @param sectionId The section ID to find a processor for
   * @returns The processor if found, undefined otherwise
   */
  getProcessor(sectionId: string): SectionProcessor | undefined {
    return this.processors.find((processor) => processor.sectionId === sectionId);
  }

  /**
   * Gets all loaded processors.
   * @returns Array of all loaded processors
   */
  getAllProcessors(): SectionProcessor[] {
    return [...this.processors];
  }

  /**
   * Manually adds a processor instance. Useful for testing.
   * @param processor The processor instance to add.
   */
  addProcessor(processor: SectionProcessor): void {
    if (processor && processor.sectionId) {
      this.processors.push(processor);
    }
  }
}
