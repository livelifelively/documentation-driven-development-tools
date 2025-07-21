#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { templateCommand } from './commands/template.js';
import { helloCommand } from './commands/hello.js';

/**
 * Main CLI Application Entry Point
 *
 * Sets up the yargs framework and registers available commands.
 * This serves as the foundation for all DDD CLI tools.
 */
async function main() {
  const cli = yargs(hideBin(process.argv))
    .scriptName('ddd')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .version('1.0.0')
    .demandCommand(1, 'You need at least one command before moving on')
    .strict()
    .recommendCommands()
    .showHelpOnFail(false, 'Specify --help for available options');

  // Register commands
  cli.command(templateCommand);
  cli.command(helloCommand);

  // Parse and execute
  await cli.parseAsync();
}

// Execute main function and handle errors
main().catch((error) => {
  console.error('CLI Error:', error.message);
  process.exit(1);
});
