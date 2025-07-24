#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { templateCommand } from './commands/template';
import { helloCommand } from './commands/hello';

import pkg from '../../package.json';

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
    .showHelpOnFail(false, 'Specify --help for available options');

  // Register commands
  cli.command(templateCommand);
  cli.command(helloCommand);

  // Parse and execute
  await cli.parseAsync();
}

// Execute main function only when run directly
if (require.main === module) {
  main(hideBin(process.argv)).catch((error) => {
    // The .fail() handler in commands should catch this, but this is a fallback.
    if (process.env.NODE_ENV !== 'test') {
      console.error('CLI Error:', error.message);
      process.exit(1);
    }
  });
}
