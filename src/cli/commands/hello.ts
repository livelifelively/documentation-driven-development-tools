import type { CommandModule } from 'yargs';

/**
 * Hello Command - Placeholder command to verify CLI framework setup
 *
 * This is a simple test command to validate that the yargs framework
 * is properly configured and can execute commands successfully.
 */

interface HelloOptions {
  name?: string;
}

export const helloCommand: CommandModule<{}, HelloOptions> = {
  command: 'hello [name]',
  describe: 'A simple hello command to test the CLI framework',
  builder: (yargs) => {
    return yargs
      .positional('name', {
        type: 'string',
        default: 'World',
        describe: 'Name to greet',
      })
      .option('caps', {
        type: 'boolean',
        default: false,
        describe: 'Output greeting in uppercase',
        alias: 'c',
      });
  },
  handler: async (argv) => {
    const { name = 'World', caps } = argv;
    const greeting = `Hello, ${name}!`;

    if (caps) {
      console.log(greeting.toUpperCase());
    } else {
      console.log(greeting);
    }
  },
};
