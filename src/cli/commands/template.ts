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
    });

const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { type, name, parent, 'output-dir': outputDir, 'dry-run': dryRun } = argv;

  const request: TemplateRequest = {
    documentType: type,
    documentName: name,
    parentPlan: parent,
    outputDirectory: outputDir,
    isDryRun: dryRun,
  };

  const generator = new TemplateGenerator();
  const result = await generator.generate(request);

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
    console.error('❌ Error generating template:');
    result.errors?.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
};

export const templateCommand: CommandModule<{}, Options> = {
  command,
  describe: desc,
  builder,
  handler,
};
