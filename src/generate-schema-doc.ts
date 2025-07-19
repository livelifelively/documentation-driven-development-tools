import { generateHumanSchemaDocumentation, generateMachineSchemaDocumentation } from '.';
import * as fs from 'fs';
import * as path from 'path';

function main() {
  console.log('Generating dual schema documentation from JSON source...');

  try {
    // Ensure the output directory exists
    const outputDir = path.join(__dirname, 'generated-schema-docs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }
    // Generate human-readable documentation
    console.log('📖 Generating human-readable version...');
    const humanDocumentation = generateHumanSchemaDocumentation();
    const humanOutputPath = path.join(__dirname, 'generated-schema-docs', 'ddd-2-schema.human.md');
    fs.writeFileSync(humanOutputPath, humanDocumentation, 'utf8');
    console.log(`✅ Human version generated at: ${humanOutputPath}`);

    // Generate machine/LLM-focused documentation
    console.log('🤖 Generating machine/LLM version...');
    const machineDocumentation = generateMachineSchemaDocumentation();
    const machineOutputPath = path.join(__dirname, 'generated-schema-docs', 'ddd-2-schema.machine.md');
    fs.writeFileSync(machineOutputPath, machineDocumentation, 'utf8');
    console.log(`✅ Machine version generated at: ${machineOutputPath}`);

    console.log('\n🎉 Both documentation versions generated successfully!');
    console.log('📖 Human version: Optimized for human readability with visible examples');
    console.log('🤖 Machine version: Optimized for LLM consumption with code block examples');
  } catch (error) {
    console.error('❌ Failed to generate documentation:', error);
    process.exit(1);
  }
}

main();
