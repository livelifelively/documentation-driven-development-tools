import type { Arguments, CommandBuilder, CommandModule } from 'yargs';
import { TemplateGenerator, TemplateRequest } from '../services/template-generator';

interface Options {
  type: 'plan' | 'task';
  name: string;
  parent?: string;
  'output-dir'?: string;
  'dry-run'?: boolean;
}

const command: string = 'template <type> <name>';
const desc: string = 'Generate a new plan or task template';

const builder: CommandBuilder<{}, Options> = (yargs) =>
  yargs
    .positional('type', {
      type: 'string',
      demandOption: true,
      choices: ['plan', 'task'] as const,
      description: 'The type of template to generate',
    })
    .positional('name', {
      type: 'string',
      demandOption: true,
      description: 'The name of the plan or task',
    })
    .option('parent', {
      alias: 'p',
      type: 'string',
      description: 'The parent plan for hierarchical naming',
    })
    .option('output-dir', {
      alias: 'o',
      type: 'string',
      description: 'The output directory for the generated file',
    })
    .option('dry-run', {
      alias: 'd',
      type: 'boolean',
      description: 'Show what would be generated without creating files',
    })
    .fail((msg, err) => {
      // err is the thrown error from the handler
      if (err) throw err;
      // msg is the validation error from yargs
      console.error(msg);
      process.exit(1);
    });

export const handler = async (argv: Arguments<Options>, generator?: TemplateGenerator): Promise<void> => {
  console.log('[DEBUG] process.argv:', process.argv);
  const { type, name, parent, 'output-dir': outputDir, 'dry-run': dryRun } = argv;

  const request: TemplateRequest = {
    documentType: type,
    documentName: name,
    parentPlan: parent === '' ? undefined : parent, // Explicitly set to undefined if parent is an empty string
    outputDirectory: outputDir,
    isDryRun: dryRun,
  };

  const templateGenerator = generator || new TemplateGenerator();
  const result = await templateGenerator.generate(request);

  if (result.success) {
    console.log(`✅ Successfully generated ${result.filePath}`);
    if (result.warnings && result.warnings.length > 0) {
      result.warnings.forEach((warning) => console.log(`⚠️ ${warning}`));
    }
    if (result.content) {
      console.log('\n--- File Content ---');
      console.log(result.content);
      console.log('--- End File Content ---\n');
    }
  } else {
    const errorMessages = result.errors?.join('\n') || 'Unknown error';
    console.error('❌ Error generating template:');
    result.errors?.forEach((error) => console.error(`- ${error}`));
    // Throw an error to ensure the process exits with a failure code for testing
    throw new Error(errorMessages);
  }
};

export const templateCommand: CommandModule<{}, Options> = {
  command,
  describe: desc,
  builder,
  handler,
};
