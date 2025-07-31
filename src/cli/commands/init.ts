import type { Argv, CommandModule } from 'yargs';
import { DocsInitializer } from '../services/docs-initializer.js';

export const initCommand: CommandModule = {
  command: 'init',
  describe: 'Initialize a new DDD project documentation structure.',
  builder: (yargs: Argv) =>
    yargs
      .option('force', {
        alias: 'f',
        type: 'boolean',
        description: 'Force overwrite of existing docs directory.',
        default: false,
      })
      .option('output-dir', {
        alias: 'o',
        type: 'string',
        description: 'The directory where the docs folder will be created.',
        default: process.cwd(),
      }),
  handler: async (argv: any) => {
    const initializer = new DocsInitializer();
    await initializer.initialize({
      outputDir: argv.outputDir,
      force: argv.force,
    });
    const docsPath = argv.outputDir === process.cwd() ? 'docs/' : `${argv.outputDir}/docs/`;
    console.log(`✅ DDD documentation structure initialized in '${docsPath}'`);
  },
};
