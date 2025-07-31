#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { templateCommand } from './commands/template.js';
import { helloCommand } from './commands/hello.js';
import { initCommand } from './commands/init.js';

import pkg from '../../package.json' with { type: 'json' };

/**
 * Main CLI Application Entry Point
 *
 * Sets up the yargs framework and registers available commands.
 * This serves as the foundation for all DDD CLI tools.
 */
export async function main(args: string[]) {
  const cli = yargs(args)
    .scriptName('ddd')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .version(pkg.version)
    .strict()
    .recommendCommands()
    .showHelpOnFail(false, 'Specify --help for available options')
    .fail((msg, err, yargs) => {
      if (err) {
        console.error('❌ An unexpected error occurred:');
        console.error(err.message);
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        } else {
          // Re-throw in test env for Vitest to catch
          throw err;
        }
      }
      // Handle yargs-specific errors (e.g., invalid command)
      console.error(yargs.help());
      console.error(`\n❌ ${msg}`);
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
    });

  // Register commands
  cli.command(templateCommand);
  cli.command(helloCommand);
  cli.command(initCommand);

  // Parse and execute
  await cli.parseAsync();
}

// Execute main function only when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main(hideBin(process.argv));
}
