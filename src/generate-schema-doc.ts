import { generateHumanSchemaDocumentation, generateMachineSchemaDocumentation } from '.';
import { getConfig } from './config';
import { writeToMultipleLocations } from './path-utils';
import * as path from 'path';

export function run() {
  console.log('Generating dual schema documentation from JSON source...');

  try {
    const config = getConfig();

    // Generate human-readable documentation
    console.log('📖 Generating human-readable version...');
    const humanDocumentation = generateHumanSchemaDocumentation();
    const humanPaths = [
      path.join(config.schema.outputDirs.src, 'ddd-2-schema.human.md'),
      path.join(config.schema.outputDirs.docs, 'ddd-2-schema.human.md'),
    ];
    writeToMultipleLocations(humanDocumentation, humanPaths, 'Human-readable schema documentation');

    // Generate machine/LLM-focused documentation
    console.log('🤖 Generating machine/LLM version...');
    const machineDocumentation = generateMachineSchemaDocumentation();
    const machinePaths = [
      path.join(config.schema.outputDirs.src, 'ddd-2-schema.machine.md'),
      path.join(config.schema.outputDirs.docs, 'ddd-2-schema.machine.md'),
    ];
    writeToMultipleLocations(machineDocumentation, machinePaths, 'Machine-readable schema documentation');

    console.log('\n🎉 Both documentation versions generated successfully!');
    console.log('📖 Human version: Optimized for human readability with visible examples');
    console.log('🤖 Machine version: Optimized for LLM consumption with code block examples');
  } catch (error) {
    console.error('❌ Failed to generate documentation:', error);
    throw error;
  }
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    process.exit(1);
  }
}
